/* ═══════════════════════════════════════════════
   ADDITIONAL VIEWS — Archive / Circulars / Training
   ═══════════════════════════════════════════════ */

const BN_DIGITS_X = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
function bnNumX(n){return String(n).split('').map(c=>/\d/.test(c)?BN_DIGITS_X[+c]:c).join('');}
function bnToEn(s){
  if(s==null) return s;
  return String(s).replace(/[০-৯]/g, d => BN_DIGITS_X.indexOf(d));
}
const BN_MONTHS_X = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];

/* ─────────────────────────────────────────────
   1) প্রতিবেদন আর্কাইভ — submitted reports history
   ───────────────────────────────────────────── */
const BBS_PUBLISHED_REPORTS_URL = 'https://bbs.gov.bd/pages/static-pages/6922e07a933eb65569e27407';

function openBbsPublishedReports() {
  const ref = window.open(BBS_PUBLISHED_REPORTS_URL, '_blank', 'noopener,noreferrer');
  if (!ref) window.location.href = BBS_PUBLISHED_REPORTS_URL;
}

function renderArchive(){
  const host = document.getElementById('arch-list');
  const stats = document.getElementById('arch-stats');
  const monthSel = document.getElementById('arch-month-sel');
  const yearSel = document.getElementById('arch-year-sel');
  if(!host) return;

  // Read submitted (done) crop items from localStorage
  let doneMap = {};
  try{ doneMap = JSON.parse(localStorage.getItem('bbs_crop_done_v1')||'{}'); }catch(e){}

  // Build archive entries based on what user has marked done
  const mode = (typeof cropCurrentMode !== 'undefined') ? cropCurrentMode : 'u2d';
  const data = (typeof BBS_CROP_DATA !== 'undefined') ? (BBS_CROP_DATA[mode]||[]) : [];
  const items = [];
  data.forEach((it,idx)=>{
    const key = `${mode}|${idx}|${it.month}|${it.day}`;
    const done = !!doneMap[key];
    if(done){
      const ts = (typeof doneMap[key+'@ts'] !== 'undefined') ? doneMap[key+'@ts'] : null;
      items.push({
        report_name: it.report_name,
        day: it.day, month: it.month,
        submittedAt: ts || `${(new Date()).getFullYear()}-${String(it.month).padStart(2,'0')}-${String(it.day).padStart(2,'0')}`,
      });
    }
  });

  // Populate filter dropdowns once
  if(monthSel && monthSel.options.length<=1){
    BN_MONTHS_X.forEach((m,i)=>{
      const o=document.createElement('option'); o.value=String(i+1); o.textContent=m; monthSel.appendChild(o);
    });
  }
  if(yearSel && yearSel.options.length<=1){
    const yrs = new Set(items.map(it=> new Date(it.submittedAt).getFullYear()));
    yrs.add(new Date().getFullYear());
    Array.from(yrs).sort((a,b)=>b-a).forEach(y=>{
      const o=document.createElement('option'); o.value=String(y); o.textContent=bnNumX(y); yearSel.appendChild(o);
    });
  }

  const fMonth = monthSel ? monthSel.value : 'all';
  const fYear = yearSel ? yearSel.value : 'all';
  const filtered = items.filter(it=>{
    const d = new Date(it.submittedAt);
    if(fMonth!=='all' && it.month !== Number(fMonth)) return false;
    if(fYear!=='all' && d.getFullYear() !== Number(fYear)) return false;
    return true;
  });

  // Stats
  const total = items.length;
  const thisMonth = items.filter(it=>{
    const d=new Date(it.submittedAt); const n=new Date();
    return d.getMonth()===n.getMonth() && d.getFullYear()===n.getFullYear();
  }).length;
  const thisYear = items.filter(it=>{
    const d=new Date(it.submittedAt); return d.getFullYear()===new Date().getFullYear();
  }).length;
  if(stats){
    stats.innerHTML = `
      <div class="xv-stat"><div class="xv-stat-num">${bnNumX(total)}</div><div class="xv-stat-lbl">মোট দাখিল</div></div>
      <div class="xv-stat"><div class="xv-stat-num">${bnNumX(thisMonth)}</div><div class="xv-stat-lbl">এই মাসে</div></div>
      <div class="xv-stat"><div class="xv-stat-num">${bnNumX(thisYear)}</div><div class="xv-stat-lbl">এই বছরে</div></div>`;
  }

  if(!filtered.length){
    host.innerHTML = `<div class="xv-empty"><div class="xv-empty-ico">📭</div>কোনো দাখিলকৃত প্রতিবেদন এখনো নেই।<br><small>ক্রপ ক্যালেন্ডার থেকে প্রতিবেদন দাখিল করার পর এখানে দেখাবে।</small></div>`;
    return;
  }

  filtered.sort((a,b)=> new Date(b.submittedAt) - new Date(a.submittedAt));
  host.innerHTML = filtered.map(it=>{
    const d = new Date(it.submittedAt);
    const dateLabel = `${bnNumX(d.getDate())} ${BN_MONTHS_X[d.getMonth()]} ${bnNumX(d.getFullYear())}`;
    return `
      <div class="arch-card">
        <div class="arch-ico">📄</div>
        <div class="arch-info">
          <div class="arch-name">${it.report_name}</div>
          <div class="arch-meta">দাখিল: ${dateLabel}</div>
        </div>
        <div class="arch-pill">✓ দাখিল</div>
      </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   2) পরিপত্র ও নোটিশ — circulars & notices
   ───────────────────────────────────────────── */
const BBS_CIRCULARS = [
  {no:'৫১.০১.০০০০.৪১১.৪২.০০৪.২৪-১২৩', type:'circular', title:'কৃষি শুমারি ২০২৫ এর মাঠ পর্যায়ের তথ্য সংগ্রহ সংক্রান্ত নির্দেশনা', summary:'আগামী ১৫ মে হতে কৃষি শুমারি ২০২৫ এর মাঠ পর্যায়ের তথ্য সংগ্রহ শুরু হবে। সকল উপজেলা পরিসংখ্যান কর্মকর্তাকে নির্দেশনা অনুসরণ করতে অনুরোধ করা হলো।', date:'২০২৬-০৪-২২'},
  {no:'৫১.০১.০০০০.৪১১.১২.০০৩.২৪-২৪০', type:'notice', title:'মাসিক প্রতিবেদন প্রেরণে বিলম্ব রোধ সংক্রান্ত', summary:'অনেক জেলা/উপজেলা হতে নির্ধারিত সময়ের মধ্যে মাসিক প্রতিবেদন প্রেরণ না করায় কেন্দ্রীয় ডেটাবেইজ আপডেটে বিঘ্ন ঘটছে। সংশ্লিষ্ট সকলকে সময়ানুবর্তিতার বিষয়ে সচেতন থাকতে অনুরোধ করা হলো।', date:'২০২৬-০৪-১৮'},
  {no:'৫১.০১.০০০০.০০২.১১.০০৭.২৪-০৮৯', type:'order', title:'বদলি/পদায়ন সংক্রান্ত আদেশ', summary:'৩৭ জন পরিসংখ্যান কর্মকর্তা/সহকারী কর্মকর্তাকে নতুন কর্মস্থলে বদলি/পদায়ন করা হলো। বিস্তারিত আদেশ সংযুক্ত পিডিএফ ফাইলে দেখুন।', date:'২০২৬-০৪-১৫'},
  {no:'৫১.০১.০০০০.৪১১.৩৫.০০২.২৪-১৭৬', type:'circular', title:'কৃষি বিভাগের জন্য বরাদ্দকৃত ট্যাবলেট ব্যবহার সংক্রান্ত', summary:'মাঠ পর্যায়ের তথ্য সংগ্রহের জন্য বরাদ্দকৃত ট্যাবলেট প্রতিটি জেলার আইসিটি কর্মকর্তার মাধ্যমে যথাযথভাবে কনফিগার করতে হবে। CAPI অ্যাপ ইনস্টল ও সিনক্রোনাইজেশন বাধ্যতামূলক।', date:'২০২৬-০৪-১০'},
  {no:'৫১.০১.০০০০.৪১১.০৭.০০১.২৪-২৫১', type:'notice', title:'বার্ষিক ছুটির হিসাব দাখিল', summary:'২০২৫ সালের বার্ষিক ছুটির ব্যালেন্স ও ভোগকৃত ছুটির হিসাব আগামী ৩০ এপ্রিলের মধ্যে নিজ নিজ জেলা পরিসংখ্যান কর্মকর্তার নিকট দাখিলের জন্য বলা হলো।', date:'২০২৬-০৪-০৫'},
  {no:'৫১.০১.০০০০.০২২.০৬.০০৪.২৪-০৬২', type:'circular', title:'আর্থিক বছর ২০২৬-২৭ এর বাজেট প্রস্তাবনা', summary:'আগামী অর্থবছরের জন্য জেলাভিত্তিক বাজেট প্রস্তাবনা প্রস্তুত করে ১০ মে এর মধ্যে সদর দপ্তরে প্রেরণ করতে হবে।', date:'২০২৬-০৩-২৮'},
  {no:'৫১.০১.০০০০.৪১১.৪৪.০০১.২৪-০৩৪', type:'notice', title:'BBS-App ব্যবহার বাধ্যতামূলক', summary:'আগামী ১লা জুন ২০২৬ হতে সকল মাঠ পর্যায়ের কর্মকর্তা/কর্মচারীগণকে দাপ্তরিক যোগাযোগ ও প্রতিবেদন প্রেরণের জন্য BBS-App ব্যবহার করতে হবে।', date:'২০২৬-০৩-২০'},
];
let _circFilter = 'all';
function filterCirc(t, btn){
  _circFilter = t;
  document.querySelectorAll('#circ-tabs .xv-tab').forEach(b=>b.classList.remove('on'));
  if(btn) btn.classList.add('on');
  renderCirculars();
}
function renderCirculars(){
  const host = document.getElementById('circ-list');
  if(!host) return;
  let list = BBS_CIRCULARS.slice();
  if(_circFilter !== 'all') list = list.filter(c=>c.type===_circFilter);
  list.sort((a,b)=> bnToEn(b.date).localeCompare(bnToEn(a.date)));
  if(!list.length){
    host.innerHTML = `<div class="xv-empty"><div class="xv-empty-ico">📭</div>কোনো ${_circFilter==='all'?'পরিপত্র/নোটিশ':({circular:'পরিপত্র',notice:'নোটিশ',order:'আদেশ'})[_circFilter]} নেই।</div>`;
    return;
  }
  host.innerHTML = list.map(c=>{
    const tagLbl = ({circular:'পরিপত্র',notice:'নোটিশ',order:'আদেশ'})[c.type] || c.type;
    const d = new Date(bnToEn(c.date));
    const ds = `${bnNumX(d.getDate())} ${BN_MONTHS_X[d.getMonth()]} ${bnNumX(d.getFullYear())}`;
    return `
      <div class="circ-card">
        <div class="circ-top">
          <span class="circ-tag circ-tag-${c.type}">${tagLbl}</span>
          <span class="circ-no">${c.no}</span>
        </div>
        <div class="circ-title">${c.title}</div>
        <div class="circ-summary">${c.summary}</div>
        <div class="circ-foot">
          <span class="circ-date">📅 ${ds}</span>
          <a class="circ-link" href="javascript:void(0)" onclick="toast('পিডিএফ ডাউনলোড — শীঘ্রই আসছে','warn')">বিস্তারিত →</a>
        </div>
      </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   3) প্রশিক্ষণ ক্যালেন্ডার — training schedule
   ───────────────────────────────────────────── */
const BBS_TRAININGS = [
  {title:'CAPI ট্যাবলেট ব্যবহার ও তথ্য সংগ্রহের কৌশল', date:'2026-05-08', loc:'বিবিএস সদর দপ্তর, ঢাকা', trainer:'মো. শাহরিয়ার আলম', dur:'২ দিন'},
  {title:'কৃষি শুমারি ২০২৫ — মাঠ পর্যায়ের প্রশিক্ষক প্রশিক্ষণ (ToT)', date:'2026-05-12', loc:'বিভাগীয় পরিসংখ্যান অফিস, রংপুর', trainer:'ড. সালেহা বেগম', dur:'৫ দিন'},
  {title:'GIS ভিত্তিক পরিসংখ্যান উপস্থাপন', date:'2026-05-20', loc:'অনলাইন (Zoom)', trainer:'ইঞ্জি. রাশেদুল করিম', dur:'৩ দিন'},
  {title:'মাসিক সমন্বয় সভা — এপ্রিল ২০২৬', date:'2026-04-30', loc:'জেলা পরিসংখ্যান অফিস (নিজ নিজ)', trainer:'জেলা পরিসংখ্যান কর্মকর্তা', dur:'১ দিন'},
  {title:'নতুন কর্মকর্তা ওরিয়েন্টেশন — ২০২৬ ব্যাচ', date:'2026-06-05', loc:'বিবিএস ট্রেনিং একাডেমি, পরিসংখ্যান ভবন', trainer:'প্রশিক্ষণ অনুবিভাগ', dur:'১৫ দিন'},
  {title:'আইসিটি দক্ষতা উন্নয়ন কর্মশালা', date:'2026-03-25', loc:'বিভাগীয় পরিসংখ্যান অফিস, চট্টগ্রাম', trainer:'মো. আবু সাঈদ', dur:'৩ দিন'},
  {title:'সাংবাদিকতা ও তথ্য প্রকাশ কৌশল', date:'2026-02-18', loc:'বিবিএস সদর দপ্তর, ঢাকা', trainer:'প্রকাশনা শাখা', dur:'২ দিন'},
];
let _trainFilter = 'upcoming';
function filterTrain(t, btn){
  _trainFilter = t;
  document.querySelectorAll('#train-tabs .xv-tab').forEach(b=>b.classList.remove('on'));
  if(btn) btn.classList.add('on');
  renderTrainings();
}
function renderTrainings(){
  const host = document.getElementById('train-list');
  if(!host) return;
  const today = new Date(); today.setHours(0,0,0,0);
  let list = BBS_TRAININGS.slice();
  if(_trainFilter==='upcoming') list = list.filter(t=> new Date(t.date) >= today);
  else if(_trainFilter==='past') list = list.filter(t=> new Date(t.date) < today);
  list.sort((a,b)=> _trainFilter==='past' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));

  if(!list.length){
    host.innerHTML = `<div class="xv-empty"><div class="xv-empty-ico">🗓️</div>কোনো ${_trainFilter==='upcoming'?'আসন্ন':_trainFilter==='past'?'সম্পন্ন':''} প্রশিক্ষণ নেই।</div>`;
    return;
  }
  host.innerHTML = list.map(t=>{
    const d = new Date(t.date);
    const diff = Math.round((d - today)/(1000*60*60*24));
    const isPast = diff < 0;
    const isSoon = diff >= 0 && diff <= 7;
    return `
      <div class="train-card">
        <div class="train-date">
          <div class="train-day">${bnNumX(d.getDate())}</div>
          <div class="train-mon">${BN_MONTHS_X[d.getMonth()].slice(0,3)}</div>
          <div class="train-yr">${bnNumX(d.getFullYear())}</div>
        </div>
        <div class="train-body">
          <div class="train-title">${t.title}</div>
          <div class="train-meta">
            <div><b>স্থান:</b> ${t.loc}</div>
            <div><b>প্রশিক্ষক:</b> ${t.trainer}</div>
          </div>
          <div class="train-tags">
            <span class="train-tag train-tag-hour">⏱ ${t.dur}</span>
            ${isPast ? `<span class="train-tag train-tag-done">✓ সম্পন্ন</span>` : (isSoon ? `<span class="train-tag train-tag-soon">⚡ ${bnNumX(diff)} দিন বাকি</span>` : `<span class="train-tag train-tag-loc">📅 আসন্ন</span>`)}
          </div>
        </div>
      </div>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   Hook into goView so list renders when view opens
   ───────────────────────────────────────────── */
(function(){
  const orig = window.goView;
  window.goView = function(id){
    if(typeof orig==='function') orig.apply(this, arguments);
    if(id==='v-archive') renderArchive();
    else if(id==='v-circulars') renderCirculars();
    else if(id==='v-training') renderTrainings();
  };
})();
