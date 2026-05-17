/* ═══════════ VIEW HOOKS ═══════════ */
const origGoView = goView;
window.goView = function(id, back=false) {
  origGoView(id, back);
  if(id==='v-profile') { openProfileEdit(); }
  if(id==='v-profile-edit') { openProfileEdit(); }
  if(id==='v-admin')   { renderAdminPanel(); }
  if(id==='v-manpower'){ renderEmployeeList(); }
  if(id==='v-crop')    { if(typeof renderCropView==='function') renderCropView(); }
  if(id==='v-phc')     { if(typeof renderPHCHome==='function') renderPHCHome(); }
};