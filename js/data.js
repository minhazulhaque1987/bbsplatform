/* ═══════════ DATABASE (localStorage + Firebase) ═══════════ */
const DB_KEY  = 'bbs_emp_v1';
const SES_KEY = 'bbs_emp_ses_v1';
const SES_REMEMBER_KEY = 'bbs_emp_ses_remember_v1';

function normalizeUsersData(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') return Object.values(raw);
  return [];
}

function loadLegacyUsers() {
  try {
    return normalizeUsersData(JSON.parse(localStorage.getItem(DB_KEY))) || [];
  } catch {
    return [];
  }
}

function mapUsersById(userArray) {
  return userArray.reduce((acc, user) => {
    if (!user || typeof user !== 'object') return acc;
    const key = user.userId || user.email || user.phone || `user_${Math.random().toString(36).slice(2)}`;
    acc[key] = user;
    return acc;
  }, {});
}

// Wait for Firebase DB to be available globally
async function waitForDB(timeout = 10000) {
  const startTime = Date.now();
  while (!window.DB && (Date.now() - startTime < timeout)) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!window.DB) {
    console.error('Firebase DB initialization timeout');
    throw new Error('Firebase DB not available');
  }
  return window.DB;
}

// ============================================
// BBS Platform - Firebase Data Layer
// ============================================

