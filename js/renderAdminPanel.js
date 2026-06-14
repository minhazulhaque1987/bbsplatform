/* ═══════════ ADMIN PANEL ═══════════ */
function renderAdminPanel() {
  // Get users as object to preserve keys
  const usersObj = window.getUsersObject ? window.getUsersObject() : {};
  const usersList = Object.entries(usersObj).map(([key, user]) => ({ ...user, _uid: key }));
  const users = usersList.filter(u=>u.role!=='admin');
  const pending  = users.filter(u=>u.status==='pending');
  const approved = users.filter(u=>u.status==='approved');

  document.getElementById('admin-pending-count').textContent = pending.length;
  document.getElementById('admin-active-count').textContent  = approved.length;
  document.getElementById('admin-total-count').textContent   = users.length;

  const colors = ['#0A2342','#006A4E','#1A4A8A','#7B2D8B','#C8102E'];

  const pList = document.getElementById('pending-list');
  pList.innerHTML = pending.length===0
    ? `<div style="padding:16px 20px;color:var(--g400);font-size:12px;font-family:'Noto Sans Bengali',sans-serif">কোনো অনুমোদন বাকি নেই ✅</div>`
    : pending.map(u=>{
        const bg = colors[(u.name||'?').charCodeAt(0)%colors.length];
        const initials = (u.name||'?').charAt(0).toUpperCase();
        return `<div class="req-card pending">
          <div class="req-header">
            <div class="req-av" style="background:${bg}">${initials}</div>
            <div><div class="req-name">${u.name}</div><div class="req-post">${u.post||'—'} · ${u.office||'—'}</div></div>
          </div>
          <div class="req-info-row">
            <span class="req-chip">📧 ${u.email}</span>
            <span class="req-chip">📱 ${u.phone}</span>
            <span class="req-chip">📅 ${new Date(u.createdAt).toLocaleDateString('bn-BD')}</span>
          </div>
          <div class="req-btns">
            <button class="req-approve" onclick="approveUser('${u.email}')">✅ অনুমোদন দিন</button>
            <button class="req-reject"  onclick="rejectUser('${u.email}')">❌ প্রত্যাখ্যান</button>
          </div>
        </div>`;
      }).join('');

  const aList = document.getElementById('approved-list');
  aList.innerHTML = approved.length===0
    ? `<div style="padding:16px 20px;color:var(--g400);font-size:12px;font-family:'Noto Sans Bengali',sans-serif">কোনো অনুমোদিত কর্মী নেই</div>`
    : approved.map(u=>{
        const bg = colors[(u.name||'?').charCodeAt(0)%colors.length];
        const initials = (u.name||'?').charAt(0).toUpperCase();
        return `<div class="req-card">
          <div class="req-header">
            <div class="req-av" style="background:${bg}">${initials}</div>
            <div><div class="req-name">${u.name}</div><div class="req-post">${u.post||'—'} · ${u.office||'—'}</div></div>
            <span style="margin-left:auto;font-size:10px;font-weight:700;color:var(--green);font-family:'Noto Sans Bengali',sans-serif">🆔 ${u.userId||'—'}</span>
          </div>
          <div class="req-info-row">
            <span class="req-chip">📧 ${u.email}</span>
            <span class="req-chip">📱 ${u.phone}</span>
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="revokeUser('${u.email}')" style="padding:8px 14px;background:var(--red-l);border:none;border-radius:8px;color:var(--red);font-size:11px;font-weight:700;cursor:pointer;font-family:'Noto Sans Bengali',sans-serif">অনুমোদন বাতিল</button>
          </div>
        </div>`;
      }).join('');
  aList.innerHTML += '<div style="height:8px"></div>';

  if (typeof loadUpdateManager === 'function') {
    loadUpdateManager();
  }
}

function getAppUpdateForm() {
  return {
    versionCodeEl: document.getElementById('update-version-code'),
    versionNameEl: document.getElementById('update-version-name'),
    apkUrlEl: document.getElementById('update-apk-url'),
    messageEl: document.getElementById('update-message'),
    statusEl: document.getElementById('update-manager-status')
  };
}

function setUpdateStatus(text, tone) {
  const { statusEl } = getAppUpdateForm();
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.style.background = tone === 'ok'
    ? 'rgba(34,197,94,.18)'
    : tone === 'err'
      ? 'rgba(239,68,68,.18)'
      : 'rgba(255,255,255,.12)';
}

function loadUpdateManager() {
  const form = getAppUpdateForm();
  if (!form.versionCodeEl) return;

  const current = window.APP_LOCAL_VERSION || { versionCode: 2, versionName: '1.1' };
  const cached = StorageGet('bbs_app_update_cache_v1') || {};
  const data = {
    versionCode: cached.versionCode || (Number(current.versionCode) + 1),
    versionName: cached.versionName || '',
    apkUrl: cached.apkUrl || '',
    message: cached.message || ''
  };

  form.versionCodeEl.value = data.versionCode;
  form.versionNameEl.value = data.versionName;
  form.apkUrlEl.value = data.apkUrl;
  form.messageEl.value = data.message;
  setUpdateStatus(cached.versionCode ? 'Loaded' : 'Ready', cached.versionCode ? 'ok' : '');
}

