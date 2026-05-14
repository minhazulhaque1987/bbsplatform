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
  renderDashSurveys();
  renderAllSurveys();
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