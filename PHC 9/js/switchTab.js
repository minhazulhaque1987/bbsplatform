/* ═══════════ TAB SWITCH ═══════════ */
function switchTab(tab) {
  ['home','surveys','manpower','crop','profile'].forEach(t=>{
    const btn = document.getElementById('bn-'+t);
    if(btn) btn.classList.toggle('on', t===tab);
  });
}