async function saveAppUpdate() {
  const form = getAppUpdateForm();
  if (!form.versionCodeEl) return;

  const payload = {
    versionCode: Number(form.versionCodeEl.value || 0),
    versionName: String(form.versionNameEl.value || '').trim(),
    apkUrl: String(form.apkUrlEl.value || '').trim(),
    message: String(form.messageEl.value || '').trim()
  };

  if (!payload.versionCode || !payload.apkUrl) {
    setUpdateStatus('Need versionCode + apkUrl', 'err');
    toast('Version code এবং APK URL দিতে হবে', 'err');
    return;
  }

  try {
    if (window.database) {
      await window.database.ref('app/update').set(payload);
      StorageSet('bbs_app_update_cache_v1', payload);
      setUpdateStatus('Saved to Firebase', 'ok');
      toast('Update info saved', 'ok');
    } else {
      throw new Error('Firebase unavailable');
    }
  } catch (err) {
    console.error('Save update failed:', err);
    setUpdateStatus('Save failed', 'err');
    toast('Update save failed: ' + (err.message || 'Unknown'), 'err');
  }
}

function approveUser(email) {
  console.log('Approving user:', email);
  const usersObj = window.getUsersObject ? window.getUsersObject() : {};
  let userKey = null;
  let user = null;

  // Find user by email and get the key
  for (const [key, userData] of Object.entries(usersObj)) {
    if (userData.email === email) {
      userKey = key;
      user = userData;
      break;
    }
  }

  if (!user || !userKey) {
    console.warn('User not found:', email);
    toast('ব্যবহারকারী পাওয়া যায়নি', 'err');
    return;
  }

  const newUserId = window.genUserId ? window.genUserId(user.name) : 'BBS0001';
  console.log('Updating user with key:', userKey, 'newId:', newUserId);

  window.updateUserInDB(userKey, { status: 'approved', userId: newUserId })
    .then(() => {
      console.log('✅ User approved:', userKey);
      toast('কর্মী অনুমোদিত হয়েছে! আইডি: ' + newUserId, 'ok');
      if (window.renderAdminPanel) window.renderAdminPanel();
      if (window.renderEmployeeList) window.renderEmployeeList();
      bumpAdminNotif('admin-approve', `অনুমোদন: ${user.name || email}`);

    })
    .catch(err => {
      console.error('Approve failed:', err);
      toast('অনুমোদন ব্যর্থ হয়েছে: ' + (err.message || 'Unknown error'), 'err');
    });
}


function rejectUser(email) {
  if (!confirm('এই আবেদন প্রত্যাখ্যান করবেন?')) return;

  console.log('Rejecting user:', email);
  const usersObj = window.getUsersObject ? window.getUsersObject() : {};
  let userKey = null;
  let user = null;

  // Find user by email and get the key
  for (const [key, userData] of Object.entries(usersObj)) {
    if (userData.email === email) {
      userKey = key;
      user = userData;
      break;
    }
  }

  if (!user || !userKey) {
    console.warn('User not found:', email);
    toast('ব্যবহারকারী পাওয়া যায়নি', 'err');
    return;
  }

  console.log('Updating user with key:', userKey);

  window.updateUserInDB(userKey, { status: 'rejected' })
    .then(() => {
      console.log('✅ User rejected:', userKey);
      toast('আবেদন প্রত্যাখ্যাত', 'err');
      if (window.renderAdminPanel) window.renderAdminPanel();
      bumpAdminNotif('admin-reject', `প্রত্যাখ্যান: ${user.name || email}`);
    })
    .catch(err => {
      console.error('Reject failed:', err);
      toast('প্রত্যাখ্যান ব্যর্থ হয়েছে: ' + (err.message || 'Unknown error'), 'err');
    });
}


function revokeUser(email) {
  if (!confirm('এই কর্মীর অনুমোদন বাতিল করবেন?')) return;

  console.log('Revoking user:', email);
  const usersObj = window.getUsersObject ? window.getUsersObject() : {};
  let userKey = null;
  let user = null;

  // Find user by email and get the key
  for (const [key, userData] of Object.entries(usersObj)) {
    if (userData.email === email) {
      userKey = key;
      user = userData;
      break;
    }
  }

  if (!user || !userKey) {
    console.warn('User not found:', email);
    toast('ব্যবহারকারী পাওয়া যায়নি', 'err');
    return;
  }

  console.log('Updating user with key:', userKey);

  window.updateUserInDB(userKey, { status: 'pending', userId: null })
    .then(() => {
      console.log('✅ User revoked:', userKey);
      toast('অনুমোদন বাতিল হয়েছে', 'warn');
      if (window.renderAdminPanel) window.renderAdminPanel();
      if (window.renderEmployeeList) window.renderEmployeeList();
      bumpAdminNotif('admin-revoke', `পুনরায় পেন্ডিং: ${user.name || email}`);
    })
    .catch(err => {
      console.error('Revoke failed:', err);
      toast('বাতিল ব্যর্থ হয়েছে: ' + (err.message || 'Unknown error'), 'err');
    });
}


function bumpAdminNotif(type, message) {
  // Keep it simple: local-only notification + auto refresh trigger
  try {
    const key = 'bbs_admin_notif_v1';
    const payload = {
      type,
      message,
      ts: Date.now()
    };
    const list = StorageGet(key) || [];
    list.push(payload);
    // Keep latest 10
    while (list.length > 10) list.shift();
    StorageSet(key, list);

    // Auto refresh admin panel UI if currently open
    if (window.renderAdminPanel) window.renderAdminPanel();

    // Optional toast (uses existing toast helper)
    if (typeof toast === 'function') {
      const tone = type.includes('approve') ? 'ok' : (type.includes('reject') ? 'err' : 'warn');
      toast(message, tone);
    }
  } catch (e) {
    console.warn('Admin notif bump failed:', e.message);
  }
}

function StorageGet(k) {
  try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
}
function StorageSet(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

// Expose globally
window.renderAdminPanel = renderAdminPanel;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.revokeUser = revokeUser;
window.loadUpdateManager = loadUpdateManager;
window.saveAppUpdate = saveAppUpdate;
