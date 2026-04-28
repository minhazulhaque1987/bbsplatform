/* ═══════════ LOGIN ═══════════ */
async function doLogin() {
  clearErrs();
  const raw = document.getElementById('l-user').value.trim();
  const pw  = document.getElementById('l-pass').value;
  if(!raw){ setErr('l-user','l-user-e','আইডি বা ইমেইল লিখুন'); return }
  if(!pw)  { setErr('l-pass','l-pass-e','পাসওয়ার্ড লিখুন'); return }

  // Try to find user by different identifiers
  let user = null;

  // Check if it's an email
  if (raw.includes('@')) {
    user = await getUserByEmail(raw);
  } else if (/^\d{11}$/.test(raw)) {
    // Check if it's a phone number
    user = await getUserByPhone(raw);
  } else {
    // Check if it's a userId or admin
    user = await getUserById(raw === 'admin' ? 'ADMIN' : raw);
  }

  if(!user){
    // Fallback: get all users and search manually (less efficient but works)
    const users = await getUsers();
    user = users.find(u=>
      u.email.toLowerCase()===raw.toLowerCase() ||
      u.phone===raw ||
      (u.userId && u.userId.toLowerCase()===raw.toLowerCase()) ||
      raw==='admin'&&u.role==='admin'
    );
  }

  if(!user){ setErr('l-user','l-user-e','কোনো অ্যাকাউন্ট পাওয়া যায়নি'); return }
  if(user.password!==pw){ setErr('l-pass','l-pass-e','পাসওয়ার্ড সঠিক নয়'); return }
  if(user.status==='pending'){
    showPending(user);
    return;
  }
  if(user.status==='rejected'){
    setErr('l-user','l-user-e','আপনার আবেদন প্রত্যাখ্যাত হয়েছে');
    return;
  }
  const btn = document.getElementById('l-btn');
  btn.textContent = '✓ লগইন হচ্ছে...';
  setTimeout(()=>{
    btn.textContent = 'লগইন করুন';
    saveSes(user);
    applyUser(user);
    goView('v-dash');
    toast('স্বাগতম, '+user.name+'! 🎉','ok');
  }, 900);
}