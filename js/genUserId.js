/* Generate user ID */
async function genUserId(name) {
  const users = await getUsers();
  const prefix = 'BBS';
  let num = users.filter(u=>u.role!=='admin').length + 1;
  return prefix + String(num).padStart(4,'0');
}
