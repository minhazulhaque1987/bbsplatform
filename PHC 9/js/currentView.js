/* ═══════════ VIEW SYSTEM ═══════════ */
let currentView = 'v-splash';
function goView(id, back=false) {
  const cur = document.getElementById(currentView);
  const nxt = document.getElementById(id);
  if(!nxt || currentView===id) return;
  if(back) cur.classList.add('slide-left');
  cur.classList.remove('active');
  nxt.classList.add('active');
  nxt.classList.remove('slide-left');
  currentView = id;
}