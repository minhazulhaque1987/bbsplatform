/* ═══════════ SIGNUP ═══════════ */
function doSignup() {
  clearErrs();
  const name   = document.getElementById('s-name').value.trim();
  const post   = document.getElementById('s-post').value.trim();
  const office = document.getElementById('s-office').value.trim();
  const email  = document.getElementById('s-email').value.trim();
  const phone  = document.getElementById('s-phone').value.trim();
  const pw     = document.getElementById('s-pass').value;
  const pw2    = document.getElementById('s-pass2').value;
  let ok = true;
  if(!name)           { setErr('s-name','s-name-e','নাম দিন'); ok=false } else setOk('s-name');
  if(!post)           { setErr('s-post','s-post-e','পদবি দিন'); ok=false } else setOk('s-post');

  // অফিস ভ্যালিডেশন: তালিকা থেকে অবশ্যই একটি অফিস সিলেক্ট করতে হবে
  const selOffice = (typeof getSelectedOffice === 'function') ? getSelectedOffice() : null;
  if(!office) {
    setErr('s-office','s-office-e','কর্মস্থল দিন'); ok=false;
  } else if(!selOffice) {
    setErr('s-office','s-office-e','তালিকা থেকে একটি অফিস নির্বাচন করুন'); ok=false;
  } else {
    setOk('s-office');
  }

  if(!isEmail(email)) { setErr('s-email','s-email-e','সঠিক ইমেইল দিন'); ok=false } else setOk('s-email');
  if(!isPhone(phone)) { setErr('s-phone','s-phone-e','সঠিক মোবাইল নম্বর দিন'); ok=false } else setOk('s-phone');
  if(pw.length<6)     { setErr('s-pass','s-pass-e','কমপক্ষে ৬ অক্ষর'); ok=false } else setOk('s-pass');
  if(pw!==pw2)        { setErr('s-pass2','s-pass2-e','পাসওয়ার্ড মিলছে না'); ok=false } else if(pw.length>=6) setOk('s-pass2');
  if(!ok) return;
  const users = getUsers();
  if(users.find(u=>u.email.toLowerCase()===email.toLowerCase())){ setErr('s-email','s-email-e','এই ইমেইলে অ্যাকাউন্ট আছে'); return }
  if(users.find(u=>u.phone===phone)){ setErr('s-phone','s-phone-e','এই মোবাইলে অ্যাকাউন্ট আছে'); return }
  const newUser = {
    userId: null, /* assigned by admin on approval */
    name, post,
    office: selOffice ? selOffice.bn : office,
    officeEn: selOffice ? selOffice.en : null,
    officeType: selOffice ? selOffice.type : null,
    email, phone, password:pw,
    role:'user', status:'pending',
    photo: null,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  const btn = document.getElementById('s-btn');
  btn.textContent = '✓ আবেদন হচ্ছে...';
  setTimeout(()=>{
    btn.textContent = 'অ্যাকাউন্টের আবেদন করুন';
    ['s-name','s-post','s-office','s-email','s-phone','s-pass','s-pass2'].forEach(id=>document.getElementById(id).value='');
    clearErrs();
    showPending(newUser);
  }, 900);
}
