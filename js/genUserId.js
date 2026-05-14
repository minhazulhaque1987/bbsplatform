/* Generate user ID */
function genUserId(name) {
  const users = getUsers();
  const prefix = 'BBS';
  let num = users.filter(u=>u.role!=='admin').length + 1;
  return prefix + String(num).padStart(4,'0');
}

// Expose globally
window.genUserId = genUserId;
