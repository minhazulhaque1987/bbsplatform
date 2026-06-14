/* ═══════════ EMPLOYEE LIST ═══════════ */
let empFilter = 'all';
let empSearch = '';

function renderEmployeeList() {
  if(typeof initDivisionTabs==='function') initDivisionTabs();
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

  // Division filter by office text (office may use district/upazila/wording variants)
  const divMap = {
    // Dhaka
    dhaka: ['ঢাকা','ডাকা','মহানগর ঢাকা','ঢাকা বিভাগ','ঢাকা জেলা','কৃষি উইং, বিবিএস, ঢাকা','বিবিএস, ঢাকা','কৃষি উইং'],

    // Chattogram
    ctg: ['চট্টগ্রাম','চাটগাঁ','চটগ্রাম','চট্রগ্রাম','কক্সবাজার','কক্সবাজার সদর','কক্সবাজার জেলা','উপজেলা পরিসংখ্যান অফিস'],

    // Rangpur
    rangpur: ['রংপুর','রংপুর বিভাগ'],

    // Rajshahi
    rajshahi: ['রাজশাহী','রাজশাহী বিভাগ'],

    // Khulna
    khulna: ['খুলনা','খুলনা বিভাগ'],

    // Barishal
    barishal: ['বরিশাল','বরিশাল বিভাগ'],

    // Sylhet
    sylhet: ['সিলেট','সিলেট বিভাগ'],

    // Mymensingh
    mymensingh: ['ময়মনসিংহ','ময়মনসিংহ','ময়মনসিংহ জেলা','ময়মনসিংহ বিভাগ']
  };

  if(divMap[empFilter]){
    const matches = divMap[empFilter];
    filtered = filtered.filter(u => {
      const o = (u.office||'');
      return matches.some(m => m && o.includes(m));
    });
  }

  // Show newest joined users first.
  filtered.sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    if (tb !== ta) return tb - ta;
    return (a.name || '').localeCompare(b.name || '', 'bn');
  });

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
  if(btn && btn.classList) btn.classList.add('on');
  renderEmployeeList();
}

function initDivisionTabs(){
  // v-manpower page uses .filter-tabs container (id="emp-division-tabs" নেই)
  const tabsWrap = document.querySelector('.filter-tabs');
  if(!tabsWrap) return;

  // Force a full reset each time (prevents stale/partial tab UI).
  tabsWrap.innerHTML = "";

  const divisions = [
    { key:'dhaka', label:'ঢাকা' },
    { key:'ctg', label:'চট্টগ্রাম' },
    { key:'rangpur', label:'রংপুর' },
    { key:'rajshahi', label:'রাজশাহী' },
    { key:'khulna', label:'খুলনা' },
    { key:'barishal', label:'বরিশাল' },
    { key:'sylhet', label:'সিলেট' },
    { key:'mymensingh', label:'ময়মনসিংহ' }
  ].slice().sort((a,b)=>a.label.localeCompare(b.label,'bn'));

  const allBtn = document.createElement('button');
  allBtn.className = 'ftab on';
  allBtn.textContent = 'সকলে';
  allBtn.onclick = function(){ filterEmp('all', this); };
  tabsWrap.appendChild(allBtn);

  for(const d of divisions){
    const btn = document.createElement('button');
    btn.className = 'ftab';
    btn.textContent = d.label;
    btn.onclick = function(){ filterEmp(d.key, this); };
    tabsWrap.appendChild(btn);
  }
}

// Expose globally
window.renderEmployeeList = renderEmployeeList;
window.initDivisionTabs = initDivisionTabs;
window.filterEmp = filterEmp;
