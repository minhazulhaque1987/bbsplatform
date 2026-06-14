/* ═══════════════════════════════════════════════════════════════
   PHC 2022 — মাল্টি-ডিস্ট্রিক্ট রেজিস্ট্রি
   64 জেলার ডেটা পর্যায়ক্রমে যোগ হবে
   ═══════════════════════════════════════════════════════════════ */

/* ── District Registry — প্রতিটি জেলা যোগ হলে এখানে এন্ট্রি হবে ─ */
var PHC_DISTRICT_REGISTRY = [
  {
    id: "coxsbazar",
    name_bn: "কক্সবাজার",
    name_en: "Cox's Bazar",
    code: "10",
    division_bn: "চট্টগ্রাম",
    division_en: "Chattogram",
    report_type: "community",
    available: true,
    color: "#1565C0",
    icon: "🏖️",
    pop_total_2022: 2823268,
    upazila_count: 9,
    data_obj: "PHC_DISTRICT",         // window var name for district summary
    upazilas_obj: "PHC_UPAZILAS",     // window var name for upazila array
  },
  {
    id: "chittagong",
    name_bn: "চট্টগ্রাম",
    name_en: "Chattogram",
    code: "15",
    division_bn: "চট্টগ্রাম",
    division_en: "Chattogram",
    report_type: "district",
    available: true,
    color: "#B71C1C",
    icon: "⚓",
    pop_total_2022: 9169465,
    upazila_count: 16,
    data_obj: "PHC_DISTRICT_CHATTOGRAM",
    upazilas_obj: "PHC_UPAZILAS_CHATTOGRAM",
  },
  // ── আরও জেলা পর্যায়ক্রমে যোগ হবে ─────────────────────────
  { id:"dhaka",      name_bn:"ঢাকা",       name_en:"Dhaka",       code:"26", division_bn:"ঢাকা",       available:false, color:"#1B5E20", icon:"🏙️", pop_total_2022:null, upazila_count:null },
  { id:"gazipur",    name_bn:"গাজীপুর",   name_en:"Gazipur",     code:"33", division_bn:"ঢাকা",       available:false, color:"#1B5E20", icon:"🏭", pop_total_2022:null, upazila_count:null },
  { id:"narsingdi",  name_bn:"নরসিংদী",  name_en:"Narsingdi",   code:"48", division_bn:"ঢাকা",       available:false, color:"#1B5E20", icon:"🌾", pop_total_2022:null, upazila_count:null },
  { id:"sylhet",     name_bn:"সিলেট",     name_en:"Sylhet",      code:"91", division_bn:"সিলেট",      available:false, color:"#4A148C", icon:"🍵", pop_total_2022:null, upazila_count:null },
  { id:"rajshahi",   name_bn:"রাজশাহী",  name_en:"Rajshahi",    code:"81", division_bn:"রাজশাহী",    available:false, color:"#E65100", icon:"🥭", pop_total_2022:null, upazila_count:null },
  { id:"khulna",     name_bn:"খুলনা",     name_en:"Khulna",      code:"47", division_bn:"খুলনা",      available:false, color:"#006064", icon:"🦐", pop_total_2022:null, upazila_count:null },
  { id:"barisal",    name_bn:"বরিশাল",   name_en:"Barisal",     code:"06", division_bn:"বরিশাল",     available:false, color:"#880E4F", icon:"🚢", pop_total_2022:null, upazila_count:null },
  { id:"rangpur",    name_bn:"রংপুর",    name_en:"Rangpur",     code:"85", division_bn:"রংপুর",      available:false, color:"#33691E", icon:"🌿", pop_total_2022:null, upazila_count:null },
  { id:"mymensingh", name_bn:"ময়মনসিংহ",name_en:"Mymensingh",  code:"61", division_bn:"ময়মনসিংহ",  available:false, color:"#37474F", icon:"🎨", pop_total_2022:null, upazila_count:null },
];

/* ── Current selected district state ─────────────────────────── */
let phcActiveDistrict = null;   // registry entry
let phcActiveData = null;       // district summary object
let phcActiveUpazilas = null;   // upazila array

