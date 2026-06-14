// App Gallery renderer
// This file intentionally has no dependencies so it can be loaded after extra_views.js as well.

function renderAppGallery(){
  const grid = document.getElementById('app-gallery-grid');
  const empty = document.getElementById('app-gallery-empty');
  if(!grid) return;

  const APP_GALLERY_ITEMS = [
    {
      id: 'gold-calculator',
      title: 'Gold Calculator',
      sub: 'স্বর্ণের দাম হিসাব করুন',
      icon: '🪙',
      gradient: 'linear-gradient(135deg,#F4B942,#D89324)',
      onOpen: () => goView('v-gold-calculator')
    }
  ];

  grid.innerHTML = '';

  if(!APP_GALLERY_ITEMS.length){
    if(empty) empty.style.display = 'block';
    return;
  }

  if(empty) empty.style.display = 'none';

  grid.innerHTML = APP_GALLERY_ITEMS.map(app => {
    const icon = app.icon ? app.icon : '📱';
    const sub = app.sub ? app.sub : '';
    const gradient = app.gradient ? app.gradient : 'linear-gradient(135deg,#667eea,#764ba2)';
    const onClick = (typeof app.onOpen === 'function')
      ? 'return window.__bbsgallery_openApp(\'' + String(app.id || '') + '\')'
      : '';

    return `
      <div class="app-card" onclick="${onClick}">
        <div class="app-card-ico" style="background:${gradient}">${icon}</div>
        <div class="app-card-lbl">${app.title}</div>
        ${sub ? `<div class="app-card-sub">${sub}</div>` : ''}
      </div>
    `;
  }).join('');
}

// Dispatcher used by gallery cards.
window.__bbsgallery_openApp = function(appId){
  if(appId === 'gold-calculator'){
    if(typeof goView === 'function') goView('v-gold-calculator');
    return false;
  }
  return false;
};
