/* ═══════════ LOGOUT ═══════════ */
function doLogout() {
  if(!confirm('লগআউট করতে চান?')) return;
  clearSes();
  ['l-user','l-pass'].forEach(id=>document.getElementById(id).value='');
  clearErrs(); authTab('login'); goView('v-auth');
}