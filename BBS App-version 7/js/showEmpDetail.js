/* ═══════════ EMPLOYEE DETAIL ═══════════ */
function showEmpDetail(email) {
  const users = getUsers();
  const u = users.find(x=>x.email===email);
  if(!u) return;

  const colors = ['#0A2342','#006A4E','#1A4A8A','#7B2D8B','#C8102E'];
  const bg = colors[(u.name||'?').charCodeAt(0)%colors.length];
  const initials = (u.name||'?').charAt(0).toUpperCase();

  const avEl = document.getElementById('det-av');
  if(u.photo){
    avEl.style.backgroundImage = `url(${u.photo})`;
    avEl.style.backgroundColor = 'transparent';
    avEl.textContent = '';
  } else {
    avEl.style.backgroundImage = '';
    avEl.style.backgroundColor = bg;
    avEl.textContent = initials;
  }
  document.getElementById('det-name').textContent   = u.name;
  document.getElementById('det-post').textContent   = u.post||'—';
  document.getElementById('det-office').textContent = u.office||'—';

  document.getElementById('det-body').innerHTML = `
    <div class="info-card">
      <div style="font-size:12px;font-weight:700;color:var(--g400);font-family:'Noto Sans Bengali',sans-serif;margin-bottom:10px;text-transform:uppercase;letter-spacing:.4px">ব্যক্তিগত তথ্য</div>
      <div class="info-row">
        <div class="info-ico" style="background:#E3F2FD">📧</div>
        <div><div class="info-lbl">ইমেইল</div><div class="info-val">${u.email}</div></div>
      </div>
      <div class="info-row">
        <div class="info-ico" style="background:#E8F5E9">📱</div>
        <div><div class="info-lbl">মোবাইল</div><div class="info-val">${u.phone||'—'}</div></div>
      </div>
      <div class="info-row">
        <div class="info-ico" style="background:#FFF8E1">🏷️</div>
        <div><div class="info-lbl">পদবি</div><div class="info-val">${u.post||'—'}</div></div>
      </div>
      <div class="info-row">
        <div class="info-ico" style="background:#F3E5F5">🏢</div>
        <div><div class="info-lbl">কর্মস্থল</div><div class="info-val">${u.office||'—'}</div></div>
      </div>
      <div class="info-row">
        <div class="info-ico" style="background:#E0F7FA">🆔</div>
        <div><div class="info-lbl">ইউজার আইডি</div><div class="info-val">${u.userId||'—'}</div></div>
      </div>
      <div class="info-row">
        <div class="info-ico" style="background:#FCE4EC">📅</div>
        <div><div class="info-lbl">যোগদানের তারিখ</div><div class="info-val">${u.createdAt ? new Date(u.createdAt).toLocaleDateString('bn-BD') : '—'}</div></div>
      </div>
    </div>
    <div style="padding:0 0 16px;display:flex;gap:10px">
      <button onclick="toast('📱 ${u.phone}','ok')" style="flex:1;padding:12px;background:linear-gradient(135deg,var(--green),#004D38);border:none;border-radius:12px;color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;font-family:'Noto Sans Bengali',sans-serif">📞 কল করুন</button>
      <button onclick="toast('📧 ${u.email}','ok')" style="flex:1;padding:12px;background:linear-gradient(135deg,var(--navy),var(--navy-mid));border:none;border-radius:12px;color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;font-family:'Noto Sans Bengali',sans-serif">✉️ ইমেইল</button>
    </div>`;
  goView('v-emp-detail');
}
