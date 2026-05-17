/* ═══════════ LOGIN ═══════════ */
document.addEventListener('DOMContentLoaded', () => {
  const rememberInput = document.getElementById('l-remember');
  if (!rememberInput) return;
  rememberInput.checked = localStorage.getItem('bbs_emp_ses_remember_v1') === '1';
});

async function recoverPasswordByEmailOrId() {
  const identifier = window.prompt('আপনার ইউজার আইডি বা ইমেইল লিখুন:');
  if (!identifier || !identifier.trim()) return;

  try {
    const user = await getUserByLoginIdentifier(identifier);
    if (!user) {
      toast('এই তথ্য দিয়ে কোন অ্যাকাউন্ট পাওয়া যায়নি', 'warn');
      return;
    }
    if (!user.password) {
      toast('এই অ্যাকাউন্টে পাসওয়ার্ড পাওয়া যায়নি', 'warn');
      return;
    }

    window.alert('আপনার পাসওয়ার্ড: ' + user.password);
    toast('পাসওয়ার্ড দেখানো হয়েছে', 'ok');
  } catch (error) {
    console.error('Password recovery failed:', error);
    toast('পাসওয়ার্ড রিকভার করা যায়নি', 'err');
  }
}

async function doLogin() {
  clearErrs();
  const raw = document.getElementById('l-user').value.trim();
  const pw  = document.getElementById('l-pass').value;
  const remember = !!document.getElementById('l-remember')?.checked;
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

    saveSes(user, remember);
    if (typeof setCurrentUser === 'function') {
      setCurrentUser(user);
    }
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
