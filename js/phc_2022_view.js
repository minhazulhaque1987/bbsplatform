const BN_D = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
const BN_DIVISION = {"à¦šà¦Ÿà§à¦Ÿà¦—à§à¦°à¦¾à¦®":"চট্টগ্রাম","চট্টগ্রাম":"চট্টগ্রাম"};
const BN_DISTRICT = {coxsbazar:'কক্সবাজার', chittagong:'চট্টগ্রাম'};
const BN_UPAZILA = {
  "Chakaria":"চকরিয়া", "Cox's Bazar Sadar":"কক্সবাজার সদর", "Eidgaon":"ঈদগাঁও", "Kutubdia":"কুতুবদিয়া", "Maheshkhali":"মহেশখালী", "Pekua":"পেকুয়া", "Ramu":"রামু", "Teknaf":"টেকনাফ", "Ukhia":"উখিয়া"
};

function bnN(n, dec=0){ if(n == null || n === '') return '—'; const s = dec>0 ? parseFloat(n).toFixed(dec) : String(Math.round(n)); return s.split('').map(c => /\d/.test(c) ? BN_D[+c] : c).join(''); }
function bnPct(n){ return n==null ? '—' : bnN(n,2)+'%'; }
function bnInt(n){ return n==null ? '—' : Number(n).toLocaleString('bn-BD'); }
function safeDivName(v){ return BN_DIVISION[v] || v || 'চট্টগ্রাম'; }
function safeDistName(d){ return BN_DISTRICT[d?.id] || d?.name_bn || d?.name_en || 'জেলা'; }
function safeUpaName(u){ return BN_UPAZILA[u?.name_en] || u?.name_bn || u?.name_en || 'উপজেলা'; }
function safeUnionName(x){ return x?.name_bn && !x.name_bn.includes('à') ? x.name_bn : (x?.name_en || 'ইউনিয়ন'); }

let phcActiveDistrict = null, phcActiveData = null, phcActiveUpazilas = null, phcActiveUnions = null;
let phcSelectedDivision = null, phcSelectedUpazila = null;
let phcSelectedPaurashava = null;

function renderPHCHome(){ phcSelectedDivision = null; phcActiveDistrict = null; phcSelectedUpazila = null; renderPHCDivisionSelector(); }

function renderPHCDivisionSelector(){
  const content = document.getElementById('phc-content'); if(!content) return;
  const byDiv = {};
  PHC_DISTRICT_REGISTRY.filter(d => d.available).forEach(d => {
    const div = safeDivName(d.division_bn);
    byDiv[div] = byDiv[div] || {name_bn: div, districts: [], pop: 0};
    byDiv[div].districts.push(d); byDiv[div].pop += (d.pop_total_2022 || 0);
  });
  const cards = Object.values(byDiv).map(v => `
    <div class="phc-upz-card phc-premium-card" onclick="openPHCDivision('${v.name_bn}')" style="cursor:pointer;">
      <div class="phc-upz-card-top" style="background:linear-gradient(135deg,#00695C,#00897B)"><div class="phc-upz-card-name">🗺️ ${v.name_bn} বিভাগ</div></div>
      <div class="phc-upz-kpis">
        <div class="phc-kpi"><span class="phc-kpi-val">${bnN(v.districts.length)}</span><span class="phc-kpi-lbl">জেলা</span></div>
        <div class="phc-kpi"><span class="phc-kpi-val">${bnInt(v.pop)}</span><span class="phc-kpi-lbl">জনসংখ্যা</span></div>
      </div>
    </div>`).join('');
  content.innerHTML = `<div class="phc-upz-intro"><strong>✨ বিভাগ নির্বাচন করুন</strong></div><div class="phc-upz-grid">${cards}</div>`;
}

function openPHCDivision(divisionBn){
  phcSelectedDivision = divisionBn;
  const content = document.getElementById('phc-content'); if(!content) return;
  const districts = PHC_DISTRICT_REGISTRY.filter(d => d.available && safeDivName(d.division_bn) === divisionBn);
  const cards = districts.map(d => `
    <div class="phc-upz-card phc-premium-card" onclick="loadPHCDistrict('${d.id}')" style="border-left:4px solid ${d.color}; cursor:pointer;">
      <div class="phc-upz-card-top" style="background:linear-gradient(135deg,${d.color},${d.color}cc)"><div class="phc-upz-card-name">🏙️ ${safeDistName(d)}</div><div class="phc-upz-card-sub">${d.name_en}</div></div>
      <div class="phc-upz-kpis">
        <div class="phc-kpi"><span class="phc-kpi-val">${bnInt(d.pop_total_2022)}</span><span class="phc-kpi-lbl">জনসংখ্যা</span></div>
        <div class="phc-kpi"><span class="phc-kpi-val">${bnN(d.upazila_count)}</span><span class="phc-kpi-lbl">উপজেলা</span></div>
      </div>
    </div>`).join('');
  content.innerHTML = `<div class="phc-upz-intro"><button class="phc-tab" onclick="renderPHCHome()">↩ বিভাগ</button><strong style="margin-left:10px;">${divisionBn} বিভাগের জেলা</strong></div><div class="phc-upz-grid">${cards}</div>`;
}

