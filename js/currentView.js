/* View system */
let currentView = 'v-splash';
const viewHistory = ['v-splash'];

function goView(id, back = false, pushHistory = true) {
  const cur = document.getElementById(currentView);
  const nxt = document.getElementById(id);
  if (!nxt || currentView === id) return;

  if (back && cur) cur.classList.add('slide-left');
  if (cur) cur.classList.remove('active');

  nxt.classList.add('active');
  nxt.classList.remove('slide-left');

  currentView = id;
  if (pushHistory) viewHistory.push(id);
}

function goBack() {
  if (viewHistory.length <= 1) return false;
  viewHistory.pop();
  const prev = viewHistory[viewHistory.length - 1];
  goView(prev, true, false);
  return true;
}

function canGoBack() {
  return viewHistory.length > 1;
}

function getCurrentView() {
  return currentView;
}

window.goView = goView;
window.goBack = goBack;
window.canGoBack = canGoBack;
window.getCurrentView = getCurrentView;
