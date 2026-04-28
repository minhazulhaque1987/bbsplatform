/* ═══════════ BBS CROP CALENDAR ═══════════
 * Office-type aware crop report submission scheduler.
 *
 * Mode mapping based on logged-in user's officeType (set during signup
 * from the autocomplete office list):
 *   Upazila    → u2d (Upazila    → District   submission)
 *   District   → d2v (District   → Division   submission)
 *   Divisional → v2s (Division   → Sadar Daptar submission)
 *   HQ Wing / others → defaults to u2d, mode switcher visible
 * ═════════════════════════════════════════ */

const CROP_BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const CROP_MODE_LABELS = {
  u2d: { from: 'উপজেলা', to: 'জেলা',  badge: 'উপজেলা → জেলা',           tone: '#2e7d32' },
  d2v: { from: 'জেলা',    to: 'বিভাগ', badge: 'জেলা → বিভাগ',            tone: '#1565c0' },
  v2s: { from: 'বিভাগ',   to: 'সদর দপ্তর', badge: 'বিভাগ → সদর দপ্তর',  tone: '#c62828' }
};

const CROP_DONE_KEY    = 'bbs_crop_done_v1';   // { "u2d_2026_3_15": true }
const CROP_NOTIF_KEY   = 'bbs_crop_notif_v1';  // 'on' | 'off'
const CROP_NOTIFIED_KEY= 'bbs_crop_notified_v1'; // { "u2d_2026_3_15": "2026-03-14" }

let cropCurrentMode = 'u2d';
let cropCurrentTab  = 'rem';

/* ─────────────────── helpers ─────────────────── */

function bnNum(n) {
  // Convert Western digits to Bangla digits
  const map = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return String(n).replace(/\d/g, d => map[+d]);
}

function getCropDoneMap() {
  try { return JSON.parse(localStorage.getItem(CROP_DONE_KEY)) || {}; }
  catch { return {}; }
}

function saveCropDoneMap(m) {
  localStorage.setItem(CROP_DONE_KEY, JSON.stringify(m));
}

function cropReportKey(mode, year, month, day, idx) {
  return `${mode}_${year}_${month}_${day}_${idx}`;
}

function getCropDataFor(mode) {
  if (typeof BBS_CROP_DATA === 'undefined' || !BBS_CROP_DATA) return [];
  return BBS_CROP_DATA[mode] || [];
}

function pickModeFor(user) {
  if (!user || !user.officeType) return null;
  switch (user.officeType) {
    case 'Upazila':    return 'u2d';
    case 'District':   return 'd2v';
    case 'Divisional': return 'v2s';
    default: return null; // HQ Wing / unknown → no fixed mode
  }
}

/* Build a sorted list of items with computed deadline / status for current year */
function buildCropItems(mode) {
  const data = getCropDataFor(mode);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const done = getCropDoneMap();

  return data.map((it, idx) => {
    const deadline = new Date(year, it.month - 1, it.day);
    deadline.setHours(0, 0, 0, 0);
    const diffDays = Math.round((deadline - today) / 86400000);
    const key = cropReportKey(mode, year, it.month, it.day, idx);
    const isDone = !!done[key];
    let status;
    if (isDone) status = 'done';
    else if (diffDays < 0) status = 'overdue';
    else if (diffDays === 0) status = 'today';
    else if (diffDays <= 7) status = 'soon';
    else status = 'upcoming';
    return { ...it, idx, key, deadline, diffDays, isDone, status };
  }).sort((a, b) => a.deadline - b.deadline || a.report_name.localeCompare(b.report_name, 'bn'));
}

/* ─────────────────── view / mode ─────────────────── */

