/* ═══════════ PROFILE EDIT ═══════════ */
function getActiveUserForEdit() {
  if (typeof CURRENT_USER !== 'undefined' && CURRENT_USER) return CURRENT_USER;
  if (typeof getCurrentUser === 'function') return getCurrentUser();
  return null;
}

function openProfileEdit() {
  const user = getActiveUserForEdit();
  if (!user) return;

  const nameEl = document.getElementById('e-name');
  const postEl = document.getElementById('e-post');
  const officeEl = document.getElementById('e-office');
  const phoneEl = document.getElementById('e-phone');
  const emailEl = document.getElementById('e-email');

  if (nameEl) nameEl.value = user.name || '';
  if (postEl) postEl.value = user.post || '';
  if (officeEl) officeEl.value = user.office || '';
  if (phoneEl) phoneEl.value = user.phone || '';
  if (emailEl) emailEl.value = user.email || '';
  if (typeof setAvatarAll === 'function') setAvatarAll(user);
}

async function saveProfile() {
  const user = getActiveUserForEdit();
  if (!user) {
    toast('লগইন করুন প্রথমে', 'warn');
    return;
  }

  const name = (document.getElementById('e-name')?.value || '').trim();
  if (!name) {
    toast('নাম দিন', 'warn');
    return;
  }

  const updates = {
    name,
    post: (document.getElementById('e-post')?.value || '').trim(),
    office: (document.getElementById('e-office')?.value || '').trim(),
    phone: (document.getElementById('e-phone')?.value || '').trim(),
    email: (document.getElementById('e-email')?.value || '').trim(),
    updatedAt: new Date().toISOString()
  };

  try {
    await updateUserInDB(user.userId || user._uid, updates);
    Object.assign(user, updates);
    setCurrentUser(user);
    saveSes(user);
    applyUser(user);
    goView('v-profile');
    toast('প্রোফাইল আপডেট হয়েছে', 'success');
  } catch (error) {
    console.error('Profile update error:', error);
    toast('আপডেট ব্যর্থ হয়েছে', 'error');
  }
}

function handlePhotoUpload(input) {
  const user = getActiveUserForEdit();
  const file = input?.files?.[0];
  if (!user || !file) return;
  if (file.size > 2 * 1024 * 1024) {
    toast('ছবির সাইজ ২ MB এর বেশি নয়', 'err');
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const photo = e?.target?.result;
    if (!photo) return;

    try {
      await updateUserInDB(user.userId || user._uid, { photo, updatedAt: new Date().toISOString() });
      user.photo = photo;
      setCurrentUser(user);
      saveSes(user);
      if (typeof setAvatarAll === 'function') setAvatarAll(user);
      if (typeof applyUser === 'function') applyUser(user);
      toast('ছবি আপডেট হয়েছে', 'ok');
    } catch (error) {
      console.error('Photo update error:', error);
      toast('ছবি আপডেট ব্যর্থ হয়েছে', 'error');
    }
  };
  reader.readAsDataURL(file);
}
