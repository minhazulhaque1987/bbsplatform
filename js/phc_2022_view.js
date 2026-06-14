/* ═══════════════════════════════════════════════════════════════
   PHC 2022 VIEW — জনশুমারি ও গৃহগণনা ২০২২ UI
   Handles: Search, Upazila Cards, Comparisons, Detail Sheets
   ═══════════════════════════════════════════════════════════════ */

const BN_D = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
function bnN(n, dec=0){
  if(n == null) return '—';
  const s = dec>0 ? parseFloat(n).toFixed(dec) : String(Math.round(n));
  return s.split('').map(c => /\d/.test(c) ? BN_D[+c] : c).join('');
}
function bnPct(n){ return n==null ? '—' : bnN(n,2)+'%'; }
function bnInt(n){ return n==null ? '—' : Number(n).toLocaleString('bn-BD'); }

// ── Category color map ──────────────────────────────────────────
const CAT_COLORS = {
  'জনসংখ্যা':       '#1565C0',
  'নগরায়ন':        '#0277BD',
  'শিক্ষা':         '#2E7D32',
  'আবাসন':         '#6A1B9A',
  'পানি ও স্যানিটেশন':'#00695C',
  'বিদ্যুৎ':         '#F57F17',
  'কর্মসংস্থান':    '#C62828',
  'প্রযুক্তি':       '#283593',
  'আর্থিক অন্তর্ভুক্তি':'#1B5E20',
  'SDG সূচক':      '#4A148C',
  'ধর্ম':           '#37474F',
  'খানা':           '#4E342E',
  'ভৌগোলিক':       '#33691E',
  'প্রশাসনিক':      '#880E4F',
};
function catColor(cat){ return CAT_COLORS[cat] || '#455A64'; }

// ── State ───────────────────────────────────────────────────────
let phcCurrentUpazila = null;
let phcCurrentTab = 'search';
let phcSearchQuery = '';
let phcSelectedCat = 'সব';
let phcCompareList = [];
let phcCompareIndicator = 'pop_total_2022';

// ── Entry point: called when v-phc view opens ───────────────────
function renderPHCHome(){
  phcCurrentTab = 'upazilas';
  renderPHCTabs();
  renderPHCUpazilaGrid();
}

// ── Tab switcher ────────────────────────────────────────────────
function switchPHCTab(tab){
  phcCurrentTab = tab;
  renderPHCTabs();
  const content = document.getElementById('phc-content');
  if(!content) return;
  if(tab === 'search')    renderPHCSearch(phcSearchQuery);
  if(tab === 'upazilas') renderPHCUpazilaGrid();
  if(tab === 'compare')  renderPHCCompare();
  if(tab === 'district') renderPHCDistrict();
}

function renderPHCTabs(){
  const tabs = [
    {id:'upazilas', label:'🗺️ উপজেলা'},
    {id:'compare',  label:'📊 তুলনা'},
    {id:'district', label:'🏛️ জেলা'},
  ];
  const bar = document.getElementById('phc-tabs');
  if(!bar) return;
  bar.innerHTML = tabs.map(t =>
    `<button class="phc-tab${phcCurrentTab===t.id?' phc-tab-on':''}" onclick="switchPHCTab('${t.id}')">${t.label}</button>`
  ).join('');
}