/* ── Entry: District selector screen ─────────────────────────── */
function renderPHCDistrictSelector() {
  const content = document.getElementById('phc-content');
  if (!content) return;

  const BN_D = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function bnInt(n) {
    if (n == null) return '—';
    return String(n).replace(/\d/g, d => BN_D[+d]);
  }

  // Use PHC_ALL_DISTRICTS if available (from phc_all_districts_registry.js), otherwise fallback
  const registry = (typeof PHC_ALL_DISTRICTS !== 'undefined' && PHC_ALL_DISTRICTS.length > 0)
    ? PHC_ALL_DISTRICTS
    : PHC_DISTRICT_REGISTRY;

  const available = registry.filter(d => d.available);
  const coming    = registry.filter(d => !d.available);

  const availCards = available.map(d => `
    <div class="phc-dist-sel-card" onclick="loadPHCDistrict('${d.id}')"
      style="border-left:4px solid ${d.color}">
      <div class="phc-dsc-top">
        <span class="phc-dsc-icon">${d.icon}</span>
        <div>
          <div class="phc-dsc-name">${d.name_bn}</div>
          <div class="phc-dsc-en">${d.name_en}</div>
        </div>
        <span class="phc-dsc-badge" style="background:${d.color}">✓ ডেটা আছে</span>
      </div>
      <div class="phc-dsc-stats">
        <span>🗺️ ${d.division_bn} বিভাগ</span>
        <span>👥 ${d.pop_total_2022 ? bnInt(d.pop_total_2022) : '—'}</span>
        <span>🏛️ ${d.upazila_count || '—'} উপজেলা</span>
        <span class="phc-dsc-type">${(d.series || d.report_type) === 'community' ? 'কমিউনিটি রিপোর্ট' : 'জেলা রিপোর্ট'}</span>
      </div>
    </div>`).join('');

  const comingCards = coming.slice(0,8).map(d => `
    <div class="phc-dist-sel-card phc-dsc-coming">
      <div class="phc-dsc-top">
        <span class="phc-dsc-icon">${d.icon}</span>
        <div>
          <div class="phc-dsc-name" style="color:#90A4AE">${d.name_bn}</div>
          <div class="phc-dsc-en" style="color:#B0BEC5">${d.name_en}</div>
        </div>
        <span class="phc-dsc-badge-soon">শীঘ্রই</span>
      </div>
      <div class="phc-dsc-stats" style="color:#B0BEC5">
        <span>🗺️ ${d.division_bn} বিভাগ</span>
      </div>
    </div>`).join('');

  content.innerHTML = `
    <div class="phc-sel-banner">
      <div class="phc-sel-title">জনশুমারি ও গৃহগণনা ২০২২</div>
      <div class="phc-sel-sub">Population and Housing Census 2022<br>জেলা নির্বাচন করুন</div>
      <div class="phc-sel-count">
        <span class="phc-sel-chip">${bnInt(available.length)} টি জেলার ডেটা প্রস্তুত</span>
        <span class="phc-sel-chip-gray">${bnInt(64 - available.length)} টি শীঘ্রই আসছে</span>
      </div>
    </div>

    <div class="phc-sel-section-title">✅ উপলব্ধ জেলাসমূহ</div>
    <div class="phc-dist-grid">${availCards}</div>

    <div class="phc-sel-section-title" style="margin-top:16px">🕐 শীঘ্রই আসছে</div>
    <div class="phc-dist-grid phc-coming-grid">${comingCards}</div>
    <div class="phc-sel-note">
      পর্যায়ক্রমে ৬৪ জেলার সম্পূর্ণ ডেটাবেইজ যোগ করা হবে।<br>
      BBS অ্যাপ আপডেট করতে থাকুন।
    </div>`;
}

/* ── Load a district and switch to its view ───────────────────── */
function loadPHCDistrict(districtId) {
  // Search in PHC_ALL_DISTRICTS first, then fallback to PHC_DISTRICT_REGISTRY
  let reg = null;
  if (typeof PHC_ALL_DISTRICTS !== 'undefined' && PHC_ALL_DISTRICTS.length > 0) {
    reg = PHC_ALL_DISTRICTS.find(d => d.id === districtId);
  }
  if (!reg) {
    reg = PHC_DISTRICT_REGISTRY.find(d => d.id === districtId);
  }
  if (!reg || !reg.available) return;

  phcActiveDistrict = reg;
  
  // Load data - community series may have null data_obj
  if (reg.data_obj && window[reg.data_obj]) {
    phcActiveData = window[reg.data_obj];
  } else {
    // Create minimal district summary from registry info
    phcActiveData = {
      name_bn: reg.name_bn,
      name_en: reg.name_en,
      division_bn: reg.division_bn || '',
      report_type: reg.series || reg.report_type || 'community',
    };
  }
  
  phcActiveUpazilas = reg.upazilas_obj ? window[reg.upazilas_obj] : null;

  // If upazila data not found in window, try to lazy-load district script.
  if (!phcActiveUpazilas && typeof loadScript === 'function') {
    let scriptPath = '';
    // community files use naming: phc_<district>_comm.js
    if (reg.id === 'coxsbazar') scriptPath = 'js/PHC districts/phc_coxsbazar_comm.js';
    else if (reg.id === 'chittagong') scriptPath = 'js/PHC districts/phc_chattogram_comm.js';
    else scriptPath = 'js/PHC districts/phc_' + reg.id + '.js';

    if (scriptPath) {
      toast('ডেটা লোড হচ্ছে...', 'info');
      loadScript(scriptPath, function(){
        phcActiveUpazilas = reg.upazilas_obj ? window[reg.upazilas_obj] : null;
        if (!phcActiveUpazilas) {
          if (typeof toast === 'function') toast('ডেটা লোড হয়নি: ' + reg.upazilas_obj, 'warn');
          return;
        }
        // Reset tabs to upazilas
        phcCurrentTab    = 'upazilas';
        phcSearchQuery   = '';
        phcSelectedCat   = 'সব';
        phcCompareList   = [];
        phcCurrentUpazila = null;

        const hMain = document.getElementById('phc-header-main-txt');
        const hSub  = document.getElementById('phc-header-sub-txt');
        const hBadge = document.getElementById('phc-header-badge-txt');
        if (hMain) hMain.textContent = phcActiveData.name_bn + ' জেলা';
        if (hSub)  hSub.textContent  = 'জনশুমারি ও গৃহগণনা ২০২২ — BBS';
        if (hBadge) hBadge.textContent = phcActiveUpazilas.length + ' ইউনিট';

        renderPHCTabs();
        renderPHCUpazilaGridDistrict();
      });
      return;
    }
  }

  if (!phcActiveUpazilas) {
    if (typeof toast === 'function') toast('ডেটা লোড হয়নি: ' + reg.upazilas_obj, 'warn');
    return;
  }

  // Reset tabs to upazilas
  phcCurrentTab    = 'upazilas';
  phcSearchQuery   = '';
  phcSelectedCat   = 'সব';
  phcCompareList   = [];
  phcCurrentUpazila = null;

  // Update header
  const hMain = document.getElementById('phc-header-main-txt');
  const hSub  = document.getElementById('phc-header-sub-txt');
  const hBadge = document.getElementById('phc-header-badge-txt');
  if (hMain) hMain.textContent = phcActiveData.name_bn + ' জেলা';
  if (hSub)  hSub.textContent  = 'জনশুমারি ও গৃহগণনা ২০২২ — BBS';
  if (hBadge) hBadge.textContent = phcActiveUpazilas.length + ' ইউনিট';

  renderPHCTabs();
  renderPHCUpazilaGridDistrict();
}