function renderCropView() {
  if (typeof BBS_CROP_DATA === 'undefined' || !BBS_CROP_DATA) {
    const host = document.getElementById('crop-reminders');
    if (host) host.innerHTML = '<div class="crop-empty">ডাটা লোড হয়নি।</div>';
    return;
  }

  const u = (typeof CURRENT_USER !== 'undefined' && CURRENT_USER) ? CURRENT_USER : null;
  const fixed = pickModeFor(u);
  const switcher = document.getElementById('crop-mode-row');

  if (fixed) {
    cropCurrentMode = fixed;
    if (switcher) switcher.style.display = 'none';
  } else {
    if (switcher) switcher.style.display = '';
    const sel = document.getElementById('crop-mode-sel');
    if (sel) sel.value = cropCurrentMode;
  }

  // ─── Floating user identity card ───
  const avEl   = document.getElementById('cuc-avatar');
  const nmEl   = document.getElementById('cuc-name');
  const ptEl   = document.getElementById('cuc-post');
  const ofEl   = document.getElementById('cuc-office');
  const tpEl   = document.getElementById('cuc-type');
  if (u) {
    if (nmEl) nmEl.textContent = u.name || '—';
    if (ptEl) ptEl.textContent = u.post || '—';
    if (ofEl) ofEl.textContent = u.office || '—';
    if (tpEl) {
      tpEl.textContent = u.officeType || (u.role === 'admin' ? 'এডমিন' : 'অজানা');
      tpEl.style.display = '';
    }
    if (avEl) {
      if (u.photo) {
        avEl.style.backgroundImage = `url("${u.photo}")`;
        avEl.textContent = '';
      } else {
        avEl.style.backgroundImage = '';
        avEl.textContent = (u.name || 'কর্ম').trim().slice(0, 2);
      }
    }
  } else {
    if (nmEl) nmEl.textContent = 'গেস্ট ইউজার';
    if (ptEl) ptEl.textContent = '—';
    if (ofEl) ofEl.textContent = '—';
    if (tpEl) tpEl.style.display = 'none';
    if (avEl) { avEl.textContent = '👤'; avEl.style.backgroundImage = ''; }
  }

  applyCropMode();
}

function setCropMode(mode) {
  cropCurrentMode = mode;
  applyCropMode();
}

function applyCropMode() {
  const lbl = CROP_MODE_LABELS[cropCurrentMode] || CROP_MODE_LABELS.u2d;
  const badge = document.getElementById('crop-mode-badge');
  if (badge) {
    badge.textContent = lbl.badge;
  }
  // populate month dropdown if empty
  const msel = document.getElementById('crop-month-sel');
  if (msel && msel.options.length <= 1) {
    CROP_BN_MONTHS.forEach((m, i) => {
      const o = document.createElement('option');
      o.value = String(i + 1);
      o.textContent = m;
      msel.appendChild(o);
    });
  }
  cropTab(cropCurrentTab);
  renderCropStats();
  renderCropReminders();
  renderCropCal();
  scheduleBrowserCropNotif();
}

function cropTab(tab) {
  cropCurrentTab = tab;
  const remBtn = document.getElementById('ct-rem');
  const calBtn = document.getElementById('ct-cal');
  const remView = document.getElementById('crop-rem-view');
  const calView = document.getElementById('crop-cal-view');
  if (remBtn) remBtn.classList.toggle('on', tab === 'rem');
  if (calBtn) calBtn.classList.toggle('on', tab === 'cal');
  if (remView) remView.style.display = tab === 'rem' ? '' : 'none';
  if (calView) calView.style.display = tab === 'cal' ? '' : 'none';
}

/* ─────────────────── stats ─────────────────── */

function renderCropStats() {
  const items = buildCropItems(cropCurrentMode);
  let total = items.length, done = 0, over = 0, pend = 0;
  items.forEach(it => {
    if (it.isDone) done++;
    else if (it.status === 'overdue') over++;
    else pend++;
  });
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = bnNum(v); };
  set('cs-total', total);
  set('cs-done', done);
  set('cs-pend', pend);
  set('cs-over', over);

  // Bottom-nav badge: due in next 7 days (not done) + overdue
  const btn = document.getElementById('bn-crop');
  if (btn) {
    let badge = btn.querySelector('.bni-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'bni-badge';
      btn.appendChild(badge);
    }
    // Match reminder view: only items due in next 7 days
    const urgent = items.filter(it => !it.isDone && it.diffDays >= 0 && it.diffDays <= 7).length;
    if (urgent > 0) {
      badge.textContent = bnNum(urgent);
      badge.classList.add('on');
    } else {
      badge.textContent = '';
      badge.classList.remove('on');
    }
  }
}