// ══════════════════════════════════════════════════════
// 1) SEARCH VIEW
// ══════════════════════════════════════════════════════
function renderPHCSearch(q){
  const content = document.getElementById('phc-content');
  if(!content) return;
  phcSearchQuery = q || '';

  // Get unique categories
  const cats = ['সব', ...new Set(PHC_INDICATOR_INDEX.map(i=>i.cat))];
  const catBar = cats.map(c =>
    `<button class="phc-cat-btn${phcSelectedCat===c?' on':''}"
      style="${phcSelectedCat===c?`background:${catColor(c)};color:#fff`:''}"
      onclick="phcSelectCat('${c}')">${c}</button>`
  ).join('');

  let indicators = PHC_INDICATOR_INDEX;
  if(phcSelectedCat !== 'সব') indicators = indicators.filter(i=>i.cat===phcSelectedCat);
  if(phcSearchQuery.trim()){
    const sq = phcSearchQuery.toLowerCase().trim();
    indicators = indicators.filter(i =>
      i.bn.toLowerCase().includes(sq) ||
      i.en.toLowerCase().includes(sq) ||
      i.cat.toLowerCase().includes(sq)
    );
  }

  const rows = indicators.map(ind => {
    const upzCells = PHC_UPAZILAS.map(u => {
      let val = u[ind.key];
      // Fallback logic for community series
      if (val == null) {
        if (ind.key === 'literacy_total_2022') val = u.lit_7plus_total;
        else if (ind.key === 'literacy_male_2022') val = u.lit_7plus_male;
        else if (ind.key === 'literacy_female_2022') val = u.lit_7plus_female;
        else if (ind.key === 'neet_total_pct') val = u.neet_total;
        else if (ind.key === 'internet_pct') val = u.internet_5plus_total || u.sdg_internet;
        else if (ind.key === 'electricity_grid_pct') val = u.sdg_electricity;
        else if (ind.key === 'financial_account_pct') val = u.fin_account_total;
        else if (ind.key === 'financial_account_male_pct') val = u.fin_account_male;
        else if (ind.key === 'financial_account_female_pct') val = u.fin_account_female;
        else if (ind.key.endsWith('_2022')) {
          const altKey = ind.key.replace('_2022', '');
          val = u[altKey];
        }
      }

      return `<td class="phc-td">${val==null?'—': (ind.unit==='%'||ind.unit==='বর্গ কি.মি.'||ind.unit==='প্রতি বর্গ কি.মি.'||ind.unit==='প্রতি ১০০ মহিলায় পুরুষ')? bnPct(val).replace('%','')+ind.unit.replace('%','')+'%'===ind.unit?bnPct(val):bnN(val,2)+' '+ind.unit : bnInt(val)+' '+ind.unit }</td>`;
    });
    return `<tr>
      <td class="phc-ind-name" style="border-left:3px solid ${catColor(ind.cat)}">
        <div class="phc-ind-bn">${ind.bn}</div>
        <div class="phc-ind-en">${ind.en}</div>
        <span class="phc-cat-tag" style="background:${catColor(ind.cat)}20;color:${catColor(ind.cat)}">${ind.cat}</span>
      </td>
      ${upzCells.join('')}
    </tr>`;
  }).join('');

  const upazilaHeaders = PHC_UPAZILAS.map(u =>
    `<th class="phc-upz-hdr" onclick="openPHCUpazila(${u.id})">${u.name_bn}<br><small>${u.name_en}</small></th>`
  ).join('');

  content.innerHTML = `
    <div class="phc-search-bar">
      <input id="phc-search-inp" class="phc-search-inp" placeholder="সূচক খুঁজুন... (বাংলা বা English)"
        value="${phcSearchQuery}"
        oninput="phcSearchQuery=this.value; renderPHCSearch(this.value)">
      ${phcSearchQuery ? `<button class="phc-search-clr" onclick="phcSearchQuery='';document.getElementById('phc-search-inp').value='';renderPHCSearch('')">✕</button>` : ''}
    </div>
    <div class="phc-cat-bar">${catBar}</div>
    <div class="phc-result-count">
      ${bnN(indicators.length)} টি সূচক পাওয়া গেছে — ৯টি উপজেলার ডেটা সহ
    </div>
    <div class="phc-table-wrap">
      <table class="phc-table">
        <thead>
          <tr>
            <th class="phc-ind-hdr">সূচক / Indicator</th>
            ${upazilaHeaders}
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="10" class="phc-no-result">কোনো সূচক পাওয়া যায়নি।</td></tr>'}</tbody>
      </table>
    </div>`;
}

function phcSelectCat(cat){
  phcSelectedCat = cat;
  renderPHCSearch(phcSearchQuery);
}

// helper: format value nicely
function fmtVal(val, ind){
  if(val == null) return '—';
  if(ind.unit === '%') return bnN(val,2) + '%';
  if(ind.unit === 'জন' || ind.unit === 'টি' || ind.unit === 'households') return bnInt(val);
  return bnN(val,2) + ' ' + ind.unit;
}

// ══════════════════════════════════════════════════════
// 2) UPAZILA GRID VIEW
// ══════════════════════════════════════════════════════
function renderPHCUpazilaGrid(){
  const content = document.getElementById('phc-content');
  if(!content) return;
  const cards = PHC_UPAZILAS.map(u => `
    <div class="phc-upz-card" onclick="openPHCUpazila(${u.id})">
      <div class="phc-upz-card-top">
        <div class="phc-upz-card-name">${u.name_bn}</div>
        <div class="phc-upz-card-sub">${u.name_en}</div>
      </div>
      <div class="phc-upz-kpis">
        <div class="phc-kpi"><span class="phc-kpi-val">${bnInt(u.pop_total_2022)}</span><span class="phc-kpi-lbl">জনসংখ্যা</span></div>
        <div class="phc-kpi"><span class="phc-kpi-val">${bnN(u.literacy_total_2022,1)}%</span><span class="phc-kpi-lbl">সাক্ষরতা</span></div>
        <div class="phc-kpi"><span class="phc-kpi-val">${bnN(u.internet_pct,1)}%</span><span class="phc-kpi-lbl">ইন্টারনেট</span></div>
        <div class="phc-kpi"><span class="phc-kpi-val">${bnN(u.electricity_grid_pct,1)}%</span><span class="phc-kpi-lbl">বিদ্যুৎ</span></div>
      </div>
      <div class="phc-upz-bar-row">
        ${miniBar('NEET', u.neet_total_pct, '#C62828')}
        ${miniBar('মোবাইল', u.mobile_phone_pct, '#283593')}
        ${miniBar('পাকা ঘর', u.dwelling_pucca_pct, '#6A1B9A')}
      </div>
      <div class="phc-upz-card-foot">
        <span>📐 ${bnN(u.area_sq_km,2)} বর্গ কি.মি.</span>
        <span>🏘️ ${bnN(u.unions)} ইউনিয়ন</span>
        <span class="phc-more-btn">বিস্তারিত →</span>
      </div>
    </div>`).join('');

  const districtNameBn = (PHC_DISTRICT && (PHC_DISTRICT.district_bn || PHC_DISTRICT.name_bn || PHC_DISTRICT.name || PHC_DISTRICT.district || PHC_DISTRICT.districtName)) || '—';
  content.innerHTML = `


      কক্সবাজার জেলার <strong>৯টি উপজেলার</strong> ডেটা।
      <ul>
        <li>তালিকার শুরুতে, প্রতিটি উপজেলার নাম এবং সংখ্যা দেওয়া হয়েছে।</li>
        <li>কার্ডের উপরে, লিঙ্গের অনুসারে শিক্ষার হার (এবং তাদের যোগফল), ইন্টারনেট, বিদ্যুৎ প্রভিন্স, মোবাইল ও একীকরণ বার চিত্রিত আছে।</li>
        <li>শুরুর দিকে, অন্যান্য মূল্যমান সূচকের বিভাগে এই তথ্য রয়েছে।</li>
        <li>শেষে, উপজেলার নির্ধারিত অঞ্চল (in sq. km), ইউনিয়ন এবং "বিস্তারিত →" দেওয়া হয়েছে।</li>
      </ul>
      যেকোনো কার্ডে ক্লিক করলে সম্পূর্ণ তথ্য দেখা যাবে।
    </div>
    <div class="phc-upz-grid">${cards}</div>`;
}

function miniBar(label, val, color){
  const pct = Math.min(val||0, 100);
  return `<div class="mini-bar-wrap">
    <div class="mini-bar-lbl">${label}</div>
    <div class="mini-bar-bg"><div class="mini-bar-fill" style="width:${pct}%;background:${color}"></div></div>
    <div class="mini-bar-val">${bnN(val,1)}%</div>
  </div>`;
}

// ══════════════════════════════════════════════════════
// 3) UPAZILA DETAIL SHEET
// ══════════════════════════════════════════════════════
function openPHCUpazila(id){
  phcCurrentUpazila = PHC_UPAZILAS.find(u=>u.id===id);
  if(!phcCurrentUpazila) return;
  renderPHCUpazilaDetail();
  goView('v-phc-detail');
}

function renderPHCUpazilaDetail(){
  const u = phcCurrentUpazila;
  if(!u) return;
  const host = document.getElementById('phc-detail-body');
  if(!host) return;

  // Update header
  const hName = document.getElementById('phc-detail-name');
  if(hName) hName.textContent = u.name_bn + ' উপজেলা';

  const sections = [
    {
      icon:'👥', title:'জনসংখ্যা', rows:[
        ['মোট জনসংখ্যা (২০২২)', bnInt(u.pop_total_2022)],
        ['পুরুষ', bnInt(u.pop_male_2022)],
        ['মহিলা', bnInt(u.pop_female_2022)],
        ['হিজড়া', bnN(u.pop_hijra_2022)],
        ['গ্রামীণ জনসংখ্যা', bnInt(u.pop_rural_2022)],
        ['শহর জনসংখ্যা', bnInt(u.pop_urban_2022)],
        ['মোট জনসংখ্যা (২০১১)', u.pop_total_2011 ? bnInt(u.pop_total_2011) : '—'],
        ['মোট জনসংখ্যা (২০০১)', u.pop_total_2001 ? bnInt(u.pop_total_2001) : '—'],
        ['বার্ষিক বৃদ্ধির হার', bnPct(u.growth_rate_2022)],
        ['জনসংখ্যার ঘনত্ব (প্রতি বর্গ কি.মি.)', u.pop_density_2022 ? bnN(u.pop_density_2022) : '—'],
        ['লিঙ্গানুপাত (প্রতি ১০০ মহিলায় পুরুষ)', bnN(u.sex_ratio_2022,2)],
        ['শহর জনসংখ্যার অনুপাত', bnPct(u.urban_pct_2022)],
      ]
    },
    {
      icon:'☪️', title:'ধর্ম (২০২২)', rows:[
        ['মুসলিম', bnInt(u.pop_muslim)],
        ['হিন্দু', bnInt(u.pop_hindu)],
        ['বৌদ্ধ', u.pop_buddhist ? bnInt(u.pop_buddhist) : '—'],
        ['খ্রিষ্টান', bnInt(u.pop_christian)],
        ['অন্যান্য', u.pop_others ? bnInt(u.pop_others) : '—'],
      ]
    },
    {
      icon:'📚', title:'শিক্ষা ও সাক্ষরতা', rows:[
        ['সাক্ষরতার হার (মোট)', bnPct(u.literacy_total_2022)],
        ['সাক্ষরতার হার (পুরুষ)', bnPct(u.literacy_male_2022)],
        ['সাক্ষরতার হার (মহিলা)', bnPct(u.literacy_female_2022)],
        ['গ্রামীণ সাক্ষরতার হার', bnPct(u.literacy_rural_2022)],
        ['শহর সাক্ষরতার হার', u.literacy_urban_2022 ? bnPct(u.literacy_urban_2022) : '—'],
        ['সাক্ষরতার হার ২০১১', u.literacy_2011 ? bnPct(u.literacy_2011) : '—'],
        ['সাক্ষরতার হার ২০০১', u.literacy_2001 ? bnPct(u.literacy_2001) : '—'],
      ]
    },
    {
      icon:'🏠', title:'খানা ও বাসগৃহ', rows:[
        ['মোট খানা', bnInt(u.hh_total_2022)],
        ['গ্রামীণ খানা', bnInt(u.hh_rural_2022)],
        ['শহর খানা', bnInt(u.hh_urban_2022)],
        ['সাধারণ খানা', bnInt(u.hh_general_2022)],
        ['প্রাতিষ্ঠানিক খানা', bnInt(u.hh_institutional_2022)],
        ['বাসগৃহের সংখ্যা', bnInt(u.dwelling_units_2022)],
        ['গড় খানার আকার', bnN(u.hh_size_2022,2)],
        ['গ্রামীণ গড় খানার আকার', bnN(u.hh_size_rural_2022,2)],
        ['শহর গড় খানার আকার', u.hh_size_urban_2022 ? bnN(u.hh_size_urban_2022,2) : '—'],
        ['গড় খানার আকার ২০১১', u.hh_size_2011 ? bnN(u.hh_size_2011,2) : '—'],
      ]
    },
    {
      icon:'🏗️', title:'বাসগৃহের ধরন ও মালিকানা', rows:[
        ['পাকা বাসগৃহ', bnPct(u.dwelling_pucca_pct)],
        ['সেমি-পাকা বাসগৃহ', bnPct(u.dwelling_semipucca_pct)],
        ['কাঁচা বাসগৃহ', bnPct(u.dwelling_kancha_pct)],
        ['ঝুপড়ি বাসগৃহ', bnPct(u.dwelling_jhupri_pct)],
        ['নিজস্ব বাসগৃহ', bnPct(u.own_dwelling_pct)],
        ['ভাড়া (নিজস্ব নেই)', bnPct(u.rented_no_own_pct)],
        ['বিনা ভাড়া (নিজস্ব নেই)', bnPct(u.rentfree_no_own_pct)],
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
        ['জাতীয় গ্রিড বিদ্যুৎ', bnPct(u.electricity_grid_pct)],
        ['সোলার বিদ্যুৎ', bnPct(u.electricity_solar_pct)],
        ['অন্যান্য বিদ্যুৎ', bnPct(u.electricity_others_pct)],
        ['বিদ্যুৎ নেই', bnPct(u.electricity_none_pct)],
      ]
    },
    {
      icon:'📱', title:'প্রযুক্তি ও সংযোগ (নতুন সূচক)', rows:[
        ['মোবাইল ফোন ব্যবহারকারী (মোট)', bnPct(u.mobile_phone_pct)],
        ['মোবাইল ফোন (পুরুষ)', bnPct(u.mobile_phone_male_pct)],
        ['মোবাইল ফোন (মহিলা)', bnPct(u.mobile_phone_female_pct)],
        ['মোবাইল ফোন (গ্রামীণ)', bnPct(u.mobile_phone_rural_pct)],
        ['মোবাইল ফোন (শহর)', u.mobile_phone_urban_pct ? bnPct(u.mobile_phone_urban_pct) : '—'],
        ['ইন্টারনেট ব্যবহারকারী (মোট)', bnPct(u.internet_pct)],
        ['ইন্টারনেট (পুরুষ)', bnPct(u.internet_male_pct)],
        ['ইন্টারনেট (মহিলা)', bnPct(u.internet_female_pct)],
        ['ইন্টারনেট (গ্রামীণ)', bnPct(u.internet_rural_pct)],
        ['ইন্টারনেট (শহর)', u.internet_urban_pct ? bnPct(u.internet_urban_pct) : '—'],
      ]
    },
    {
      icon:'💳', title:'আর্থিক অন্তর্ভুক্তি (নতুন সূচক)', rows:[
        ['আর্থিক অ্যাকাউন্টধারী (মোট)', bnPct(u.financial_account_pct)],
        ['আর্থিক অ্যাকাউন্ট (পুরুষ)', bnPct(u.financial_account_male_pct)],
        ['আর্থিক অ্যাকাউন্ট (মহিলা)', bnPct(u.financial_account_female_pct)],
        ['মোবাইল ব্যাংকিং (মোট)', bnPct(u.mobile_banking_pct)],
        ['মোবাইল ব্যাংকিং (পুরুষ)', bnPct(u.mobile_banking_male_pct)],
        ['মোবাইল ব্যাংকিং (মহিলা)', bnPct(u.mobile_banking_female_pct)],
      ]
    },
    {
      icon:'🎯', title:'NEET (শিক্ষা ও কর্মহীন যুব, নতুন সূচক)', rows:[
        ['NEET যুব জনগোষ্ঠী (মোট)', bnPct(u.neet_total_pct)],
        ['NEET (পুরুষ)', bnPct(u.neet_male_pct)],
        ['NEET (মহিলা)', bnPct(u.neet_female_pct)],
        ['NEET (গ্রামীণ)', bnPct(u.neet_rural_pct)],
        ['NEET (শহর)', u.neet_urban_pct ? bnPct(u.neet_urban_pct) : '—'],
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
        ['SDG 17.8.1 — ইন্টারনেট ব্যবহারকারী', bnPct(u.sdg_internet)],
      ]
    },
  ];

  // Note for Eidgaon
  const noteHtml = u.note ? `<div class="phc-detail-note">ℹ️ ${u.note}</div>` : '';

  // Admin summary
  const adminHtml = `
    <div class="phc-detail-admin">
      <div class="phc-admin-chip">📐 ${bnN(u.area_sq_km,2)} বর্গ কি.মি.</div>
      <div class="phc-admin-chip">🏛️ ${bnN(u.unions)} ইউনিয়ন</div>
      <div class="phc-admin-chip">🏘️ ${bnN(u.villages)} গ্রাম</div>
      ${u.mahalla ? `<div class="phc-admin-chip">🏙️ ${bnN(u.mahalla)} মহল্লা</div>` : ''}
      <div class="phc-admin-chip">🆔 কোড: ${u.code}</div>
    </div>`;

  const sectionsHtml = sections.map(sec => `
    <div class="phc-detail-section">
      <div class="phc-sec-title">${sec.icon} ${sec.title}</div>
      <table class="phc-detail-tbl">
        ${sec.rows.map(([label,val]) => `
          <tr>
            <td class="phc-dt-label">${label}</td>
            <td class="phc-dt-val">${val}</td>
          </tr>`).join('')}
      </table>
    </div>`).join('');

  host.innerHTML = noteHtml + adminHtml + sectionsHtml;
}

// ══════════════════════════════════════════════════════
// 4) COMPARE VIEW
// ══════════════════════════════════════════════════════
function renderPHCCompare(){
  const content = document.getElementById('phc-content');
  if(!content) return;

  const indOpts = PHC_INDICATOR_INDEX.map(i =>
    `<option value="${i.key}" ${i.key===phcCompareIndicator?'selected':''}>${i.bn} — ${i.en}</option>`
  ).join('');

  const upzChecks = PHC_UPAZILAS.map(u => `
    <label class="phc-chk-lbl">
      <input type="checkbox" class="phc-chk" value="${u.id}"
        ${phcCompareList.includes(u.id)?'checked':''}
        onchange="phcToggleCompare(${u.id})">
      ${u.name_bn}
    </label>`).join('');

  // Build chart data
  const ind = PHC_INDICATOR_INDEX.find(i=>i.key===phcCompareIndicator) || PHC_INDICATOR_INDEX[0];
  const activeUpz = phcCompareList.length > 0
    ? PHC_UPAZILAS.filter(u=>phcCompareList.includes(u.id))
    : PHC_UPAZILAS;

  const processedBars = activeUpz.map(u => {
    let val = u[ind.key];
    // Fallback logic for community series
    if (val == null) {
      if (ind.key === 'literacy_total_2022') val = u.lit_7plus_total;
      else if (ind.key === 'literacy_male_2022') val = u.lit_7plus_male;
      else if (ind.key === 'literacy_female_2022') val = u.lit_7plus_female;
      else if (ind.key === 'neet_total_pct') val = u.neet_total;
      else if (ind.key === 'internet_pct') val = u.internet_5plus_total || u.sdg_internet;
      else if (ind.key === 'electricity_grid_pct') val = u.sdg_electricity;
      else if (ind.key === 'financial_account_pct') val = u.fin_account_total;
      else if (ind.key === 'financial_account_male_pct') val = u.fin_account_male;
      else if (ind.key === 'financial_account_female_pct') val = u.fin_account_female;
      else if (ind.key.endsWith('_2022')) {
        const altKey = ind.key.replace('_2022', '');
        val = u[altKey];
      }
    }
    return { u, val: val || 0 };
  });

  const maxVal = Math.max(...processedBars.map(item => item.val));
  const bars = processedBars.map(item => {
    const { u, val } = item;
    const pct = maxVal > 0 ? (val||0)/maxVal*100 : 0;
    const fv = ind.unit==='%' ? bnPct(val) : ind.unit==='জন'||ind.unit==='টি' ? bnInt(val) : bnN(val,2)+' '+ind.unit;
    return `
      <div class="phc-bar-row">
        <div class="phc-bar-label">${u.name_bn}</div>
        <div class="phc-bar-track">
          <div class="phc-bar-fill" style="width:${pct}%;background:${catColor(ind.cat)}">
          </div>
          <span class="phc-bar-val">${fv}</span>
        </div>
      </div>`;
  }).join('');

  content.innerHTML = `
    <div class="phc-cmp-controls">
      <div class="phc-cmp-label">সূচক বেছে নিন:</div>
      <select class="phc-cmp-sel" onchange="phcCompareIndicator=this.value; renderPHCCompare()">
        ${indOpts}
      </select>
      <div class="phc-cmp-label" style="margin-top:10px">উপজেলা বেছে নিন (না বাছলে সব দেখাবে):</div>
      <div class="phc-chk-grid">${upzChecks}</div>
      ${phcCompareList.length ? `<button class="phc-clr-btn" onclick="phcCompareList=[];renderPHCCompare()">✕ সব বাতিল</button>` : ''}
    </div>
    <div class="phc-cmp-chart">
      <div class="phc-cmp-chart-title">${ind.bn}<br><small>${ind.en}</small></div>
      ${bars}
    </div>`;
}

function phcToggleCompare(id){
  if(phcCompareList.includes(id))
    phcCompareList = phcCompareList.filter(x=>x!==id);
  else
    phcCompareList.push(id);
  renderPHCCompare();
}

// ══════════════════════════════════════════════════════
// 5) DISTRICT OVERVIEW
// ══════════════════════════════════════════════════════
function renderPHCDistrict(){
  const content = document.getElementById('phc-content');
  if(!content) return;
  // Prefer community-series district object if available
  const d = (typeof PHC_DISTRICT_COMM !== 'undefined' && PHC_DISTRICT_COMM) ? PHC_DISTRICT_COMM : PHC_DISTRICT;


  const sections = [
    {
      icon:'👥', title:'জেলার সামগ্রিক জনসংখ্যা', rows:[
        ['মোট জনসংখ্যা (২০২২)', bnInt(d.pop_total_2022)],
        ['পুরুষ', bnInt(d.pop_male_2022)],
        ['মহিলা', bnInt(d.pop_female_2022)],
        ['হিজড়া', bnN(d.pop_hijra_2022)],
        ['গ্রামীণ', bnInt(d.pop_rural_2022)],
        ['শহর', bnInt(d.pop_urban_2022)],
        ['মোট জনসংখ্যা (২০১১)', bnInt(d.pop_total_2011)],
        ['বার্ষিক বৃদ্ধির হার', bnPct(d.growth_rate_2022)],
        ['জনসংখ্যার ঘনত্ব', bnN(d.pop_density_2022) + ' (প্রতি বর্গ কি.মি.)'],
        ['লিঙ্গানুপাত', bnN(d.sex_ratio_2022,2)],
        ['শহর জনসংখ্যার অনুপাত', bnPct(d.urban_pct_2022)],
        ['আয়তন', bnN(d.area_sq_km,2) + ' বর্গ কি.মি.'],
      ]
    },
    {
      icon:'☪️', title:'ধর্ম অনুযায়ী জনসংখ্যা', rows:[
        ['মুসলিম', bnInt(d.pop_muslim)],
        ['হিন্দু', bnInt(d.pop_hindu)],
        ['বৌদ্ধ', bnInt(d.pop_buddhist)],
        ['খ্রিষ্টান', bnInt(d.pop_christian)],
        ['অন্যান্য', bnInt(d.pop_others)],
      ]
    },
    {
      icon:'📚', title:'সাক্ষরতা', rows:[
        ['সাক্ষরতার হার (মোট)', bnPct(d.literacy_total_2022)],
        ['সাক্ষরতার হার (পুরুষ)', bnPct(d.literacy_male_2022)],
        ['সাক্ষরতার হার (মহিলা)', bnPct(d.literacy_female_2022)],
        ['গ্রামীণ সাক্ষরতার হার', bnPct(d.literacy_rural_2022)],
        ['শহর সাক্ষরতার হার', bnPct(d.literacy_urban_2022)],
        ['সাক্ষরতার হার ২০১১', bnPct(d.literacy_2011)],
      ]
    },
    {
      icon:'🏠', title:'খানা ও বাসগৃহ', rows:[
        ['মোট খানা', bnInt(d.hh_total_2022)],
        ['গ্রামীণ খানা', bnInt(d.hh_rural_2022)],
        ['শহর খানা', bnInt(d.hh_urban_2022)],
        ['সাধারণ খানা', bnInt(d.hh_general_2022)],
        ['প্রাতিষ্ঠানিক খানা', bnInt(d.hh_institutional_2022)],
        ['বাসগৃহের সংখ্যা', bnInt(d.dwelling_units_2022)],
        ['গড় খানার আকার', bnN(d.hh_size_2022,2)],
        ['গড় খানার আকার ২০১১', bnN(d.hh_size_2011,2)],
      ]
    },
    {
      icon:'🏗️', title:'বাসগৃহের ধরন', rows:[
        ['পাকা বাসগৃহ', bnPct(d.dwelling_pucca_pct)],
        ['সেমি-পাকা', bnPct(d.dwelling_semipucca_pct)],
        ['কাঁচা', bnPct(d.dwelling_kancha_pct)],
        ['ঝুপড়ি', bnPct(d.dwelling_jhupri_pct)],
        ['নিজস্ব বাসগৃহ', bnPct(d.own_dwelling_pct)],
      ]
    },
    {
      icon:'💧', title:'পানি ও স্যানিটেশন', rows:[
        ['নলকূপ পানির উৎস', bnPct(d.water_tubewell_pct)],
        ['ট্যাপ/পাইপ পানির উৎস', bnPct(d.water_tap_pct)],
        ['নিরাপদ টয়লেট (ফ্লাশ)', bnPct(d.toilet_safe_flush_pct)],
        ['স্ল্যাব সহ পিট ল্যাট্রিন', bnPct(d.toilet_pit_slab_pct)],
        ['অনিরাপদ টয়লেট', bnPct(d.toilet_unsafe_pct)],
        ['খোলা মলত্যাগ', bnPct(d.toilet_open_defecation_pct)],
      ]
    },
    {
      icon:'⚡', title:'বিদ্যুৎ', rows:[
        ['জাতীয় গ্রিড বিদ্যুৎ', bnPct(d.electricity_grid_pct)],
        ['সোলার বিদ্যুৎ', bnPct(d.electricity_solar_pct)],
        ['বিদ্যুৎ নেই', bnPct(d.electricity_none_pct)],
        ['বিদ্যুৎ নেই ২০১১', bnPct(d.electricity_none_pct_2011)],
      ]
    },
    {
      icon:'📱', title:'প্রযুক্তি, আর্থিক অন্তর্ভুক্তি ও NEET', rows:[
        ['মোবাইল ফোন ব্যবহারকারী', bnPct(d.mobile_phone_pct)],
        ['মোবাইল ফোন (পুরুষ)', bnPct(d.mobile_phone_male_pct)],
        ['মোবাইল ফোন (মহিলা)', bnPct(d.mobile_phone_female_pct)],
        ['ইন্টারনেট ব্যবহারকারী', bnPct(d.internet_pct)],
        ['ইন্টারনেট (পুরুষ)', bnPct(d.internet_male_pct)],
        ['ইন্টারনেট (মহিলা)', bnPct(d.internet_female_pct)],
        ['আর্থিক অ্যাকাউন্টধারী', bnPct(d.financial_account_pct)],
        ['মোবাইল ব্যাংকিং', bnPct(d.mobile_banking_pct)],
        ['NEET যুব জনগোষ্ঠী (মোট)', bnPct(d.neet_total_pct)],
        ['NEET (পুরুষ)', bnPct(d.neet_male_pct)],
        ['NEET (মহিলা)', bnPct(d.neet_female_pct)],
      ]
    },
    {
      icon:'🏛️', title:'প্রশাসনিক একক', rows:[
        ['উপজেলার সংখ্যা', bnN(d.upazila_count)],
        ['পৌরসভার সংখ্যা', bnN(d.paurashava_count)],
        ['ইউনিয়নের সংখ্যা', bnN(d.union_count)],
        ['গ্রামের সংখ্যা', bnN(d.village_count)],
      ]
    },
  ];

  const sectionsHtml = sections.map(sec => `
    <div class="phc-detail-section">
      <div class="phc-sec-title">${sec.icon} ${sec.title}</div>
      <table class="phc-detail-tbl">
        ${sec.rows.map(([label,val]) => `
          <tr>
            <td class="phc-dt-label">${label}</td>
            <td class="phc-dt-val">${val}</td>
          </tr>`).join('')}
      </table>
    </div>`).join('');

  content.innerHTML = `
    <div class="phc-district-banner">
      <div class="phc-dist-name">${PHC_DISTRICT && (PHC_DISTRICT.district_bn || PHC_DISTRICT.name_bn || PHC_DISTRICT.name || PHC_DISTRICT.district || PHC_DISTRICT.districtName) ? (PHC_DISTRICT.district_bn || PHC_DISTRICT.name_bn || PHC_DISTRICT.name || PHC_DISTRICT.district || PHC_DISTRICT.districtName) : '—'} জেলা</div>
      <div class="phc-dist-sub">জনশুমারি ও গৃহগণনা ২০২২ — সামগ্রিক তথ্য</div>
      <div class="phc-dist-kpis">
        <div class="phc-dist-kpi"><div class="phc-dist-kpi-val">${bnInt(d.pop_total_2022)}</div><div class="phc-dist-kpi-lbl">মোট জনসংখ্যা</div></div>
        <div class="phc-dist-kpi"><div class="phc-dist-kpi-val">${bnN(d.literacy_total_2022,1)}%</div><div class="phc-dist-kpi-lbl">সাক্ষরতা</div></div>
        <div class="phc-dist-kpi"><div class="phc-dist-kpi-val">${bnN(d.internet_pct,1)}%</div><div class="phc-dist-kpi-lbl">ইন্টারনেট</div></div>
        <div class="phc-dist-kpi"><div class="phc-dist-kpi-val">${bnN(d.electricity_grid_pct,1)}%</div><div class="phc-dist-kpi-lbl">গ্রিড বিদ্যুৎ</div></div>
      </div>
    </div>
    ${sectionsHtml}`;
}
