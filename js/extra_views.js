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
   2) প্রশিক্ষণ ক্যালেন্ডার — training schedule
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
    else if(id==='v-app-gallery') renderAppGallery();
    else if(id==='v-training') renderTrainings();
  };
})();