/* ─────────────────── reminders ─────────────────── */

function renderCropReminders() {
  const host = document.getElementById('crop-reminders');
  if (!host) return;
  const items = buildCropItems(cropCurrentMode);
  // ONLY today + next 7 days, not done. No past/overdue items here.
  const target = items.filter(it => !it.isDone && it.diffDays >= 0 && it.diffDays <= 7);

  if (target.length === 0) {
    // friendly empty state — show next upcoming if any
    const nextUp = items.find(it => !it.isDone && it.diffDays > 7);
    const sub = nextUp
      ? `<div class="crop-empty-sub">পরবর্তী প্রতিবেদন: ${bnNum(nextUp.day)} ${CROP_BN_MONTHS[nextUp.month - 1]} (${bnNum(nextUp.diffDays)} দিন পর)</div>`
      : '<div class="crop-empty-sub">এই বছরের সব প্রতিবেদন দাখিল হয়েছে অথবা মেয়াদ শেষ।</div>';
    host.innerHTML = `<div class="crop-empty"><span class="crop-empty-emoji">🎉</span>আগামী ৭ দিনে কোনো প্রতিবেদন প্রেরণের সময়সূচী নেই${sub}</div>`;
    return;
  }

  // Section title
  let html = `<div class="crop-sec-ttl"><span>⏰ আগামী ৭ দিনের প্রতিবেদন</span><span>${bnNum(target.length)}টি</span></div>`;

  // Group by date
  const groups = {};
  target.forEach(it => {
    const k = `${it.month}-${it.day}`;
    if (!groups[k]) groups[k] = { day: it.day, month: it.month, deadline: it.deadline, diff: it.diffDays, items: [] };
    groups[k].items.push(it);
  });
  const lbl = CROP_MODE_LABELS[cropCurrentMode];

  Object.values(groups).sort((a, b) => a.deadline - b.deadline).forEach(g => {
    const cls = g.diff === 0 ? 'today'
              : g.diff <= 2 ? 'urgent'
              : g.diff <= 5 ? 'soon'
              : 'upcoming';
    const status = g.diff === 0 ? 'আজই শেষ দিন'
                 : g.diff === 1 ? 'আগামীকাল শেষ দিন'
                 : `${bnNum(g.diff)} দিন বাকি`;
    const tagShort = g.diff === 0 ? 'আজ'
                   : g.diff === 1 ? '১ দিন'
                   : `${bnNum(g.diff)} দিন`;

    const itemsHtml = g.items.map(it => `
      <div class="crop-rep-row">
        <input type="checkbox" class="crop-chk" id="chk-${it.key}" ${it.isDone ? 'checked' : ''}
               onchange="toggleCropDone('${it.key}', this.checked)">
        <label for="chk-${it.key}">${it.report_name}</label>
      </div>`).join('');

    html += `
      <div class="crop-rem-card ${cls}">
        <div class="crop-rem-date">
          <div class="crd-day">${bnNum(g.day)}</div>
          <div class="crd-mon">${CROP_BN_MONTHS[g.month - 1]}</div>
          <div class="crd-tag">${tagShort}</div>
        </div>
        <div class="crop-rem-body">
          <div class="crop-rem-status">${status}</div>
          <div class="crop-rep-list">${itemsHtml}</div>
        </div>
      </div>`;
  });
  host.innerHTML = html;
}

/* ─────────────────── calendar / full list ─────────────────── */

