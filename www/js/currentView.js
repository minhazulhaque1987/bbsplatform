/* ═══════════ VIEW SYSTEM ═══════════ */
let currentView = 'v-splash';

function goView(id, back=false) {
  const cur = document.getElementById(currentView);
  const nxt = document.getElementById(id);
  if(!nxt || currentView===id) return;
  
  if(back && cur) cur.classList.add('slide-left');
  if(cur) cur.classList.remove('active');
  
  nxt.classList.add('active');
  nxt.classList.remove('slide-left');
  
  currentView = id;
  console.log('View changed to:', id);
}

// Expose globally
window.goView = goView;