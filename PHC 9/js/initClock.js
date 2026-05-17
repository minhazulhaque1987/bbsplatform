/* ═══════════ STATUS BAR CLOCK ═══════════ */
function initClock() {
  const el = document.querySelector('.s-time');
  function tick() {
    if(!el) return;
    const now = new Date();
    let h = now.getHours(), m = String(now.getMinutes()).padStart(2,'0');
    const ampm = h>=12?'PM':'AM';
    h = h%12||12;
    el.textContent = h+':'+m+' '+ampm;
  }
  tick();
  setInterval(tick, 1000);
}
window.addEventListener('DOMContentLoaded', initClock);