function loadPHCDistrict(districtId){
  const reg = PHC_DISTRICT_REGISTRY.find(d => d.id === districtId); if(!reg || !reg.available) return;
  // সর্বদা স্ক্রিপ্ট লোড করি, কারণ কমিউনিটি সিরিজ জেলাগুলোর ভেতরের ভ্যারিয়েবলগুলো (upazilas/paurashavas) ফাইলের ভিতরেই থাকে।
  const script = document.createElement('script');
  script.src = reg.script_path;
  script.onload = () => activateDistrictView(reg);
  script.onerror = () => { if(typeof toast==='function') toast('ডেটা ফাইল লোড ব্যর্থ: '+reg.script_path, 'warn'); };
  document.head.appendChild(script);
}


function activateDistrictView(reg){
  phcActiveDistrict = reg; phcActiveData = window[reg.data_obj]; phcActiveUpazilas = window[reg.upazilas_obj] || []; phcActiveUnions = window[reg.unions_obj] || {}; phcSelectedUpazila = null;
  const hMain = document.getElementById('phc-header-main-txt'); if(hMain) hMain.textContent = safeDistName(reg)+' জেলা';
  renderDistrictHierarchy();
}

function renderDistrictHierarchy(){
  if(!phcActiveData) return; const d = phcActiveData;
  const content = document.getElementById('phc-content'); if(!content) return;
  const upzCards = (phcActiveUpazilas||[]).map(u => `
    <div class="phc-upz-card phc-premium-card" onclick="openPHCUpazila(${u.id})" style="cursor:pointer;">
      <div class="phc-upz-card-top" style="background:linear-gradient(135deg,${phcActiveDistrict.color},${phcActiveDistrict.color}cc)"><div class="phc-upz-card-name">📍 ${safeUpaName(u)}</div><div class="phc-upz-card-sub">${u.name_en||''}</div></div>
      <div class="phc-upz-kpis"><div class="phc-kpi"><span class="phc-kpi-val">${bnN(u.unions)}</span><span class="phc-kpi-lbl">ইউনিয়ন</span></div><div class="phc-kpi"><span class="phc-kpi-val">${bnInt(u.pop_total_2022)}</span><span class="phc-kpi-lbl">জনসংখ্যা</span></div></div>
    </div>`).join('');
  content.innerHTML = `
    <div class="phc-upz-intro"><button class="phc-tab" onclick="openPHCDivision('${phcSelectedDivision||safeDivName(phcActiveDistrict.division_bn)}')">↩ জেলা</button><strong style="margin-left:10px;">🌟 ${safeDistName(phcActiveDistrict)} জেলার এক নজরে</strong></div>
    <div class="phc-detail-admin"><div class="phc-admin-chip">🏛️ উপজেলা: ${bnN(d.upazila_count)}</div><div class="phc-admin-chip">🧩 ইউনিয়ন: ${bnN(d.union_count)}</div><div class="phc-admin-chip">🏡 গ্রাম: ${bnN(d.village_count)}</div><div class="phc-admin-chip">📐 আয়তন: ${bnN(d.area_sq_km,2)} বর্গ কি.মি.</div><div class="phc-admin-chip">👥 জনসংখ্যা: ${bnInt(d.pop_total_2022)}</div><div class="phc-admin-chip">📘 সাক্ষরতা: ${bnPct(d.literacy_total_2022)}</div></div>
    <div class="phc-upz-intro"><strong>উপজেলা সমূহ</strong></div><div class="phc-upz-grid">${upzCards}</div>`;
}

function openPHCUpazila(id){ if(!phcActiveUpazilas) return; phcSelectedUpazila = phcActiveUpazilas.find(u=>u.id===id); if(phcSelectedUpazila) renderUpazilaHierarchy(); }

