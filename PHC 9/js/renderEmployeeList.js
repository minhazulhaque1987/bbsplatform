/* ═══════════ EMPLOYEE LIST ═══════════ */
let empFilter = 'all';
let empSearch = '';

function renderEmployeeList() {
  const users = getUsers().filter(u=>u.role!=='admin' && u.status==='approved');
  let filtered = users;
  if(empSearch.trim()){
    const q = empSearch.toLowerCase();
    filtered = users.filter(u=>
      (u.name||'').toLowerCase().includes(q) ||
      (u.post||'').toLowerCase().includes(q) ||
      (u.office||'').toLowerCase().includes(q) ||
      (u.userId||'').toLowerCase().includes(q)
    );
  }
  if(empFilter==='dhaka') filtered = filtered.filter(u=>(u.office||'').toLowerCase().includes('ঢাকা')||'');
  if(empFilter==='ctg')   filtered = filtered.filter(u=>(u.office||'').toLowerCase().includes('চট্টগ্রাম')||'');

  const c = document.getElementById('emp-list');
  if(filtered.length===0){
    c.innerHTML = `<div class="empty-state"><div class="empty-ico">🔍</div><div class="empty-title">কোনো কর্মী পাওয়া যায়নি</div><div class="empty-sub">অন্য কীওয়ার্ড দিয়ে খুঁজুন</div></div>`;
    return;
  }
  const colors = ['#0A2342','#006A4E','#1A4A8A','#7B2D8B','#C8102E'];
  c.innerHTML = filtered.map(u=>{
    const bg = colors[(u.name||'?').charCodeAt(0)%colors.length];
    const av = u.photo
      ? `style="background-image:url(${u.photo});background-size:cover;background-position:center;background-color:transparent"`
      : `style="background:${bg}"`;
    const initials = (u.name||'?').charAt(0).toUpperCase();
    return `<div class="emp-card" onclick="showEmpDetail('${u.email}')">
      <div class="emp-av" ${av}>${u.photo?'':initials}</div>
      <div class="emp-info">
        <div class="emp-name">${u.name}</div>
        <div class="emp-post">${u.post||'—'}</div>
        <div class="emp-office">🏢 ${u.office||'—'}</div>
      </div>
      <span class="emp-tag tag-active">✓ সক্রিয়</span>
    </div>`;
  }).join('') + '<div style="height:16px"></div>';
}

function searchEmployees(val) {
  empSearch = val;
  document.getElementById('search-clear').style.display = val ? 'block' : 'none';
  renderEmployeeList();
}

function clearSearch() {
  document.getElementById('emp-search').value = '';
  empSearch = '';
  document.getElementById('search-clear').style.display = 'none';
  renderEmployeeList();
}

function filterEmp(type, btn) {
  empFilter = type;
  document.querySelectorAll('.filter-tabs .ftab').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  renderEmployeeList();
}
