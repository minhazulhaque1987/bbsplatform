/* ═══════════ APPLY USER ═══════════ */
let CURRENT_USER = null;
function applyUser(u) {
  // ── Field-name normalisation ──────────────────────────────────────────
  // Older signup code saved the designation as "designation"; newer code
  // saves it as "post". Support both so no data is lost.
  u.post        = u.post        || u.designation  || u.position   || '';
  u.office      = u.office      || u.workplace     || u.officeTitle || '';
  // officeType drives the crop-calendar mode; accept snake_case variant too
  u.officeType  = u.officeType  || u.office_type   || '';
  
  // Fallback: Try to extract officeType from office name if not already set
  // This helps existing users who don't have officeType stored yet
  if (!u.officeType && u.office && typeof bbsOffices !== 'undefined' && bbsOffices) {
    const matchedOffice = bbsOffices.find(o => o.bn === u.office || o.en === u.office);
    if (matchedOffice && matchedOffice.type) {
      u.officeType = matchedOffice.type;
    }
  }
  // ─────────────────────────────────────────────────────────────────────

  CURRENT_USER = u;

  // Bottom nav visibility controlled here.
  const gnav = document.getElementById('global-bnav');
  if (gnav) gnav.style.display = 'flex';

  // Bottom nav buttons are fixed; however for admin users we can hide
  // the employee-specific buttons if needed.
  const isAdmin = u && u.role === 'admin';
  const cropBtn = document.getElementById('bn-crop');
  const profileBtn = document.getElementById('bn-profile');
  if (cropBtn) cropBtn.style.display = isAdmin ? 'none' : '';
  if (profileBtn) profileBtn.style.display = isAdmin ? 'none' : '';

  // Active-state handling: show correct tab highlight based on current view.
  // Crop shows the crop tab, profile shows profile, admin hides both.
  const active = (window.getCurrentView && window.getCurrentView()) || '';
  try {
    const setOn = (id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.classList.toggle('on', true);
    };
    ['bn-home','bn-surveys','bn-manpower','bn-crop','bn-profile'].forEach(id=>{
      const btn=document.getElementById(id);
      if(btn) btn.classList.remove('on');
    });

    if (active === 'v-dash') document.getElementById('bn-home')?.classList.add('on');
    else if (active === 'v-statistics') document.getElementById('bn-surveys')?.classList.add('on');
    else if (active === 'v-manpower' || active === 'v-emp-detail') document.getElementById('bn-manpower')?.classList.add('on');
    else if (active === 'v-crop') document.getElementById('bn-crop')?.classList.add('on');
    else if (active === 'v-profile' || active === 'v-profile-edit') document.getElementById('bn-profile')?.classList.add('on');
  } catch (e) {}

  const h = new Date().getHours();


  const gr = h<12?'শুভ সকাল,':h<17?'শুভ দুপুর,':'শুভ সন্ধ্যা,';
  document.getElementById('d-greeting').textContent = gr;
  document.getElementById('d-name').textContent = u.name;
  document.getElementById('d-uid-display').textContent = u.userId || '';
  document.getElementById('d-post-office').textContent = (u.post||'') + (u.office?' · '+u.office:'');

  // show admin btn
  const adminBtn = document.getElementById('admin-btn');
  adminBtn.style.display = u.role==='admin' ? 'flex' : 'none';

  // profile
  document.getElementById('p-name').textContent    = u.name;
  document.getElementById('p-post').textContent    = u.post || '—';
  document.getElementById('p-office').textContent  = u.office || '—';
  document.getElementById('p-email').textContent   = u.email || '—';
  document.getElementById('ps-uid').textContent    = u.userId || '—';
  document.getElementById('ps-surveys').textContent = '৩';

  // avatar
  setAvatarAll(u);

  // render dash surveys
  if (typeof renderDashStatistics === 'function') renderDashStatistics();
  if (typeof renderAllStatistics === 'function') renderAllStatistics();
  renderEmployeeList();

  // ── Crop calendar ─────────────────────────────────────────────────────
  // Always refresh stats (bottom-nav badge) with the correct user mode.
  if (typeof renderCropStats === 'function') renderCropStats();
  // If the crop view is already visible (e.g. deep-link / back-navigation),
  // repopulate the user identity card immediately.
  const cropView = document.getElementById('v-crop');
  if (cropView && cropView.classList.contains('active')) {
    if (typeof renderCropView === 'function') renderCropView();
  }
  // ─────────────────────────────────────────────────────────────────────

  if (typeof scheduleBrowserCropNotif === 'function') scheduleBrowserCropNotif();
}

function setAvatarAll(u) {
  const initials = (u.name||'?').charAt(0).toUpperCase();
  const colors   = ['#0A2342','#006A4E','#1A4A8A','#7B2D8B','#C8102E'];
  const bg       = colors[(u.name||'').charCodeAt(0)%colors.length];
  ['p-av','edit-av'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    if(u.photo){
      el.style.backgroundImage = `url(${u.photo})`;
      el.style.backgroundColor = 'transparent';
      el.textContent = '';
    } else {
      el.style.backgroundImage = '';
      el.style.backgroundColor = bg;
      el.textContent = initials;
    }
  });
}

// Expose globally
window.applyUser = applyUser;