/* ── Overriding renderPHCHome to show district selector ─────── */
function renderPHCHome() {
  // Reset header to show district selector state
  const hMain = document.getElementById('phc-header-main-txt');
  const hSub  = document.getElementById('phc-header-sub-txt');
  const hBadge = document.getElementById('phc-header-badge-txt');
  if (hMain) hMain.textContent = 'জনশুমারি ও গৃহগণনা ২০২২';
  if (hSub)  hSub.textContent  = 'জেলা নির্বাচন করুন — BBS';
  
  // Show count of available districts
  const registry = (typeof PHC_ALL_DISTRICTS !== 'undefined' && PHC_ALL_DISTRICTS.length > 0)
    ? PHC_ALL_DISTRICTS
    : PHC_DISTRICT_REGISTRY;
  const availCount = registry.filter(d => d.available).length;
  if (hBadge) hBadge.textContent = availCount + ' জেলা';
  
  renderPHCTabs();
  renderPHCDistrictSelector();
}

/* ── Rebuild tabs to include district-selector back button ───── */
const _origRenderPHCTabs = renderPHCTabs;
function renderPHCTabs() {
  const tabs = [
    {id:'upazilas', label:'🗺️ উপজেলা/থানা'},
    {id:'compare',  label:'📊 তুলনা'},
    {id:'district', label:'🏛️ জেলা'},
  ];
  const bar = document.getElementById('phc-tabs');
  if (!bar) return;
  bar.innerHTML = tabs.map(t =>
    `<button class="phc-tab${phcCurrentTab===t.id?' phc-tab-on':''}"
       onclick="switchPHCTabDistrict('${t.id}')">${t.label}</button>`
  ).join('');
}

function switchPHCTabDistrict(tab) {
  phcCurrentTab = tab;
  renderPHCTabs();
  const content = document.getElementById('phc-content');
  if (!content) return;
  if (!phcActiveData) { renderPHCDistrictSelector(); return; }
  if (tab === 'search')    renderPHCSearchDistrict(phcSearchQuery);
  if (tab === 'upazilas') renderPHCUpazilaGridDistrict();
  if (tab === 'compare')  renderPHCCompareDistrict();
  if (tab === 'district') renderPHCDistrictView();
}

/* Override switchPHCTab from phc_2022_view.js */
window.switchPHCTab = switchPHCTabDistrict;

/* ══════════════════════════════════════════════════════
   SEARCH — uses active district's upazilas
   ══════════════════════════════════════════════════════ */
function renderPHCSearchDistrict(q) {
  if (!phcActiveData || !phcActiveUpazilas) { renderPHCDistrictSelector(); return; }

  // Swap globals that phc_2022_view.js uses
  window._origPHC_UPAZILAS = window.PHC_UPAZILAS;
  window.PHC_UPAZILAS = phcActiveUpazilas;
  renderPHCSearch(q);
  window.PHC_UPAZILAS = window._origPHC_UPAZILAS;
}

/* ══════════════════════════════════════════════════════
   UPAZILA GRID — handles both types (upazila & CC)
   ══════════════════════════════════════════════════════ */
