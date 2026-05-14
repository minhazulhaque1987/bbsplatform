/* ═══════════ LOGIN ═══════════ */
async function doLogin() {
  clearErrs();
  const raw = document.getElementById('l-user').value.trim();
  const pw  = document.getElementById('l-pass').value;
  if(!raw){ setErr('l-user','l-user-e','আইডি বা ইমেইল লিখুন'); return }
  if(!pw)  { setErr('l-pass','l-pass-e','পাসওয়ার্ড লিখুন'); return }

  const btn = document.getElementById('l-btn');
  btn.disabled = true;
  btn.textContent = '✓ যাচাই করা হচ্ছে...';

  try {
    const user = await checkUserCredentials(raw, pw);
    if(!user){
      setErr('l-user','l-user-e','কোনো অ্যাকাউন্ট পাওয়া যায়নি');
      return;
    }
    if(user.status==='pending'){
      showPending(user);
      return;
    }
    if(user.status==='rejected'){
      setErr('l-user','l-user-e','আপনার আবেদন প্রত্যাখ্যাত হয়েছে');
      return;
    }

    saveSes(user);
    applyUser(user);
    goView(user.role === 'admin' ? 'v-admin' : 'v-dash');
    toast('স্বাগতম, '+user.name+'! 🎉','ok');
  } catch (err) {
    console.error('Login error:', err);
    setErr('l-user','l-user-e','লগইন ব্যর্থ হয়েছে, আবার চেষ্টা করুন');
  } finally {
    btn.disabled = false;
    btn.textContent = 'লগইন করুন';
  }
}
