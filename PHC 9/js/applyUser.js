/* ═══════════ APPLY USER ═══════════ */
let CURRENT_USER = null;
function applyUser(u) {
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
  if (typeof renderCropStats === 'function') renderCropStats();
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
