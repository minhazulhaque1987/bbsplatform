/* ═══════════ STATISTICS RENDER ═══════════ */
const BBS_STATS_URL = 'https://bbs.gov.bd/pages/notices';
const BBS_STATS_ITEMS = [
  { id: 'CENSUS-2022', name: 'জনশুমারি ও গৃহগণনা ২০২২', icon: '👥', source: 'বিবিএস', note: 'জাতীয় পর্যায়ের জনগণনা তথ্য', year: '২০২২' },
  { id: 'HIES-2022', name: 'খানা আয়-ব্যয় জরিপ ২০২২', icon: '🏠', source: 'বিবিএস', note: 'গৃহস্থালি আয়-ব্যয় ও জীবনমান তথ্য', year: '২০২২' },
  { id: 'AGRI-2023', name: 'কৃষি শুমারি ২০২৩', icon: '🌾', source: 'বিবিএস', note: 'কৃষি খাতের কাঠামোগত তথ্য', year: '২০২৩' },
  { id: 'ECON-2024', name: 'অর্থনৈতিক শুমারি ২০২৪', icon: '📊', source: 'বিবিএস', note: 'প্রতিষ্ঠানভিত্তিক অর্থনৈতিক উপাত্ত', year: '২০২৪' }
];

function openBbsStatistics() {
  const ref = window.open(BBS_STATS_URL, '_blank', 'noopener,noreferrer');
  if (!ref) window.location.href = BBS_STATS_URL;
}

function renderDashStatistics() {
  const c = document.getElementById('dash-survey-cards');
  if (!c) return;
  c.innerHTML = BBS_STATS_ITEMS.slice(0, 2).map(item => `
    <div class="sv-mini" onclick="goView('v-statistics')">
      <div class="sv-mini-ico" style="background:#E3F2FD">${item.icon}</div>
      <div class="sv-mini-info">
        <div class="sv-mini-title">${item.name}</div>
        <div class="sv-mini-meta">${item.id} · ${item.year}</div>
        <div class="sv-mini-prog"><div class="sv-mini-fill" style="width:${item.year === '২০২৪' ? 82 : item.year === '২০২৩' ? 68 : 91}%"></div></div>
      </div>
      <div class="sv-mini-pct">${item.year}</div>
    </div>`).join('');
}

function renderAllStatistics() {
  const c = document.getElementById('all-statistics-cards');
  if (!c) return;
  c.innerHTML = `
    <div class="xv-empty" style="margin-bottom:16px">
      <div class="xv-empty-ico">📈</div>
      অনলাইন BBS পরিসংখ্যান ও শুমারি তথ্য
      <br><small>নিচের বাটন থেকে BBS notices/statistics page খুলবে।</small>
    </div>
    ${BBS_STATS_ITEMS.map(item => `
      <div class="sv-card">
        <div class="sv-top">
          <div class="sv-icon" style="background:#E8F5E9">${item.icon}</div>
          <div class="sv-info">
            <div class="sv-title">${item.name}</div>
            <div class="sv-meta">ID: ${item.id} · উৎস: ${item.source}</div>
          </div>
        </div>
        <div class="sv-tags">
          <span class="tag tag-g">${item.year}</span>
          <span class="tag tag-b">${item.source}</span>
          <span class="tag tag-o">${item.note}</span>
        </div>
        <div class="sv-foot">
          <span class="sv-pct">${item.note}</span>
          <a class="sv-due" href="javascript:void(0)" onclick="openBbsStatistics()">BBS online →</a>
        </div>
      </div>`).join('')}
  `;
}