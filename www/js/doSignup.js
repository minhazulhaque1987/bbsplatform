// js/doSignup.js - REPLACE your existing file
function doSignup() {
  const name   = document.getElementById('s-name').value.trim();
  const post   = document.getElementById('s-post').value.trim();
  const office = document.getElementById('s-office').value.trim();
  const email  = document.getElementById('s-email').value.trim();
  const phone  = document.getElementById('s-phone').value.trim();
  const pass   = document.getElementById('s-pass').value;
  const pass2  = document.getElementById('s-pass2').value;
  const btn    = document.getElementById('s-btn');

  ['s-name-e','s-post-e','s-office-e','s-email-e','s-phone-e','s-pass-e','s-pass2-e'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  let hasError = false;

  // Validation
  if (!name) { document.getElementById('s-name-e').style.display = 'block'; hasError = true; }
  if (!post) { document.getElementById('s-post-e').style.display = 'block'; hasError = true; }
  if (!office) { document.getElementById('s-office-e').style.display = 'block'; hasError = true; }
  if (!email || !email.includes('@')) { 
    document.getElementById('s-email-e').style.display = 'block'; 
    document.getElementById('s-email-e').textContent = 'সঠিক ইমেইল দিন (example@bbs.gov.bd)'; 
    hasError = true; 
  }
  if (!phone || phone.length < 11 || !/^\d+$/.test(phone)) {
    document.getElementById('s-phone-e').style.display = 'block'; 
    document.getElementById('s-phone-e').textContent = 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন'; 
    hasError = true;
  }
  if (!pass || pass.length < 6) { 
    document.getElementById('s-pass-e').style.display = 'block'; 
    document.getElementById('s-pass-e').textContent = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'; 
    hasError = true; 
  }
  if (pass !== pass2) { 
    document.getElementById('s-pass2-e').style.display = 'block'; 
    document.getElementById('s-pass2-e').textContent = 'পাসওয়ার্ড মিলছে না, পুনরায় চেষ্টা করুন'; 
    hasError = true; 
  }

  if (hasError) return;

  const originalText = btn.innerHTML;
  btn.innerHTML = "⏳ প্রসেসিং...";
  btn.disabled = true;

  (async () => {
    try {
      console.log('Starting signup process...');
      const selOffice = (typeof getSelectedOffice === 'function') ? getSelectedOffice() : null;
      const selPosition = (typeof getSelectedPosition === 'function') ? getSelectedPosition() : null;
      
      const userData = {
        name: name,
        post: post,
        office: selOffice ? selOffice.bn : office,
        officeEn: selOffice ? selOffice.en : null,
        officeType: selOffice ? selOffice.type : null,
        positionEn: selPosition ? selPosition.en : null,
        positionGrade: selPosition ? selPosition.grade : null,
        email: email,
        phone: phone,
        password: pass
      };

      // Firebase Auth integration
      if (window.auth) {
        try {
          if (window.createUserWithEmailAndPassword) {
            console.log('Creating Firebase auth user...');
            const authResult = await window.createUserWithEmailAndPassword(window.auth, email, pass);
            userData.firebaseUid = authResult.user.uid;
            console.log('Firebase auth created:', authResult.user.uid);
          }
        } catch (authError) {
          console.warn('Firebase Auth failed:', authError.message);
          if (authError.message.includes('email-already-in-use')) {
            toast('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে', 'err');
            return;
          }
        }
      }

      const newUser = await registerUser(userData);
      console.log('registerUser completed:', newUser);

      showPending(newUser);
      goView('v-pending');

      // ফর্ম রিসেট
      document.getElementById('s-name').value = '';
      document.getElementById('s-post').value = '';
      document.getElementById('s-office').value = '';
      document.getElementById('s-email').value = '';
      document.getElementById('s-pass').value = '';
      document.getElementById('s-pass2').value = '';

      toast('আবেদন সফলভাবে জমা হয়েছে! অনুমোদনের পর লগইন করতে পারবেন', 'ok');

    } catch (error) {
      console.error("Signup error:", error.message);
      toast("সাইন আপ ব্যর্থ হয়েছে: " + (error.message || 'আবার চেষ্টা করুন'), "err");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  })();
}