function renderCropCal() {
  const host = document.getElementById('crop-cal-list');
  if (!host) return;
  const items = buildCropItems(cropCurrentMode);
  const month = (document.getElementById('crop-month-sel') || {}).value || 'all';
  const term  = ((document.getElementById('crop-search') || {}).value || '').trim().toLowerCase();
  const stat  = (document.getElementById('crop-status-sel') || {}).value || 'all';

  const filtered = items.filter(it => {
    if (month !== 'all' && it.month !== +month) return false;
    if (term && !it.report_name.toLowerCase().includes(term)) return false;
    if (stat === 'pending'  && it.isDone) return false;
    if (stat === 'pending'  && it.status === 'overdue') return false;
    if (stat === 'done'     && !it.isDone) return false;
    if (stat === 'overdue'  && it.status !== 'overdue') return false;
    return true;
  });

  if (filtered.length === 0) {
    host.innerHTML = '<div class="crop-empty">কোনো প্রতিবেদন পাওয়া যায়নি।</div>';
    return;
  }

  // group by month
  const byMonth = {};
  filtered.forEach(it => {
    if (!byMonth[it.month]) byMonth[it.month] = [];
    byMonth[it.month].push(it);
  });

  let html = '';
  Object.keys(byMonth).map(Number).sort((a, b) => a - b).forEach(m => {
    html += `<div class="crop-month-head">${CROP_BN_MONTHS[m - 1]}</div>`;
    byMonth[m].forEach(it => {
      const cls = it.isDone ? 'done' : it.status;
      const tag = it.isDone ? '✅ দাখিল'
                : it.status === 'overdue' ? `❗ ${bnNum(Math.abs(it.diffDays))} দিন বিলম্ব`
                : it.status === 'today'   ? '⏰ আজ'
                : it.status === 'soon'    ? `⏳ ${bnNum(it.diffDays)} দিন বাকি`
                : `📅 ${bnNum(it.diffDays)} দিন পরে`;
      html += `
        <div class="crop-cal-row ${cls}">
          <input type="checkbox" class="crop-chk" id="rowchk-${it.key}" ${it.isDone ? 'checked' : ''}
                 onchange="toggleCropDone('${it.key}', this.checked)">
          <div class="crop-cal-body">
            <div class="crop-cal-name">${it.report_name}</div>
            <div class="crop-cal-meta">
              <span class="crop-cal-date">${bnNum(it.day)} ${CROP_BN_MONTHS[it.month - 1]}</span>
              <span class="crop-cal-tag">${tag}</span>
            </div>
          </div>
        </div>`;
    });
  });
  host.innerHTML = html;
}

/* ─────────────────── done toggle ─────────────────── */

function toggleCropDone(key, val) {
  const m = getCropDoneMap();
  if (val) m[key] = true; else delete m[key];
  saveCropDoneMap(m);
  renderCropStats();
  renderCropReminders();
  renderCropCal();
  if (typeof toast === 'function') {
    toast(val ? 'প্রতিবেদন দাখিল হিসেবে চিহ্নিত' : 'চিহ্ন সরানো হলো', val ? 'success' : '');
  }
}

/* ─────────────────── copy / share ─────────────────── */

function copyCropMessage(msg) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(msg).then(() => {
      if (typeof toast === 'function') toast('মেসেজ ক্লিপবোর্ডে কপি হয়েছে', 'success');
    }).catch(() => fallbackCopy(msg));
  } else {
    fallbackCopy(msg);
  }
}

function fallbackCopy(msg) {
  const ta = document.createElement('textarea');
  ta.value = msg;
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); if (typeof toast === 'function') toast('কপি হয়েছে', 'success'); }
  catch (e) { if (typeof toast === 'function') toast('কপি ব্যর্থ', 'warn'); }
  document.body.removeChild(ta);
}

function shareCropMessage(msg) {
  if (navigator.share) {
    navigator.share({ title: 'BBS ক্রপ ক্যালেন্ডার', text: msg }).catch(() => {});
  } else {
    copyCropMessage(msg);
  }
}

/* ─────────────────── browser notifications ─────────────────── */

function toggleCropNotifications() {
  const cur = localStorage.getItem(CROP_NOTIF_KEY) || 'off';
  if (cur === 'on') {
    localStorage.setItem(CROP_NOTIF_KEY, 'off');
    if (typeof toast === 'function') toast('নোটিফিকেশন বন্ধ', '');
    updateCropNotifBtn();
    return;
  }
  if (!('Notification' in window)) {
    if (typeof toast === 'function') toast('এই ব্রাউজার নোটিফিকেশন সমর্থন করে না', 'warn');
    return;
  }
  Notification.requestPermission().then(p => {
    if (p === 'granted') {
      localStorage.setItem(CROP_NOTIF_KEY, 'on');
      if (typeof toast === 'function') toast('নোটিফিকেশন চালু', 'success');
      scheduleBrowserCropNotif();
    } else {
      if (typeof toast === 'function') toast('অনুমতি দেওয়া হয়নি', 'warn');
    }
    updateCropNotifBtn();
  });
}

