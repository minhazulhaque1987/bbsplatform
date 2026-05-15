/* ═══════════ NATIVE LOCAL NOTIFICATIONS for Crop Calendar ═══════════
 * Uses Capacitor Local Notifications plugin to send device-native
 * notifications that appear in the system tray (like other Android apps).
 *
 * Also provides a fallback to browser notifications when running outside
 * the native app (e.g. web preview).
 *
 * IMPORTANT: All exported functions are exposed on window with a "Native"
 * suffix so that crop.js can delegate to them without naming conflicts.
 * ════════════════════════════════════════════════════════════════════════ */

const CROP_NOTIF_KEY      = 'bbs_crop_notif_v1';   // 'on' | 'off'
const CROP_NOTIFIED_KEY   = 'bbs_crop_notified_v1'; // { "key_str": "2026-03-14" }

let _cropCapacitorNotifReady = false;

/* ─────────────────── Capacitor detection ─────────────────── */

function isNativeApp() {
  return typeof Capacitor !== 'undefined' && typeof Capacitor.isNativePlatform === 'function' && Capacitor.isNativePlatform();
}

function isCropNotifEnabled() {
  return localStorage.getItem(CROP_NOTIF_KEY) === 'on';
}

/* ─────────────────── Permission handling ─────────────────── */

async function requestCropNotificationPermission() {
  if (!isNativeApp()) {
    // Fallback: browser notification permission
    if (!('Notification' in window)) return false;
    const p = await Notification.requestPermission();
    return p === 'granted';
  }

  // Capacitor native permission
  if (typeof CapacitorNotifications === 'undefined') return false;
  try {
    const perm = await CapacitorNotifications.checkPermissions();
    if (perm.display === 'granted') return true;
    const req = await CapacitorNotifications.requestPermissions();
    return req.display === 'granted';
  } catch (e) {
    console.warn('CropNotification permission error:', e);
    return false;
  }
}

/* ─────────────────── Toggle notifications ─────────────────── */

async function toggleCropNotificationsNative() {
  const cur = localStorage.getItem(CROP_NOTIF_KEY) || 'off';

  if (cur === 'on') {
    // Turn off → cancel all scheduled & clear flag
    localStorage.setItem(CROP_NOTIF_KEY, 'off');
    localStorage.removeItem(CROP_NOTIFIED_KEY);
    if (isNativeApp() && typeof CapacitorNotifications !== 'undefined') {
      try { await CapacitorNotifications.cancel({ notifications: [{ id: 0 }] }); } catch (e) {}
      try { await CapacitorNotifications.removeAllListeners(); } catch (e) {}
      try { await CapacitorNotifications.cancelAll(); } catch (e) {}
    }
    if (typeof toast === 'function') toast('নোটিফিকেশন বন্ধ করা হয়েছে', '');
    updateCropNotifBtnUI();
    return;
  }

  // Turn on → request permission first
  const granted = await requestCropNotificationPermission();
  if (!granted) {
    if (typeof toast === 'function') {
      toast('নোটিফিকেশনের অনুমতি দেওয়া হয়নি। সেটিংস থেকে অনুমতি দিন।', 'warn');
    }
    return;
  }

  localStorage.setItem(CROP_NOTIF_KEY, 'on');
  if (typeof toast === 'function') toast('নোটিফিকেশন চালু করা হয়েছে ✅', 'success');
  updateCropNotifBtnUI();

  // Schedule immediately
  scheduleCropNotifications();
}

/* ─────────────────── UI button ─────────────────── */

function updateCropNotifBtnUI() {
  const btn = document.getElementById('crop-notif-btn');
  if (!btn) return;
  const on = localStorage.getItem(CROP_NOTIF_KEY) === 'on';
  btn.textContent = on ? '🔔' : '🔕';
  btn.title = on ? 'নোটিফিকেশন চালু আছে – ক্লিক করে বন্ধ করুন' : 'নোটিফিকেশন বন্ধ – ক্লিক করে চালু করুন';
}

/* ─────────────────── Core: Schedule Notifications ─────────────────── */

function scheduleCropNotifications() {
  if (localStorage.getItem(CROP_NOTIF_KEY) !== 'on') {
    updateCropNotifBtnUI();
    return;
  }

  const items = buildCropItemsForNotif();
  if (!items || items.length === 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);
  const notified = getCropNotifiedMap();

  // Filter items that need notification
  const toNotify = items.filter(it => {
    if (it.isDone) return false;
    // Notify at: 3 days before, 1 day before, and on the deadline day
    const validDiffs = [0, 1, 3];
    if (!validDiffs.includes(it.diffDays)) return false;
    // Already notified today?
    if (notified[it.notifKey] === todayStr) return false;
    return true;
  });

  if (toNotify.length === 0) return;

  if (isNativeApp()) {
    scheduleNativeNotifications(toNotify, todayStr, notified);
  } else {
    scheduleBrowserNotifications(toNotify, todayStr, notified);
  }

  updateCropNotifBtnUI();
}

/* Build a flat list of items that need notification tracking */
function buildCropItemsForNotif() {
  if (typeof cropCurrentMode === 'undefined') return [];
  if (typeof buildCropItems !== 'function') return [];
  const items = buildCropItems(cropCurrentMode);
  const CROP_MODE_LABELS = window.CROP_MODE_LABELS || {
    u2d: { from: 'উপজেলা', to: 'জেলা' },
    d2v: { from: 'জেলা', to: 'বিভাগ' },
    v2s: { from: 'বিভাগ', to: 'সদর দপ্তর' }
  };
  const lbl = CROP_MODE_LABELS[cropCurrentMode] || CROP_MODE_LABELS.u2d;
  return items.map(it => ({
    ...it,
    notifKey: `crop_${it.key}`,
    title: it.diffDays === 0 ? '⏰ আজই শেষ দিন!'
         : it.diffDays === 1 ? '📌 আগামীকাল শেষ দিন!'
         : '🗓 ৩ দিন বাকি',
    body: `${it.report_name}\n${lbl.from} → ${lbl.to}\nশেষ তারিখ: ${it.day} ${window.CROP_BN_MONTHS ? window.CROP_BN_MONTHS[it.month - 1] : it.month}`
  }));
}

