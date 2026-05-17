/* ═══════════ PENDING VIEW ═══════════ */
function showPending(user) {
  const info = document.getElementById('pend-info');
  info.innerHTML = `
    <div class="pend-row"><span class="k">নাম</span><span class="v">${user.name}</span></div>
    <div class="pend-row"><span class="k">পদবি</span><span class="v">${user.post||'—'}</span></div>
    <div class="pend-row"><span class="k">কর্মস্থল</span><span class="v">${user.office||'—'}</span></div>
    <div class="pend-row"><span class="k">ইমেইল</span><span class="v">${user.email}</span></div>
    <div class="pend-row"><span class="k">মোবাইল</span><span class="v">${user.phone}</span></div>
    <div class="pend-row"><span class="k">অবস্থা</span><span class="v" style="color:#FF9800">⏳ অনুমোদনের অপেক্ষায়</span></div>
  `;
  goView('v-pending');
}