function renderUpazilaHierarchy(){
  const u = phcSelectedUpazila; if(!u) return; const content = document.getElementById('phc-content'); if(!content) return;
  const unions = (phcActiveUnions && phcActiveUnions[String(u.id)]) ? phcActiveUnions[String(u.id)] : [];
  const paurashavaSet = (window.PHC_PAURASHAVAS_COXSBAZAR && window.PHC_PAURASHAVAS_COXSBAZAR[String(u.id)]) ? window.PHC_PAURASHAVAS_COXSBAZAR[String(u.id)] : {};
  const paurashavas = Object.values(paurashavaSet);
  const unionCards = unions.map((x,idx)=>`<div class="phc-upz-card phc-premium-card" onclick="openPHCUnion(${idx})" style="cursor:pointer;"><div class="phc-upz-card-top" style="background:linear-gradient(135deg,#6A1B9A,#8E24AA)"><div class="phc-upz-card-name">🏘️ ${safeUnionName(x)}</div></div><div class="phc-upz-kpis"><div class="phc-kpi"><span class="phc-kpi-val">${bnN(x.villages)}</span><span class="phc-kpi-lbl">গ্রাম</span></div><div class="phc-kpi"><span class="phc-kpi-val">${bnN(x.mouzas)}</span><span class="phc-kpi-lbl">মৌজা</span></div><div class="phc-kpi"><span class="phc-kpi-val">${bnInt(x.pop_total_2022)}</span><span class="phc-kpi-lbl">জনসংখ্যা</span></div><div class="phc-kpi"><span class="phc-kpi-val">${bnN(x.area_sq_km,2)}</span><span class="phc-kpi-lbl">বর্গ কি.মি.</span></div></div></div>`).join('');
  const paurashavaCards = paurashavas.map((p,idx)=>`<div class="phc-upz-card phc-premium-card" onclick="openPHCPaurashava(${idx})" style="cursor:pointer;"><div class="phc-upz-card-top" style="background:linear-gradient(135deg,#EF6C00,#F9A825)"><div class="phc-upz-card-name">🏛️ ${p.name_en} পৌরসভা</div></div><div class="phc-upz-kpis"><div class="phc-kpi"><span class="phc-kpi-val">${bnN((p.wards||[]).length)}</span><span class="phc-kpi-lbl">ওয়ার্ড</span></div><div class="phc-kpi"><span class="phc-kpi-val">${bnInt(p.pop_total_2022)}</span><span class="phc-kpi-lbl">জনসংখ্যা</span></div><div class="phc-kpi"><span class="phc-kpi-val">${bnN(p.area_sq_km,2)}</span><span class="phc-kpi-lbl">বর্গ কি.মি.</span></div></div></div>`).join('');
  content.innerHTML = `
    <div class="phc-upz-intro"><button class="phc-tab" onclick="renderDistrictHierarchy()">↩ উপজেলা</button><strong style="margin-left:10px;">🌟 ${safeUpaName(u)} উপজেলার এক নজরে</strong></div>
    <div class="phc-detail-admin"><div class="phc-admin-chip">🧩 ইউনিয়ন: ${bnN(u.unions)}</div><div class="phc-admin-chip">🏛️ পৌরসভা: ${bnN(paurashavas.length)}</div><div class="phc-admin-chip">🏡 গ্রাম: ${bnN(u.villages)}</div><div class="phc-admin-chip">🗂️ মৌজা: ${bnN(u.mouzas)}</div><div class="phc-admin-chip">📐 আয়তন: ${bnN(u.area_sq_km,2)} বর্গ কি.মি.</div><div class="phc-admin-chip">👥 জনসংখ্যা: ${bnInt(u.pop_total_2022)}</div><div class="phc-admin-chip">📘 সাক্ষরতা: ${bnPct(u.literacy_total_2022)}</div></div>
    ${paurashavas.length ? `<div class="phc-upz-intro"><strong>পৌরসভা সমূহ</strong></div><div class="phc-upz-grid">${paurashavaCards}</div>` : ``}
    <div class="phc-upz-intro"><strong>ইউনিয়ন সমূহ</strong></div><div class="phc-upz-grid">${unionCards || '<div class="phc-upz-intro">ইউনিয়ন ডেটা প্রস্তুত হচ্ছে</div>'}</div>`;
}