function updateCropNotifBtn() {
  const btn = document.getElementById('crop-notif-btn');
  if (!btn) return;
  const on = localStorage.getItem(CROP_NOTIF_KEY) === 'on';
  btn.textContent = on ? '🔔' : '🔕';
  btn.title = on ? 'নোটিফিকেশন চালু' : 'নোটিফিকেশন বন্ধ';
}

function scheduleBrowserCropNotif() {
  if (localStorage.getItem(CROP_NOTIF_KEY) !== 'on') { updateCropNotifBtn(); return; }
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const items = buildCropItems(cropCurrentMode);
  const today = new Date(); today.setHours(0,0,0,0);
  const todayStr = today.toISOString().slice(0,10);
  const notified = (() => {
    try { return JSON.parse(localStorage.getItem(CROP_NOTIFIED_KEY)) || {}; }
    catch { return {}; }
  })();

  // Fire instantly for: items due in next 3 days (today/+1/+2/+3), not done — once per day per item
  const due = items.filter(it => !it.isDone && it.diffDays >= 0 && it.diffDays <= 3);
  due.forEach(it => {
    if (notified[it.key] === todayStr) return;
    const lbl = CROP_MODE_LABELS[cropCurrentMode];
    const title = it.diffDays === 0 ? '⏰ আজই শেষ দিন'
                : it.diffDays === 1 ? '📌 আগামীকাল শেষ দিন'
                : `🗓 ${bnNum(it.diffDays)} দিনের মধ্যে দাখিল`;
    const body = `${it.report_name}\n${lbl.from} → ${lbl.to}`;
    try { new Notification(title, { body, tag: it.key, icon: 'resources/BBS Logo.svg' }); } catch (e) {}
    notified[it.key] = todayStr;
  });
  localStorage.setItem(CROP_NOTIFIED_KEY, JSON.stringify(notified));
  updateCropNotifBtn();
}

/* ─────────────────── dashboard widget ─────────────────── */

function renderCropDashWidget() {
  const host = document.getElementById('dash-crop-widget');
  if (!host) return;
  const u = (typeof CURRENT_USER !== 'undefined' && CURRENT_USER) ? CURRENT_USER : null;
  const fixed = pickModeFor(u);
  const mode = fixed || 'u2d';
  const items = buildCropItems(mode);
  const upcoming = items.filter(it => !it.isDone && (it.status === 'overdue' || it.diffDays <= 14)).slice(0, 3);
  if (upcoming.length === 0) {
    host.innerHTML = '<div class="dcw-empty">🎉 আগামী ১৪ দিনে কোনো বকেয়া প্রতিবেদন নেই।</div>';
    return;
  }
  const lbl = CROP_MODE_LABELS[mode];
  let html = `<div class="dcw-head"><span class="dcw-ttl">আসছে প্রতিবেদন</span><span class="dcw-mode">${lbl.badge}</span></div>`;
  upcoming.forEach(it => {
    const tag = it.diffDays < 0 ? `<span class="dcw-tag over">${bnNum(Math.abs(it.diffDays))} দিন বিলম্ব</span>`
              : it.diffDays === 0 ? '<span class="dcw-tag today">আজই</span>'
              : `<span class="dcw-tag soon">${bnNum(it.diffDays)} দিন</span>`;
    html += `
      <div class="dcw-row" onclick="goView('v-crop')">
        <div class="dcw-name">${it.report_name}</div>
        <div class="dcw-meta">${bnNum(it.day)} ${CROP_BN_MONTHS[it.month - 1]} ${tag}</div>
      </div>`;
  });
  host.innerHTML = html;
}