// LocalStorage backup for offline support
const Storage = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch(e) {
      return null;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

/* Seed admin account if fresh */
async function seedAdmin(){
  const legacyUsers = normalizeUsersData(loadLegacyUsers());
  const storageUsers = Storage.get('bbs_users') || {};
  const hasLegacyAdmin = legacyUsers.some(u => u.userId === 'ADMIN');
  const hasStorageAdmin = !!storageUsers['ADMIN'];

  if(!hasLegacyAdmin || !hasStorageAdmin){
    const adminUser = {
      userId: 'ADMIN', 
      name: 'সিস্টেম এডমিন মিনহাজ', 
      post: 'পরিচালক',
      office: 'M!N L@bs',
      email: 'minhazulhaque1987@gmail.com', 
      phone: '01818105801',
      password: 'minsha1991', 
      role: 'admin',
      status: 'approved', 
      createdAt: new Date().toISOString(),
      photo: null
    };

    if(!hasLegacyAdmin){
      const mergedLegacy = [...legacyUsers, adminUser];
      localStorage.setItem(DB_KEY, JSON.stringify(mergedLegacy));
    }
    if(!hasStorageAdmin){
      storageUsers['ADMIN'] = adminUser;
      Storage.set('bbs_users', storageUsers);
    }

    // Try to save admin to Firebase
    try {
      await waitForDB();
      if (window.DB && window.DB.saveUser) {
        await window.DB.saveUser('ADMIN', adminUser);
        console.log('✅ Admin user saved to Firebase');
      }
    } catch (error) {
      console.warn('❌ Failed to save admin to Firebase:', error.message);
    }
  }
}

// ============================================
// USERS DATABASE (Firebase + Local Backup)
// ============================================

let users = {};
let currentUser = null;

// Load users from Firebase with local fallback and retry logic
async function loadUsers() {
  try {
    // Ensure Firebase DB is initialized
    await waitForDB();
    
    // Try Firebase first
    const firebaseUsers = await window.DB.getAllUsers();
    if (firebaseUsers && Object.keys(firebaseUsers).length > 0) {
      users = firebaseUsers;
      Storage.set('bbs_users', users);
      console.log('✅ Users loaded from Firebase');
      return users;
    } else {
      // Fallback to localStorage
      users = Storage.get('bbs_users') || {};
      // Sync to Firebase if local data exists
      if (Object.keys(users).length > 0) {
        await syncUsersToFirebase();
      }
    }
  } catch (error) {
    const errorMessage = error.message || '';
    console.warn('Firebase error, using localStorage:', errorMessage);
    
    // Handle permission denied with anonymous auth
    if (errorMessage.toLowerCase().includes('permission denied')) {
      console.warn('Firebase permission denied, attempting anonymous auth...');
      if (window.signInAnonymously && window.auth && !window.auth.currentUser) {
        try {
          await window.signInAnonymously(window.auth);
          console.log('Anonymous auth successful, retrying user load...');
          const firebaseUsers = await window.DB.getAllUsers();
          if (firebaseUsers && Object.keys(firebaseUsers).length > 0) {
            users = firebaseUsers;
            Storage.set('bbs_users', users);
            console.log('✅ Users loaded from Firebase after anonymous auth');
            return users;
          }
        } catch (anonError) {
          console.warn('Anonymous auth failed:', anonError.message);
        }
      }
    }
    
    // Final fallback to localStorage
    users = Storage.get('bbs_users') || {};
  }

  // Load legacy users if no users exist
  if (!Object.keys(users).length) {
    const legacy = loadLegacyUsers();
    if (legacy.length) {
      users = mapUsersById(legacy);
      Storage.set('bbs_users', users);
    }
  }

  // Ensure admin user exists as fallback
  if (!users['ADMIN']) {
    users['ADMIN'] = {
      userId: 'ADMIN', 
      name: 'সিস্টেম এডমিন মিনহাজ', 
      post: 'পরিচালক',
      office: 'M!N L@bs',
      email: 'minhazulhaque1987@gmail.com', 
      phone: '01818105801',
      password: 'minsha1991', 
      role: 'admin',
      status: 'approved', 
      createdAt: new Date().toISOString(),
      photo: null
    };
    Storage.set('bbs_users', users);
    console.log('✅ Admin user added as fallback');
  }

  return users;
}

// Sync all local users to Firebase
async function syncUsersToFirebase() {
  if (!window.DB) return;
  
  const entries = Object.entries(users);
  for (let i = 0; i < entries.length; i++) {
    const [userId, userData] = entries[i];
    try {
      await window.DB.saveUser(userId, userData);
      console.log(`✅ Synced user ${i + 1}/${entries.length}: ${userId}`);
    } catch (e) {
      console.error(`Sync error for user ${userId}:`, e.message);
    }
  }
}

// Save user to both Firebase and LocalStorage with retry logic
async function saveUserToDB(userId, userData) {
  console.log('Saving user to localStorage:', userId);
  // Always save to localStorage first (offline support)
  users[userId] = userData;
  Storage.set('bbs_users', users);
  
  // Then sync to Firebase with retry
  let retries = 3;
  
  for (let i = 0; i < retries; i++) {
    try {
      await waitForDB();
      console.log(`Saving user to Firebase (attempt ${i + 1}/${retries}):`, userId);
      await window.DB.saveUser(userId, userData);
      console.log('✅ User saved to Firebase:', userId);
      return;
    } catch (error) {
      const isNetworkError = /network|timeout|offline/i.test(error.message || '');
      
      if (isNetworkError || i < retries - 1) {
        console.warn(`Firebase save attempt ${i + 1} failed, ${i < retries - 1 ? 'retrying...' : 'queuing sync'}:`, error.message);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      } else {
        console.error('Firebase save failed after all retries:', error.message);
        queueSync('users', userId, userData);
        return;
      }
    }
  }
}

// Update user in both storages with retry logic
async function updateUserInDB(userId, updates) {
  console.log('updateUserInDB called with:', userId, updates);
  if (!users[userId]) {
    console.warn('User not found in users object:', userId);
    console.warn('Available user keys:', Object.keys(users));
    throw new Error('User not found: ' + userId);
  }
  
  console.log('User found, applying updates...');
  Object.assign(users[userId], updates);
  Storage.set('bbs_users', users);
  console.log('✅ User updated in localStorage');
  
  // Sync to Firebase with retry
  let retries = 3;
  for (let i = 0; i < retries; i++) {
    try {
      await waitForDB();
      await window.DB.updateUser(userId, updates);
      console.log('✅ User updated in Firebase:', userId);
      return;
    } catch (error) {
      if (i === retries - 1) {
        console.warn('Firebase update failed after retries, queuing sync:', error.message);
        queueSync('users', userId, users[userId]);
        return;
      }
      console.warn(`Update retry ${i + 1}/${retries} failed, waiting...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// ============================================
// SYNC QUEUE (For offline support)
// ============================================

let syncQueue = Storage.get('bbs_sync_queue') || {};

function queueSync(type, id, data) {
  syncQueue[`${type}/${id}`] = { type, id, data, timestamp: Date.now() };
  Storage.set('bbs_sync_queue', syncQueue);
}

// Process sync queue when online
async function processSyncQueue() {
  if (!navigator.onLine) return;

  try {
    await waitForDB();
  } catch (error) {
    console.warn('Sync queue postponed, Firebase DB not ready:', error.message);
    return;
  }
  
  if (!window.DB || typeof window.DB.saveUser !== 'function') {
    console.warn('Sync queue postponed, DB helper unavailable');
    return;
  }
  
  const queue = Storage.get('bbs_sync_queue') || {};
  const entries = Object.entries(queue);
  
  if (entries.length === 0) {
    return;
  }
  
  console.log(`Processing sync queue: ${entries.length} items`);
  
  for (const [key, item] of entries) {
    try {
      if (item.type === 'users') {
        await window.DB.saveUser(item.id, item.data);
        console.log(`✅ Synced: ${key}`);
      }
      delete syncQueue[key];
    } catch (e) {
      console.error('Sync failed for:', key, e.message);
    }
  }
  Storage.set('bbs_sync_queue', syncQueue);
}

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('🌐 Online - processing sync queue...');
  processSyncQueue().catch(err => console.warn('Online sync failed:', err.message));
});

window.addEventListener('offline', () => {
  console.log('📴 Offline - using local data');
});

// Initial sync queue processing
processSyncQueue().catch(err => console.warn('Initial sync queue processing failed:', err.message));

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

async function checkUserCredentials(userId, password) {
  await loadUsers();
  const normalizedId = (userId || '').trim().toLowerCase();

  // Special handling for admin user
  if (normalizedId === 'admin') {
    const adminUser = users['ADMIN'];
    if (adminUser && adminUser.password === password) {
      return { ...adminUser, _uid: 'ADMIN' };
    }
    return null;
  }

  // Search all users
  for (const [uid, user] of Object.entries(users)) {
    if (!user || typeof user !== 'object') continue;
    
    const matchesUserId = user.userId && user.userId.toLowerCase() === normalizedId;
    const matchesEmail  = user.email && user.email.toLowerCase() === normalizedId;
    const matchesPhone  = user.phone && user.phone === userId.trim();
    
    if ((matchesUserId || matchesEmail || matchesPhone) && user.password === password) {
      return { ...user, _uid: uid };
    }
  }

  return null;
}

async function getUserByLoginIdentifier(identifier) {
  await loadUsers();
  const raw = (identifier || '').trim();
  if (!raw) return null;
  const normalizedId = raw.toLowerCase();

  if (normalizedId === 'admin') {
    const adminUser = users['ADMIN'];
    return adminUser ? { ...adminUser, _uid: 'ADMIN' } : null;
  }

  for (const [uid, user] of Object.entries(users)) {
    if (!user || typeof user !== 'object') continue;
    const matchesUserId = user.userId && user.userId.toLowerCase() === normalizedId;
    const matchesEmail = user.email && user.email.toLowerCase() === normalizedId;
    const matchesPhone = user.phone && user.phone === raw;
    if (matchesUserId || matchesEmail || matchesPhone) {
      return { ...user, _uid: uid };
    }
  }
  return null;
}

async function registerUser(userData) {
  console.log('Starting user registration:', userData);
  
  // Primary fix: use Firebase UID if available to ensure absolute uniqueness
  // Second fallback: use the improved genUserId or generateUserId
  const userId = userData.firebaseUid || (window.genUserId ? window.genUserId(userData.name) : generateUserId());
  console.log('Using userId for registration:', userId);
  
  const newUser = {
    ...userData,
    userId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('Saving user to DB:', newUser);
  await saveUserToDB(userId, newUser);
  console.log('User registration completed');
  return newUser;
}

function generateUserId() {
  const prefix = 'BBS';
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${random}`;
}

// ============================================
// CURRENT SESSION
// ============================================

function setCurrentUser(user) {
  currentUser = user;
  Storage.set('bbs_current_user', user);
}

function getCurrentUser() {
  if (!currentUser) {
    currentUser = Storage.get('bbs_current_user');
  }
  return currentUser;
}

function clearCurrentUser() {
  currentUser = null;
  Storage.remove('bbs_current_user');
}

// ============================================
// PHC 2022 DATA (Firebase + Local)
// ============================================

let phcData = {};

async function loadPHCData() {
  try {
    await waitForDB();
    
    const firebaseData = await window.DB.phc.getUpazilas();
    if (firebaseData && Object.keys(firebaseData).length > 0) {
      phcData = firebaseData;
      Storage.set('bbs_phc2022', phcData);
      console.log('✅ PHC Data loaded from Firebase');
    } else {
      phcData = Storage.get('bbs_phc2022') || {};
      if (Object.keys(phcData).length === 0) {
        phcData = getDefaultPHCData();
        await savePHCData();
      }
    }
  } catch (error) {
    console.warn('PHC load error, using localStorage:', error.message);
    phcData = Storage.get('bbs_phc2022') || getDefaultPHCData();
  }
  return phcData;
}

async function savePHCData() {
  Storage.set('bbs_phc2022', phcData);
  try {
    const entries = Object.entries(phcData);
    for (const [id, data] of entries) {
      await window.DB.phc.saveUpazila(id, data);
    }
    console.log('✅ PHC Data synced to Firebase');
  } catch (error) {
    console.warn('PHC sync failed:', error.message);
  }
}

function getDefaultPHCData() {
  return {
    coxsbazar_sadar: {
      name: "কক্সবাজার সদর",
      name_en: "Cox's Bazar Sadar",
      total_population: 253788,
      male: 129450,
      female: 124338,
      households: 52746,
      literacy_rate: 52.3,
      density: 1520
    },
    chakaria: {
      name: "চকরিয়া",
      name_en: "Chakaria",
      total_population: 422341,
      male: 210234,
      female: 212107,
      households: 87432,
      literacy_rate: 48.7,
      density: 890
    }
  };
}

// ============================================
// CROP CALENDAR DATA (Firebase + Local)
// ============================================

let cropReports = [];

async function loadCropReports() {
  try {
    await waitForDB();
    
    const firebaseData = await window.DB.crop.getReports();
    if (firebaseData && Object.keys(firebaseData).length > 0) {
      cropReports = Object.values(firebaseData);
      Storage.set('bbs_crop_reports', cropReports);
      console.log('✅ Crop Reports loaded from Firebase');
    } else {
      cropReports = Storage.get('bbs_crop_reports') || getDefaultCropReports();
    }
  } catch (error) {
    console.warn('Crop reports load error, using localStorage:', error.message);
    cropReports = Storage.get('bbs_crop_reports') || getDefaultCropReports();
  }
  return cropReports;
}

async function updateCropReport(reportId, updates) {
  const report = cropReports.find(r => r.id === reportId);
  if (report) {
    Object.assign(report, updates);
    Storage.set('bbs_crop_reports', cropReports);
    try {
      await window.DB.crop.updateReport(reportId, updates);
      console.log('✅ Crop report updated in Firebase');
    } catch (error) {
      console.warn('Crop update failed, queuing sync:', error.message);
      queueSync('crop', reportId, updates);
    }
  }
}

function getDefaultCropReports() {
  return [
    {
      id: "r001",
      name: "বোরো ধান উৎপাদন প্রতিবেদন",
      month: 1,
      deadline: "2024-01-15",
      status: "pending",
      type: "u2d"
    }
  ];
}

// ============================================
// INITIALIZATION - FIXED VERSION
// ============================================

async function initializeDatabase() {
  console.log('🚀 Initializing BBS Database...');
  
  // Seed admin user first - try but don't block
  try {
    await seedAdmin();
    console.log('✅ Admin seeded');
  } catch (e) {
    console.warn('Admin seed warning (non-blocking):', e.message);
  }
  
  // Load users - try Firebase, fallback to localStorage
  try {
    await loadUsers();
    console.log('👥 Users initialized');
  } catch (e) {
    console.warn('User load warning (non-blocking):', e.message);
    // Ensure users has at least admin
    if (!users || Object.keys(users).length === 0) {
      users = Storage.get('bbs_users') || {};
    }
  }
  
  // Load PHC - non-blocking
  try {
    await loadPHCData();
    console.log('📊 PHC Data initialized');
  } catch (e) {
    console.warn('PHC load warning (non-blocking):', e.message);
  }
  
  // Load Crop - non-blocking
  try {
    await loadCropReports();
    console.log('🌾 Crop Reports initialized');
  } catch (e) {
    console.warn('Crop load warning (non-blocking):', e.message);
  }
  
  console.log('✅ Database fully initialized');
  
  // Now handle the splash screen auto-navigation
  handleSplashNavigation();
}

// Handle splash screen to auth/dash navigation
function handleSplashNavigation() {
  // Check if user already has a session
  const session = getSes();
  
  if (session && session.userId) {
    console.log('Session found for user:', session.userId);
    
    // Verify user still exists and is approved
    const user = users[session._uid] || users[session.userId];
    
    if (user && user.status === 'approved') {
      console.log('User approved, navigating to dashboard...');
      setCurrentUser(user);
      
      // Apply user data
      if (typeof applyUser === 'function') {
        applyUser(user);
      }
      
      // Navigate based on role
      setTimeout(() => {
        if (typeof goView === 'function') {
          goView(user.role === 'admin' ? 'v-admin' : 'v-dash');
        }
      }, 500);
      return;
    } else if (user && user.status === 'pending') {
      console.log('User pending, showing pending screen');
      setCurrentUser(user);
      setTimeout(() => {
        if (typeof showPending === 'function') {
          showPending(user);
        }
        if (typeof goView === 'function') {
          goView('v-pending');
        }
      }, 500);
      return;
    }
  }
  
  // No valid session - show login page
  console.log('No valid session, showing auth page');
  setTimeout(() => {
    if (typeof goView === 'function') {
      goView('v-auth');
    } else {
      // Fallback if goView is not defined
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const authView = document.getElementById('v-auth');
      if (authView) authView.classList.add('active');
    }
  }, 1500);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Loaded - Starting initialization...');

  // Keep the web splash as the initial screen, but don't force the app
  // to re-show it or auto-navigate away from it here.
  if (typeof syncCurrentViewState === 'function') {
    syncCurrentViewState('v-splash');
  }

  // Initialize database after a small delay
  setTimeout(() => {
    initializeDatabase().catch(err => {
      console.error('Initialization error:', err.message);

      // Even if initialization fails, navigate to auth page
      setTimeout(() => {
        if (typeof goView === 'function') {
          goView('v-auth');
        }
      }, 1500);
    });
  }, 300);
});

// ============================================
// LEGACY COMPATIBILITY FUNCTIONS
// ============================================

function getUsers() {
  return Object.values(users);
}

function getUsersObject() {
  return users;
}

function saveUsers(userArray) {
  const mapped = mapUsersById(userArray);
  users = mapped;
  Storage.set('bbs_users', users);
  syncUsersToFirebase().catch(err => console.warn('Sync failed:', err.message));
}

function getSes() {
  try {
    const persistent = localStorage.getItem(SES_KEY);
    const temporary = sessionStorage.getItem(SES_KEY);
    const raw = persistent || temporary;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSes(u, remember) {
  const shouldRemember = typeof remember === 'boolean'
    ? remember
    : localStorage.getItem(SES_REMEMBER_KEY) === '1';

  const payload = JSON.stringify(u);
  if (shouldRemember) {
    localStorage.setItem(SES_KEY, payload);
    localStorage.setItem(SES_REMEMBER_KEY, '1');
    sessionStorage.removeItem(SES_KEY);
    return;
  }

  sessionStorage.setItem(SES_KEY, payload);
  localStorage.removeItem(SES_KEY);
  localStorage.removeItem(SES_REMEMBER_KEY);
}

function clearSes() {
  localStorage.removeItem(SES_KEY);
  localStorage.removeItem(SES_REMEMBER_KEY);
  sessionStorage.removeItem(SES_KEY);
}

// Expose functions globally for admin panel and other modules
window.updateUserInDB = updateUserInDB;
window.getCurrentUser = getCurrentUser;
window.getUsersObject = getUsersObject;
window.getSes = getSes;
window.saveSes = saveSes;
window.clearSes = clearSes;
window.clearCurrentUser = clearCurrentUser;
window.getUsers = getUsers;
window.saveUsers = saveUsers;
window.loadUsers = loadUsers;
window.checkUserCredentials = checkUserCredentials;
window.getUserByLoginIdentifier = getUserByLoginIdentifier;
window.registerUser = registerUser;
window.syncUsersToFirebase = syncUsersToFirebase;
window.saveUserToDB = saveUserToDB;
