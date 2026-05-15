/* ═══════════ AUTH HELPERS ═══════════ */
function authTab(tab) {
  document.getElementById('ap-login').classList.toggle('on', tab==='login');
  document.getElementById('ap-signup').classList.toggle('on', tab==='signup');
  document.getElementById('atab-login').classList.toggle('on', tab==='login');
  document.getElementById('atab-signup').classList.toggle('on', tab==='signup');
  clearErrs();
}
function clearErrs() {
  document.querySelectorAll('.ferr').forEach(e=>e.classList.remove('on'));
  document.querySelectorAll('.finp').forEach(i=>{i.classList.remove('err','ok')});
}
function setErr(id, eid, msg) {
  const i=document.getElementById(id), e=document.getElementById(eid);
  i.classList.add('err'); i.classList.remove('ok');
  if(msg) e.textContent=msg; e.classList.add('on'); return false;
}
function setOk(id) { const i=document.getElementById(id); i.classList.remove('err'); i.classList.add('ok') }
function togglePw(id, el) {
  const i=document.getElementById(id);
  i.type = i.type==='password' ? 'text' : 'password';
  el.textContent = i.type==='password' ? '👁️' : '🙈';
}
function isEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
function isPhone(p) { return /^01[3-9]\d{8}$/.test(p) }
function pwStrength(val) {
  const s=[document.getElementById('ps1'),document.getElementById('ps2'),document.getElementById('ps3')];
  const l=document.getElementById('pw-lbl');
  s.forEach(x=>x.className='pw-seg');
  if(!val){l.textContent='';return}
  let sc=0;
  if(val.length>=6) sc++;
  if(val.length>=10||/[0-9]/.test(val)) sc++;
  if(/[!@#$%^&*]/.test(val)||(/[A-Z]/.test(val)&&/[a-z]/.test(val))) sc++;
  const cls=['w','m','s'][sc-1]||'w';
  const lb=['⚠️ দুর্বল','🔶 মাঝারি','✅ শক্তিশালী'][sc-1]||'';
  for(let i=0;i<sc;i++) s[i].classList.add(cls);
  l.textContent=lb;
}
