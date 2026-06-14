/* ═══════════ TOAST ═══════════ */
function toast(msg, type='') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'on '+(type==='ok'?'t-ok':type==='err'?'t-err':type==='warn'?'t-warn':'');
  clearTimeout(t._t);
  t._t = setTimeout(()=>{ t.className=''; }, 2800);
}

// Expose globally
window.toast = toast;

/* ═══════════ SPLASH SCREEN ═══════════ */
// NOTE: Splash navigation is now handled in data.js initializeDatabase()
// No duplicate navigation logic here