/* ─────────────────── Native (Capacitor) Notifications ─────────────────── */

async function scheduleNativeNotifications(items, todayStr, notified) {
  if (typeof CapacitorNotifications === 'undefined') {
    console.warn('CapacitorNotifications plugin not available');
    return;
  }

  const CROP_BN_MONTHS = window.CROP_BN_MONTHS || [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  for (const it of items) {
    // Generate a unique ID from the key hash
    const notifId = hashString(it.notifKey);

    // Schedule for 9:00 AM today (push notification immediately or at 9 AM)
    const now = new Date();
    const scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    if (now.getHours() >= 9) {
      // If it's already past 9 AM, schedule a few seconds from now
      scheduleTime.setTime(now.getTime() + 3000);
    }

    const notification = {
      id: notifId,
      title: it.title,
      body: it.body,
      largeBody: it.body,
      summaryText: `ক্রপ ক্যালেন্ডার: ${it.report_name}`,
      schedule: { at: scheduleTime },
      smallIcon: 'ic_stat_icon',
      iconColor: '#2e7d32',
      channelId: 'bbs-crop-calendar',
      actionTypeId: '',
      extra: {
        reportKey: it.key,
        reportName: it.report_name,
        mode: cropCurrentMode
      }
    };

    try {
      await CapacitorNotifications.schedule({ notifications: [notification] });
      notified[it.notifKey] = todayStr;
    } catch (e) {
      console.warn('Failed to schedule native notification:', e);
    }
  }

  localStorage.setItem(CROP_NOTIFIED_KEY, JSON.stringify(notified));
}

/* ─────────────────── Browser fallback notifications ─────────────────── */

function scheduleBrowserNotifications(items, todayStr, notified) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  items.forEach(it => {
    try {
      new Notification(it.title, {
        body: it.body,
        tag: it.notifKey,
        icon: 'resources/BBS Logo.svg'
      });
      notified[it.notifKey] = todayStr;
    } catch (e) {
      // ignore
    }
  });

  localStorage.setItem(CROP_NOTIFIED_KEY, JSON.stringify(notified));
}

/* ─────────────────── Helper: hash string to number ─────────────────── */

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % 2147483647; // Ensure positive within int range
}

/* ─────────────────── Notified map helpers ─────────────────── */

function getCropNotifiedMap() {
  try { return JSON.parse(localStorage.getItem(CROP_NOTIFIED_KEY)) || {}; }
  catch { return {}; }
}

/* ─────────────────── EXPOSE functions to window (so crop.js can find them) ─────────────────── */

// Explicitly assign all notification functions to window so they are
// accessible from crop.js regardless of script load timing.
window.toggleCropNotificationsNative = toggleCropNotificationsNative;
window.updateCropNotifBtnUI         = updateCropNotifBtnUI;
window.scheduleCropNotifications    = scheduleCropNotifications;

/* ─────────────────── Initialize Capacitor Plugin Reference ─────────────────── */

function initCropCapacitorNotif() {
  if (_cropCapacitorNotifReady) return;

  if (isNativeApp()) {
    // Register the plugin reference
    try {
      if (typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.LocalNotifications) {
        window.CapacitorNotifications = Capacitor.Plugins.LocalNotifications;
        _cropCapacitorNotifReady = true;
        console.log('[CropNotif] Capacitor LocalNotifications ready');

        // Listen for notification taps → navigate to crop view
        CapacitorNotifications.addListener('localNotificationReceived', (notif) => {
          console.log('[CropNotif] Notification received while app open:', notif);
        });

        CapacitorNotifications.addListener('localNotificationActionPerformed', (action) => {
          console.log('[CropNotif] Notification action performed:', action);
          // Navigate to crop calendar view
          if (typeof goView === 'function') {
            setTimeout(() => {
              goView('v-crop');
              if (typeof renderCropView === 'function') renderCropView();
            }, 300);
          }
        });

        // Create notification channel
        createCropNotificationChannel();
      }
    } catch (e) {
      console.warn('[CropNotif] Failed to init Capacitor notifications:', e);
    }
  }

  // Update the UI button state
  updateCropNotifBtnUI();
}

/* ─────────────────── Android Notification Channel ─────────────────── */

async function createCropNotificationChannel() {
  if (typeof CapacitorNotifications === 'undefined') return;
  try {
    const channels = await CapacitorNotifications.listChannels();
    const exists = channels.channels && channels.channels.some(c => c.id === 'bbs-crop-calendar');
    if (!exists) {
      await CapacitorNotifications.createChannel({
        id: 'bbs-crop-calendar',
        name: 'ক্রপ ক্যালেন্ডার',
        description: 'BBS ক্রপ ক্যালেন্ডার রিমাইন্ডার নোটিফিকেশন',
        importance: 4, // High
        visibility: 1, // Public
        sound: 'default',
        vibration: true,
        lightColor: '#2e7d32'
      });
      console.log('[CropNotif] Notification channel created');
    }
  } catch (e) {
    console.warn('[CropNotif] Channel creation error:', e);
  }
}

/* ─────────────────── Initialize on DOM ready ─────────────────── */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCropCapacitorNotif);
} else {
  initCropCapacitorNotif();
}