function openPHCPaurashava(index){
  const u = phcSelectedUpazila; if(!u) return;
  const paurashavaSet = (window.PHC_PAURASHAVAS_COXSBAZAR && window.PHC_PAURASHAVAS_COXSBAZAR[String(u.id)]) ? window.PHC_PAURASHAVAS_COXSBAZAR[String(u.id)] : {};
  const list = Object.values(paurashavaSet);
  phcSelectedPaurashava = list[index];
  if(!phcSelectedPaurashava) return;
  const p = phcSelectedPaurashava;
  const wards = Array.isArray(p.wards) ? p.wards : [];
  const showWardArea = wards.some(w => w.area_sq_km != null);
  const wardTable = wards.length ? `
    <div class="phc-detail-section" style="margin-top:10px;">
      <div class="phc-sec-title" style="background:#EF6C00">📋 ওয়ার্ডভিত্তিক তথ্য</div>
      <div class="phc-table-wrap">
        <table class="phc-table" style="min-width:640px;">
          <thead><tr><th class="phc-ind-hdr">ওয়ার্ডের নাম</th>${showWardArea?`<th class="phc-upz-hdr">আয়তন (বর্গ কি.মি.)</th>`:''}<th class="phc-upz-hdr">জনসংখ্যা</th></tr></thead>
          <tbody>${wards.map(w=>`<tr><td class="phc-ind-name"><div class="phc-ind-bn">${w.name||'—'}</div></td>${showWardArea?`<td class="phc-td">${bnN(w.area_sq_km,3)}</td>`:''}<td class="phc-td">${bnInt(w.pop_total_2022)}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>` : `<div class="phc-upz-intro" style="margin-top:10px;">ওয়ার্ডভিত্তিক তথ্য পাওয়া যায়নি</div>`;
  const content = document.getElementById('phc-content'); if(!content) return;
  content.innerHTML = `
    <div class="phc-upz-intro"><button class="phc-tab" onclick="renderUpazilaHierarchy()">↩ পৌরসভা</button><strong style="margin-left:10px;">🌟 ${p.name_en} পৌরসভার এক নজরে</strong></div>
    <div class="phc-detail-admin"><div class="phc-admin-chip">🏘️ ওয়ার্ড: ${bnN(wards.length)}</div><div class="phc-admin-chip">📐 আয়তন: ${bnN(p.area_sq_km,2)} বর্গ কি.মি.</div><div class="phc-admin-chip">👥 জনসংখ্যা: ${bnInt(p.pop_total_2022)}</div></div>
    ${wardTable}`;
}

function openPHCUnion(index){
  const u = phcSelectedUpazila; if(!u) return;
  const unions = (phcActiveUnions && phcActiveUnions[String(u.id)]) ? phcActiveUnions[String(u.id)] : [];
  const x = unions[index]; if(!x) return;
  const content = document.getElementById('phc-content'); if(!content) return;
  const villageRows = Array.isArray(x.village_rows) ? x.village_rows : [];
  const showVillageArea = villageRows.some(v => v.area_sq_km != null);
  const villageTable = villageRows.length ? `
    <div class="phc-detail-section" style="margin-top:10px;">
      <div class="phc-sec-title" style="background:#6A1B9A">📋 গ্রামভিত্তিক তথ্য</div>
      <div class="phc-table-wrap">
        <table class="phc-table" style="min-width:640px;">
          <thead><tr><th class="phc-ind-hdr">গ্রামের নাম</th>${showVillageArea?`<th class="phc-upz-hdr">আয়তন (বর্গ কি.মি.)</th>`:''}<th class="phc-upz-hdr">জনসংখ্যা</th></tr></thead>
          <tbody>
            ${villageRows.map(v=>`<tr><td class="phc-ind-name"><div class="phc-ind-bn">${v.name||'—'}</div></td>${showVillageArea?`<td class="phc-td">${bnN(v.area_sq_km,3)}</td>`:''}<td class="phc-td">${bnInt(v.pop_total_2022)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : `<div class="phc-upz-intro" style="margin-top:10px;">গ্রামভিত্তিক তথ্য এখনো যুক্ত করা হয়নি</div>`;
  content.innerHTML = `
    <div class="phc-upz-intro"><button class="phc-tab" onclick="renderUpazilaHierarchy()">↩ ইউনিয়ন</button><strong style="margin-left:10px;">🌟 ${safeUnionName(x)} ইউনিয়নের এক নজরে</strong></div>
    <div class="phc-detail-admin"><div class="phc-admin-chip">🏡 গ্রাম: ${bnN(x.villages)}</div><div class="phc-admin-chip">🗂️ মৌজা: ${bnN(x.mouzas)}</div>${x.area_sq_km!=null?`<div class="phc-admin-chip">📐 আয়তন: ${bnN(x.area_sq_km,2)} বর্গ কি.মি.</div>`:''}<div class="phc-admin-chip">🏠 খানা: ${bnInt(x.hh_total_2022)}</div><div class="phc-admin-chip">👥 জনসংখ্যা: ${bnInt(x.pop_total_2022)}</div><div class="phc-admin-chip">⚖️ লিঙ্গানুপাত: ${bnN(x.sex_ratio_2022,2)}</div><div class="phc-admin-chip">🌐 জনঘনত্ব: ${bnN(x.pop_density_2022)}</div><div class="phc-admin-chip">📘 সাক্ষরতা: ${bnPct(x.literacy_total_2022)}</div></div>
    ${villageTable}`;
}
