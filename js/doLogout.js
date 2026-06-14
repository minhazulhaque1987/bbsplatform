/* ═══════════ LOGOUT ═══════════ */
function doLogout() {
  if(!confirm('লগআউট করতে চান?')) return;
  clearSes();
  clearCurrentUser();
  ['l-user','l-pass'].forEach(id=>document.getElementById(id).value='');
  clearErrs(); 
  authTab('login'); 
  goView('v-auth');
  const gnav = document.getElementById('global-bnav');
  if (gnav) gnav.style.display = 'none';
  toast('আপনি লগআউট করেছেন', 'success');
}
