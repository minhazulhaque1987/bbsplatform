/* ═══════════ TOAST ═══════════ */
function toast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'on '+(type==='ok'?'t-ok':type==='err'?'t-err':type==='warn'?'t-warn':'');
  clearTimeout(t._t);
  t._t = setTimeout(()=>{ t.className=''; }, 2800);
}

/* ═══════════ SPLASH ═══════════ */
setTimeout(()=>{
  const ses = getSes();
  if(ses){
    const users = getUsers();
    const fresh = users.find(u=>u.userId===ses.userId);
    if(fresh && fresh.status==='approved'){
      applyUser(fresh);
      goView('v-dash');
    } else {
      clearSes();
      goView('v-auth');
    }
  } else goView('v-auth');
}, 2200);