function renderPHCUpazilaGridDistrict() {
  if (!phcActiveUpazilas) { renderPHCDistrictSelector(); return; }
  const content = document.getElementById('phc-content');
  if (!content) return;

  const BN_D=['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function bnN(n,d=0){ if(n==null)return '—'; const s=d>0?parseFloat(n).toFixed(d):String(Math.round(n)); return s.split('').map(c=>/\d/.test(c)?BN_D[+c]:c).join(''); }
  function bnPct(n){ return n==null?'—':bnN(n,2)+'%'; }
  function bnInt(n){ return n==null?'—':Number(n).toLocaleString('bn-BD'); }
  function miniBar(label,val,color){
    const pct=Math.min(val||0,100);
    return `<div class="mini-bar-wrap"><div class="mini-bar-lbl">${label}</div><div class="mini-bar-bg"><div class="mini-bar-fill" style="width:${pct}%;background:${color}"></div></div><div class="mini-bar-val">${bnN(val,1)}%</div></div>`;
  }

  const cards = phcActiveUpazilas.map(u => {
    // Handle both district series and community series field names
    const uName = u.name_bn || u.name_clean || u.name || '';
    const uNameEn = u.name_en || u.name_clean || u.name || '';
    const uPop = u.pop_total_2022 || u.pop_total;
    const uLit = u.literacy_7plus_2022 != null ? u.literacy_7plus_2022 : u.lit_7plus_total;
    const uNet = u.internet_pct != null ? u.internet_pct : (u.internet_5plus_total || u.sdg_internet);
    const uElec = u.electricity_grid_pct != null ? u.electricity_grid_pct : u.sdg_electricity;
    const uNeet = u.neet_total_pct != null ? u.neet_total_pct : u.neet_total;
    const uToilet = u.toilet_safe_flush_pct;
    const uPucca = u.dwelling_pucca_pct;
    
    return `
    <div class="phc-upz-card" onclick="openPHCUpazilaDistrict(${u.id})"
      style="--upz-color:${phcActiveDistrict.color}">
      <div class="phc-upz-card-top" style="background:linear-gradient(135deg,${phcActiveDistrict.color},${phcActiveDistrict.color}dd)">
        <div class="phc-upz-card-name">${uName}</div>
        <div class="phc-upz-card-sub">${uNameEn}${u.type==='city_corporation'?' (সিটি কর্পোরেশন)':''}</div>
      </div>
      <div class="phc-upz-kpis">
        <div class="phc-kpi"><span class="phc-kpi-val">${bnInt(uPop)}</span><span class="phc-kpi-lbl">জনসংখ্যা</span></div>
        <div class="phc-kpi"><span class="phc-kpi-val">${bnN(uLit,1)}%</span><span class="phc-kpi-lbl">সাক্ষরতা</span></div>
        <div class="phc-kpi"><span class="phc-kpi-val">${bnN(uNet,1)}%</span><span class="phc-kpi-lbl">ইন্টারনেট</span></div>
        <div class="phc-kpi"><span class="phc-kpi-val">${bnN(uElec,1)}%</span><span class="phc-kpi-lbl">গ্রিড বিদ্যুৎ</span></div>
      </div>
      <div class="phc-upz-bar-row">
        ${miniBar('NEET',uNeet,'#C62828')}
        ${miniBar('নিরাপদ টয়লেট',uToilet,'#00695C')}
        ${miniBar('পাকা ঘর',uPucca,'#6A1B9A')}
      </div>
      <div class="phc-upz-card-foot">
        <span>👥 ${bnInt(uPop)}</span>
        <span>${u.type==='city_corporation'?'🏙️ সিটি কর্পো.':'🏘️ '+bnN(u.unions||'—')+' ইউনিয়ন'}</span>
        <span class="phc-more-btn" style="color:${phcActiveDistrict.color}">বিস্তারিত →</span>
      </div>
    </div>`;
  }).join('');

  content.innerHTML = `
    <div class="phc-upz-intro" style="background:${phcActiveDistrict.color}15;border-left:3px solid ${phcActiveDistrict.color}">
      ${phcActiveDistrict.icon} <strong>${phcActiveData.name_bn} জেলার ${phcActiveUpazilas.length}টি প্রশাসনিক একক</strong> এক নজরে।
      কার্ডে ক্লিক করলে সম্পূর্ণ তথ্য দেখা যাবে।
    </div>
    <div class="phc-upz-grid">${cards}</div>`;
}

function openPHCUpazilaDistrict(id) {
  phcCurrentUpazila = phcActiveUpazilas.find(u => u.id === id);
  if (!phcCurrentUpazila) return;
  renderPHCUpazilaDetailDistrict();
  goView('v-phc-detail');
}

/* ══════════════════════════════════════════════════════
   UPAZILA DETAIL — Chattogram-aware (district report format)
   ══════════════════════════════════════════════════════ */
function renderPHCUpazilaDetailDistrict() {
  const u = phcCurrentUpazila;
  if (!u) return;
  const host = document.getElementById('phc-detail-body');
  if (!host) return;

  const hName = document.getElementById('phc-detail-name');
  const uName = u.name_bn || u.name_clean || u.name || '';
  if (hName) hName.textContent = uName + (u.type==='city_corporation' ? ' সিটি কর্পোরেশন' : ' উপজেলা');

  const BN_D=['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function bnN(n,d=0){ if(n==null)return '—'; const s=d>0?parseFloat(n).toFixed(d):String(Math.round(n)); return s.split('').map(c=>/\d/.test(c)?BN_D[+c]:c).join(''); }
  function bnPct(n){ return n==null?'—':bnN(n,2)+'%'; }
  function bnInt(n){ return n==null?'—':Number(n).toLocaleString('bn-BD'); }
  // Helper: get value from either field name
  function v(a,b){ return u[a]!=null ? u[a] : (b ? u[b] : null); }

  const noteHtml = u.note ? `<div class="phc-detail-note">ℹ️ ${u.note}</div>` : '';

  const adminHtml = `
    <div class="phc-detail-admin">
      <div class="phc-admin-chip" style="background:${phcActiveDistrict.color}20;color:${phcActiveDistrict.color}">
        ${phcActiveDistrict.icon} ${phcActiveData.name_bn} জেলা
      </div>
      ${u.type==='city_corporation'
        ? `<div class="phc-admin-chip">🏙️ সিটি কর্পোরেশন</div><div class="phc-admin-chip">🏛️ ${bnN(u.metro_thana)} মেট্রো থানা</div><div class="phc-admin-chip">🗺️ ${bnN(u.ward_count)} ওয়ার্ড</div>`
        : `<div class="phc-admin-chip">🏘️ ${bnN(u.unions)} ইউনিয়ন</div>`
      }
      ${u.code ? `<div class="phc-admin-chip">🆔 কোড: ${u.code}</div>` : ''}
    </div>`;

  const sections = [
    {
      icon:'👥', title:'জনসংখ্যা', rows:[
        ['মোট জনসংখ্যা (২০২২)', bnInt(v('pop_total_2022','pop_total'))],
        ['পুরুষ', bnInt(v('pop_male_2022','pop_male'))],
        ['মহিলা', bnInt(v('pop_female_2022','pop_female'))],
        ['হিজড়া', bnN(v('pop_hijra_2022','pop_hijra'))],
        ['গ্রামীণ জনসংখ্যা', bnInt(v('pop_rural_2022','pop_rural'))],
        ['শহর জনসংখ্যা', bnInt(v('pop_urban_2022','pop_urban'))],
        ['শহর জনসংখ্যার অনুপাত', bnPct(u.urban_pct_2022)],
        ['মোট জনসংখ্যা (২০১১)', u.pop_total_2011?bnInt(u.pop_total_2011):'—'],
        ['মোট জনসংখ্যা (২০০১)', u.pop_total_2001?bnInt(u.pop_total_2001):'—'],
        ['মোট জনসংখ্যা (১৯৯১)', u.pop_total_1991?bnInt(u.pop_total_1991):'—'],
        ['বার্ষিক বৃদ্ধির হার', u.growth_rate_2022!=null?bnPct(u.growth_rate_2022):'—'],
        ['লিঙ্গানুপাত (প্রতি ১০০ মহিলায় পুরুষ)', bnN(v('sex_ratio_2022','sex_ratio'),2)],
        ['গ্রামীণ লিঙ্গানুপাত', u.sex_ratio_rural_2022!=null?bnN(u.sex_ratio_rural_2022,2):'—'],
        ['শহর লিঙ্গানুপাত', u.sex_ratio_urban_2022!=null?bnN(u.sex_ratio_urban_2022,2):'—'],
        ['নির্ভরশীলতার অনুপাত', u.dependency_ratio!=null?bnN(u.dependency_ratio,2):'—'],
      ]
    },
    {
      icon:'📚', title:'সাক্ষরতা', rows:[
        ['সাক্ষরতার হার, ৭+ বছর (মোট)', bnPct(v('literacy_7plus_2022','lit_7plus_total'))],
        ['সাক্ষরতার হার, ৭+ বছর (পুরুষ)', bnPct(v('literacy_7plus_male','lit_7plus_male'))],
        ['সাক্ষরতার হার, ৭+ বছর (মহিলা)', bnPct(v('literacy_7plus_female','lit_7plus_female'))],
        ['সাক্ষরতার হার, ১৫+ বছর (মোট)', bnPct(v('literacy_15plus_2022','lit_15plus_total'))],
        ['সাক্ষরতার হার, ১৫+ বছর (পুরুষ)', bnPct(v('literacy_15plus_male','lit_15plus_male'))],
        ['সাক্ষরতার হার, ১৫+ বছর (মহিলা)', bnPct(v('literacy_15plus_female','lit_15plus_female'))],
      ]
    },
    {
      icon:'🏠', title:'খানা ও বাসগৃহ', rows:[
        ['মোট সাধারণ খানা', bnInt(v('hh_general_2022','hh_general'))],
        ['গ্রামীণ খানা', bnInt(u.hh_rural_2022)],
        ['শহর খানা', bnInt(u.hh_urban_2022)],
        ['মোট খানা', bnInt(v('hh_total_2022','hh_total'))],
        ['বাসগৃহের সংখ্যা', bnInt(u.dwelling_units_2022)],
        ['গড় খানার আকার', bnN(v('hh_size_2022','hh_size'),2)],
        ['গ্রামীণ গড় খানার আকার', u.hh_size_rural_2022!=null?bnN(u.hh_size_rural_2022,2):'—'],
        ['শহর গড় খানার আকার', u.hh_size_urban_2022!=null?bnN(u.hh_size_urban_2022,2):'—'],
      ]
    },
    {
      icon:'🏗️', title:'বাসগৃহের ধরন', rows:[
        ['পাকা বাসগৃহ', bnPct(u.dwelling_pucca_pct)],
        ['সেমি-পাকা বাসগৃহ', bnPct(u.dwelling_semipucca_pct)],
        ['কাঁচা বাসগৃহ', bnPct(u.dwelling_kancha_pct)],
        ['ঝুপড়ি বাসগৃহ', bnPct(u.dwelling_jhupri_pct)],
        ['নিজস্ব বাসগৃহ', bnPct(u.own_dwelling_pct)],
      ]
    },
    {
      icon:'💧', title:'পানি ও স্যানিটেশন', rows:[
        ['নলকূপ পানির উৎস', bnPct(u.water_tubewell_pct)],
        ['ট্যাপ/পাইপ পানির উৎস', bnPct(u.water_tap_pct)],
        ['বোতলজাত পানি', bnPct(u.water_bottled_pct)],
        ['নিরাপদ টয়লেট (ফ্লাশ)', bnPct(u.toilet_safe_flush_pct)],
        ['স্ল্যাব সহ পিট ল্যাট্রিন', bnPct(u.toilet_pit_slab_pct)],
        ['অনিরাপদ টয়লেট', bnPct(u.toilet_unsafe_pct)],
        ['খোলা মলত্যাগ', bnPct(u.toilet_open_defecation_pct)],
      ]
    },
    {
      icon:'⚡', title:'বিদ্যুৎ', rows:[
        ['জাতীয় গ্রিড বিদ্যুৎ', bnPct(v('electricity_grid_pct','sdg_electricity'))],
        ['সোলার বিদ্যুৎ', bnPct(u.electricity_solar_pct)],
        ['বিদ্যুৎ নেই', bnPct(u.electricity_none_pct)],
      ]
    },
    {
      icon:'🎯', title:'NEET (শিক্ষা ও কর্মহীন যুব)', rows:[
        ['NEET যুব জনগোষ্ঠী (মোট)', bnPct(v('neet_total_pct','neet_total'))],
        ['NEET (পুরুষ)', bnPct(v('neet_male_pct','neet_male'))],
        ['NEET (মহিলা)', bnPct(v('neet_female_pct','neet_female'))],
        ['NEET (গ্রামীণ)', bnPct(u.neet_rural_pct)],
        ['NEET (শহর)', bnPct(u.neet_urban_pct)],
      ]
    },
    {
      icon:'📱', title:'প্রযুক্তি ও আর্থিক অন্তর্ভুক্তি', rows:[
        ['মোবাইল ফোন ব্যবহারকারী', bnPct(v('mobile_phone_pct','mobile_5plus_total'))],
        ['ইন্টারনেট ব্যবহারকারী', bnPct(v('internet_pct','internet_5plus_total'))],
        ['আর্থিক অ্যাকাউন্টধারী', bnPct(v('financial_account_pct','fin_account_total'))],
        ['মোবাইল ব্যাংকিং', bnPct(v('mobile_banking_pct','mobile_banking_total'))],
      ]
    },
    {
      icon:'🌐', title:'SDG সূচকসমূহ', rows:[
        ['SDG 4.2.2 — শিক্ষায় অংশগ্রহণ', bnPct(u.sdg_learning)],
        ['SDG 5.b.1 — মোবাইল ফোন মালিকানা', bnPct(u.sdg_mobile)],
        ['SDG 6.2.1a — স্বাস্থ্যসম্মত স্যানিটেশন', bnPct(u.sdg_sanitation)],
        ['SDG 6.2.1b — হাত ধোয়ার সুবিধা', bnPct(u.sdg_handwashing)],
        ['SDG 7.1.1 — বিদ্যুৎ সুবিধা', bnPct(u.sdg_electricity)],
        ['SDG 7.1.2 — পরিষ্কার জ্বালানি', bnPct(u.sdg_clean_fuel)],
        ['SDG 8.6.1 — NEET যুব', bnPct(u.sdg_neet)],
        ['SDG 8.10.2 — আর্থিক অন্তর্ভুক্তি', bnPct(u.sdg_financial)],
        ['SDG 11.1.1 — শহর বস্তি জনগোষ্ঠী', u.sdg_urban_slum!=null?bnPct(u.sdg_urban_slum):'—'],
        ['SDG 17.8.1 — ইন্টারনেট ব্যবহারকারী', bnPct(u.sdg_internet)],
      ]
    },
  ];

  const sectionsHtml = sections.map(sec => `
    <div class="phc-detail-section">
      <div class="phc-sec-title" style="background:${phcActiveDistrict.color}">${sec.icon} ${sec.title}</div>
      <table class="phc-detail-tbl">
        ${sec.rows.map(([label,val]) => `
          <tr><td class="phc-dt-label">${label}</td>
              <td class="phc-dt-val" style="color:${phcActiveDistrict.color}">${val}</td></tr>`).join('')}
      </table>
    </div>`).join('');

  host.innerHTML = noteHtml + adminHtml + sectionsHtml;
}

/* ══════════════════════════════════════════════════════
   COMPARE — district-aware
   ══════════════════════════════════════════════════════ */
function renderPHCCompareDistrict() {
  if (!phcActiveUpazilas) return;
  window._origPHC_UPAZILAS = window.PHC_UPAZILAS;
  window.PHC_UPAZILAS = phcActiveUpazilas;
  renderPHCCompare();
  window.PHC_UPAZILAS = window._origPHC_UPAZILAS;
}

/* ══════════════════════════════════════════════════════
   DISTRICT VIEW — shows district-level summary
   ══════════════════════════════════════════════════════ */
function renderPHCDistrictView() {
  if (!phcActiveData) return;
  const content = document.getElementById('phc-content');
  if (!content) return;

  const d = phcActiveData;
  const BN_D=['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function bnN(n,dec=0){ if(n==null)return '—'; const s=dec>0?parseFloat(n).toFixed(dec):String(Math.round(n)); return s.split('').map(c=>/\d/.test(c)?BN_D[+c]:c).join(''); }
  function bnPct(n){ return n==null?'—':bnN(n,2)+'%'; }
  function bnInt(n){ return n==null?'—':Number(n).toLocaleString('bn-BD'); }

  // Choose field names that work for both Cox's Bazar & Chattogram data formats
  const get = (key, fallback=null) => d[key] != null ? d[key] : fallback;

  const sections = [
    { icon:'👥', title:'জনসংখ্যা', rows:[
      ['মোট জনসংখ্যা (২০২২)', bnInt(get('pop_total_2022'))],
      ['পুরুষ', bnInt(get('pop_male_2022'))],
      ['মহিলা', bnInt(get('pop_female_2022'))],
      ['হিজড়া', bnN(get('pop_hijra_2022',0))],
      ['গ্রামীণ', bnInt(get('pop_rural_2022'))],
      ['শহর', bnInt(get('pop_urban_2022'))],
      ['মোট জনসংখ্যা (২০১১)', bnInt(get('pop_total_2011'))],
      ['মোট জনসংখ্যা (২০০১)', bnInt(get('pop_total_2001'))],
      ['মোট জনসংখ্যা (১৯৯১)', bnInt(get('pop_total_1991'))],
    ]},
    { icon:'📊', title:'মূল জনতাত্ত্বিক সূচক', rows:[
      ['বার্ষিক বৃদ্ধির হার', bnPct(get('growth_rate_2022'))],
      ['জনসংখ্যার ঘনত্ব (প্রতি বর্গ কি.মি.)', bnN(get('pop_density_2022'))],
      ['লিঙ্গানুপাত', bnN(get('sex_ratio_2022'),2)],
      ['শহর জনসংখ্যার অনুপাত', bnPct(get('urban_pct_2022'))],
      ['শহর জনসংখ্যার অনুপাত (২০১১)', bnPct(get('urban_pct_2011'))],
      ['নির্ভরশীলতার অনুপাত', bnN(get('dependency_ratio_2022'),2)],
      ['বাৎসরিক বৃদ্ধির হার (গ্রামীণ)', bnPct(get('growth_rate_rural_2022'))],
      ['বাৎসরিক বৃদ্ধির হার (শহর)', bnPct(get('growth_rate_urban_2022'))],
    ]},
    { icon:'☪️', title:'ধর্ম', rows:[
      ['মুসলিম', bnInt(get('pop_muslim'))],
      ['হিন্দু', bnInt(get('pop_hindu'))],
      ['বৌদ্ধ', bnInt(get('pop_buddhist'))],
      ['খ্রিষ্টান', bnInt(get('pop_christian'))],
      ['অন্যান্য', bnInt(get('pop_others'))],
    ]},
    { icon:'📚', title:'সাক্ষরতা', rows:[
      ['সাক্ষরতার হার ৭+ বছর (মোট)', bnPct(get('literacy_7plus_total_2022')||get('literacy_total_2022'))],
      ['সাক্ষরতার হার ৭+ বছর (পুরুষ)', bnPct(get('literacy_7plus_male_2022')||get('literacy_male_2022'))],
      ['সাক্ষরতার হার ৭+ বছর (মহিলা)', bnPct(get('literacy_7plus_female_2022')||get('literacy_female_2022'))],
      ['সাক্ষরতার হার ১৫+ বছর (মোট)', bnPct(get('literacy_15plus_total_2022'))],
      ['গ্রামীণ সাক্ষরতার হার', bnPct(get('literacy_7plus_rural_2022')||get('literacy_rural_2022'))],
      ['শহর সাক্ষরতার হার', bnPct(get('literacy_7plus_urban_2022')||get('literacy_urban_2022'))],
      ['সাক্ষরতার হার (২০১১)', bnPct(get('literacy_7plus_total_2011')||get('literacy_2011'))],
    ]},
    { icon:'🏠', title:'খানা ও বাসগৃহ', rows:[
      ['মোট খানা', bnInt(get('hh_total_2022'))],
      ['সাধারণ খানা', bnInt(get('hh_general_2022'))],
      ['বাসগৃহের সংখ্যা', bnInt(get('dwelling_units_total_2022')||get('dwelling_units_2022'))],
      ['গড় খানার আকার', bnN(get('hh_size_2022'),2)],
      ['গ্রামীণ গড় খানার আকার', bnN(get('hh_size_rural_2022'),2)],
      ['শহর গড় খানার আকার', bnN(get('hh_size_urban_2022'),2)],
      ['গড় খানার আকার (২০১১)', bnN(get('hh_size_2011'),2)],
    ]},
    { icon:'🏗️', title:'বাসগৃহের ধরন', rows:[
      ['পাকা বাসগৃহ', bnPct(get('dwelling_pucca_pct'))],
      ['সেমি-পাকা বাসগৃহ', bnPct(get('dwelling_semipucca_pct'))],
      ['কাঁচা বাসগৃহ', bnPct(get('dwelling_kancha_pct'))],
      ['ঝুপড়ি বাসগৃহ', bnPct(get('dwelling_jhupri_pct'))],
      ['নিজস্ব বাসগৃহ', bnPct(get('own_dwelling_pct'))],
    ]},
    { icon:'💧', title:'পানি ও স্যানিটেশন', rows:[
      ['ট্যাপ/পাইপ পানির উৎস', bnPct(get('water_tap_pct'))],
      ['নলকূপ পানির উৎস', bnPct(get('water_tubewell_pct'))],
      ['নিরাপদ টয়লেট (ফ্লাশ)', bnPct(get('toilet_safe_flush_pct'))],
      ['খোলা মলত্যাগ', bnPct(get('toilet_open_defecation_pct'))],
      ['টয়লেট ভাগ করা হয় না এমন', bnPct(get('toilet_not_shared_pct'))],
      ['সাবান ও পানি দিয়ে হাত ধোয়া', bnPct(get('handwashing_soap_water_pct'))],
    ]},
    { icon:'⚡', title:'বিদ্যুৎ', rows:[
      ['জাতীয় গ্রিড বিদ্যুৎ', bnPct(get('electricity_grid_pct'))],
      ['সোলার বিদ্যুৎ', bnPct(get('electricity_solar_pct'))],
      ['বিদ্যুৎ নেই', bnPct(get('electricity_none_pct'))],
      ['বিদ্যুৎ নেই (২০১১)', bnPct(get('electricity_none_pct_2011'))],
    ]},
    { icon:'📱', title:'প্রযুক্তি ও আর্থিক অন্তর্ভুক্তি (নতুন সূচক)', rows:[
      ['মোবাইল ফোন ব্যবহারকারী (মোট)', bnPct(get('mobile_phone_pct'))],
      ['মোবাইল ফোন (পুরুষ)', bnPct(get('mobile_phone_male_pct'))],
      ['মোবাইল ফোন (মহিলা)', bnPct(get('mobile_phone_female_pct'))],
      ['ইন্টারনেট ব্যবহারকারী (মোট)', bnPct(get('internet_pct'))],
      ['ইন্টারনেট (পুরুষ)', bnPct(get('internet_male_pct'))],
      ['ইন্টারনেট (মহিলা)', bnPct(get('internet_female_pct'))],
      ['আর্থিক অ্যাকাউন্টধারী (মোট)', bnPct(get('financial_account_pct'))],
      ['মোবাইল ব্যাংকিং (মোট)', bnPct(get('mobile_banking_pct'))],
      ['রেমিটেন্স প্রাপ্ত খানা', bnPct(get('remittance_recipient_hh_pct'))],
    ]},
    { icon:'🎯', title:'NEET (শিক্ষা ও কর্মহীন যুব)', rows:[
      ['NEET যুব জনগোষ্ঠী (মোট)', bnPct(get('neet_total_pct'))],
      ['NEET (পুরুষ)', bnPct(get('neet_male_pct'))],
      ['NEET (মহিলা)', bnPct(get('neet_female_pct'))],
      ['NEET (গ্রামীণ)', bnPct(get('neet_rural_pct'))],
      ['NEET (শহর)', bnPct(get('neet_urban_pct'))],
    ]},
    { icon:'🌐', title:'SDG সূচকসমূহ', rows:[
      ['SDG 4.2.2 — শিক্ষায় অংশগ্রহণ', bnPct(get('sdg_learning'))],
      ['SDG 5.b.1 — মোবাইল ফোন মালিকানা', bnPct(get('sdg_mobile'))],
      ['SDG 6.2.1a — স্বাস্থ্যসম্মত স্যানিটেশন', bnPct(get('sdg_sanitation'))],
      ['SDG 6.2.1b — হাত ধোয়ার সুবিধা', bnPct(get('sdg_handwashing'))],
      ['SDG 7.1.1 — বিদ্যুৎ সুবিধা', bnPct(get('sdg_electricity'))],
      ['SDG 7.1.2 — পরিষ্কার জ্বালানি', bnPct(get('sdg_clean_fuel'))],
      ['SDG 8.6.1 — NEET যুব', bnPct(get('sdg_neet'))],
      ['SDG 8.10.2 — আর্থিক অন্তর্ভুক্তি', bnPct(get('sdg_financial'))],
      ['SDG 11.1.1 — শহর বস্তি', bnPct(get('sdg_urban_slum'))],
      ['SDG 17.8.1 — ইন্টারনেট ব্যবহারকারী', bnPct(get('sdg_internet'))],
    ]},
    { icon:'🏛️', title:'প্রশাসনিক একক', rows:[
      ['মোট আয়তন (বর্গ কি.মি.)', bnN(get('area_sq_km'),2)],
      ['উপজেলার সংখ্যা', bnN(get('upazila_count'))],
      ['পৌরসভার সংখ্যা', bnN(get('paurashava_count'))],
      ['ইউনিয়নের সংখ্যা', bnN(get('union_count'))],
      ['গ্রামের সংখ্যা', bnN(get('village_count'))],
      ['সিটি কর্পোরেশন', bnN(get('city_corporation_count'))],
      ['মৌজার সংখ্যা', bnN(get('mauza_count'))],
    ]},
  ];

  const sectionsHtml = sections.map(sec => `
    <div class="phc-detail-section">
      <div class="phc-sec-title" style="background:${phcActiveDistrict.color}">${sec.icon} ${sec.title}</div>
      <table class="phc-detail-tbl">
        ${sec.rows.map(([l,v]) => `<tr><td class="phc-dt-label">${l}</td><td class="phc-dt-val" style="color:${phcActiveDistrict.color}">${v}</td></tr>`).join('')}
      </table>
    </div>`).join('');

  const BN_D2=['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function bn2(n,dec=0){if(n==null)return'—';const s=dec>0?parseFloat(n).toFixed(dec):String(Math.round(n));return s.split('').map(c=>/\d/.test(c)?BN_D2[+c]:c).join('');}

  content.innerHTML = `
    <div class="phc-district-banner" style="background:linear-gradient(135deg,${phcActiveDistrict.color},${phcActiveDistrict.color}cc)">
      <div style="font-size:28px;margin-bottom:4px">${phcActiveDistrict.icon}</div>
      <div class="phc-dist-name">${d.name_bn} জেলা</div>
      <div class="phc-dist-sub">জনশুমারি ও গৃহগণনা ২০২২ — ${(d.series || d.report_type)==='district'?'জেলা রিপোর্ট':'কমিউনিটি রিপোর্ট'}</div>
      <div class="phc-dist-kpis">
        <div class="phc-dist-kpi"><div class="phc-dist-kpi-val">${d.pop_total_2022 ? Number(d.pop_total_2022).toLocaleString('bn-BD') : '—'}</div><div class="phc-dist-kpi-lbl">মোট জনসংখ্যা</div></div>
        <div class="phc-dist-kpi"><div class="phc-dist-kpi-val">${bn2(d.literacy_7plus_total_2022||d.literacy_total_2022,1)}%</div><div class="phc-dist-kpi-lbl">সাক্ষরতা</div></div>
        <div class="phc-dist-kpi"><div class="phc-dist-kpi-val">${bn2(d.internet_pct||d.sdg_internet,1)}%</div><div class="phc-dist-kpi-lbl">ইন্টারনেট</div></div>
        <div class="phc-dist-kpi"><div class="phc-dist-kpi-val">${bn2(d.electricity_grid_pct,1)}%</div><div class="phc-dist-kpi-lbl">গ্রিড বিদ্যুৎ</div></div>
      </div>
      <div style="margin-top:10px">
        <button class="phc-back-to-sel-btn" onclick="phcActiveData=null;phcActiveDistrict=null;phcActiveUpazilas=null;renderPHCHome()">
          ← অন্য জেলা নির্বাচন করুন
        </button>
      </div>
    </div>
    ${sectionsHtml}`;
}

/* ── Patch: redirect openPHCUpazila to district-aware version ─── */
window.openPHCUpazila = function(id) {
  if (phcActiveUpazilas) {
    openPHCUpazilaDistrict(id);
  } else {
    // fallback: use original PHC_UPAZILAS (Cox's Bazar)
    phcCurrentUpazila = PHC_UPAZILAS.find(u => u.id === id);
    if (!phcCurrentUpazila) return;
    renderPHCUpazilaDetail();
    goView('v-phc-detail');
  }
};

/* ── Patch: renderPHCUpazilaDetail delegates to district-aware ── */
const _origRenderDetail = renderPHCUpazilaDetail;
window.renderPHCUpazilaDetail = function() {
  if (phcActiveUpazilas) renderPHCUpazilaDetailDistrict();
  else _origRenderDetail();
};
