/* ═══════════ SURVEY RENDER ═══════════ */
function renderDashSurveys() {
  const c = document.getElementById('dash-survey-cards');
  if (!c) return;
  c.innerHTML = SURVEYS.slice(0,2).map(sv=>`
    <div class="sv-mini" onclick="goView('v-surveys')">
      <div class="sv-mini-ico" style="background:${sv.color}">${sv.icon}</div>
      <div class="sv-mini-info">
        <div class="sv-mini-title">${sv.name}</div>
        <div class="sv-mini-meta">${sv.id} · ${sv.due}</div>
        <div class="sv-mini-prog"><div class="sv-mini-fill" style="width:${sv.progress}%"></div></div>
      </div>
      <div class="sv-mini-pct">${sv.progress}%</div>
    </div>`).join('');
}

function renderAllSurveys() {
  const c = document.getElementById('all-survey-cards');
  c.innerHTML = SURVEYS.map(sv=>`
    <div class="sv-card">
      <div class="sv-top">
        <div class="sv-icon" style="background:${sv.color}">${sv.icon}</div>
        <div class="sv-info">
          <div class="sv-title">${sv.name}</div>
          <div class="sv-meta">ID: ${sv.id} · সময়সীমা: ${sv.due}</div>
        </div>
      </div>
      <div class="sv-tags">
        <span class="tag tag-g">${sv.tag}</span>
        <span class="tag tag-b">${sv.status}</span>
        <span class="tag tag-o">${sv.progress}% সম্পন্ন</span>
      </div>
      <div class="sv-progress"><div class="sv-fill" style="width:${sv.progress}%"></div></div>
      <div class="sv-foot">
        <span class="sv-pct">${sv.progress}% সম্পন্ন</span>
        <span class="sv-due">📅 ${sv.due}</span>
      </div>
    </div>`).join('');
}