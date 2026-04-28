/* ═══════════ PROFILE EDIT ═══════════ */
function openProfileEdit() {
  if(!CURRENT_USER) return;
  document.getElementById('e-name').value   = CURRENT_USER.name||'';
  document.getElementById('e-post').value   = CURRENT_USER.post||'';
  document.getElementById('e-office').value = CURRENT_USER.office||'';
  document.getElementById('e-phone').value  = CURRENT_USER.phone||'';
  document.getElementById('e-email').value  = CURRENT_USER.email||'';
  setAvatarAll(CURRENT_USER);
}

function saveProfile() {
  if(!CURRENT_USER) return;
  const name   = document.getElementById('e-name').value.trim();
  const post   = document.getElementById('e-post').value.trim();
  const office = document.getElementById('e-office').value.trim();
  const phone  = document.getElementById('e-phone').value.trim();
  const email  = document.getElementById('e-email').value.trim();
  if(!name){ toast('নাম দিন','err'); return }

  const users = getUsers();
  const idx   = users.findIndex(u=>u.email===CURRENT_USER.email);
  if(idx===-1){ toast('ত্রুটি হয়েছে','err'); return }
  users[idx] = { ...users[idx], name, post, office, phone, email };
  saveUsers(users);
  saveSes(users[idx]);
  CURRENT_USER = users[idx];
  applyUser(CURRENT_USER);
  goView('v-profile');
  toast('প্রোফাইল আপডেট হয়েছে ✅','ok');
}

function handlePhotoUpload(input) {
  const file = input.files[0];
  if(!file) return;
  if(file.size > 2*1024*1024){ toast('ছবির সাইজ ২ MB এর বেশি নয়','err'); return }
  const reader = new FileReader();
  reader.onload = (e)=>{
    const photo = e.target.result;
    const users = getUsers();
    const idx   = users.findIndex(u=>u.email===CURRENT_USER.email);
    if(idx===-1) return;
    users[idx].photo = photo;
    saveUsers(users);
    saveSes(users[idx]);
    CURRENT_USER = users[idx];
    setAvatarAll(CURRENT_USER);
    toast('ছবি আপডেট হয়েছে ✅','ok');
  };
  reader.readAsDataURL(file);
}
