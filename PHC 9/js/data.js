/* ═══════════ DATABASE (localStorage) ═══════════ */
const DB_KEY  = 'bbs_emp_v1';
const SES_KEY = 'bbs_emp_ses_v1';

function getUsers()   { try{return JSON.parse(localStorage.getItem(DB_KEY))||[]}catch{return[]} }
function saveUsers(u) { localStorage.setItem(DB_KEY, JSON.stringify(u)) }
function getSes()     { try{return JSON.parse(localStorage.getItem(SES_KEY))}catch{return null} }
function saveSes(u)   { localStorage.setItem(SES_KEY, JSON.stringify(u)) }
function clearSes()   { localStorage.removeItem(SES_KEY) }

/* Seed admin account if fresh */
(function seedAdmin(){
  let users = getUsers();
  if(!users.find(u=>u.userId==='ADMIN')){
    users.push({
      userId:'ADMIN', name:'সিস্টেম এডমিন মিনহাজ', post:'পরিচালক',
      office:'M!N L@bs',
      email:'minhazulhaque1987@gmail.com', phone:'01818105801',
      password:'minsha1991', role:'admin',
      status:'approved', createdAt:new Date().toISOString(),
      photo:null
    });
    saveUsers(users);
  }
})();