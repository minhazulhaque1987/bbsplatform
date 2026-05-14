// ============================================
// Firebase Initialization
// ============================================

// Initialize Firebase with centralized config
if (!window.firebase) {
  console.error('❌ Firebase SDK not loaded!');
} else {
  firebase.initializeApp(window.FIREBASE_CONFIG);
  console.log('✅ Firebase initialized');
}

const database = firebase.database();
const auth = firebase.auth();

const DB = {
  users: database.ref('users'),
  
  async getUser(userId) {
    try {
      const snapshot = await database.ref(`users/${userId}`).once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error getting user:', error.message);
      return null;
    }
  },
  
  async saveUser(userId, userData) {
    try {
      await database.ref(`users/${userId}`).set(userData);
      return true;
    } catch (error) {
      console.error('Error saving user:', error.message);
      return false;
    }
  },
  
  async updateUser(userId, updates) {
    try {
      await database.ref(`users/${userId}`).update(updates);
      return true;
    } catch (error) {
      console.error('Error updating user:', error.message);
      return false;
    }
  },
  
  async getAllUsers() {
    try {
      const snapshot = await database.ref('users').once('value');
      return snapshot.val() || {};
    } catch (error) {
      console.error('Error getting all users:', error.message);
      return {};
    }
  },
  
  phc: {
    async getUpazilas() {
      try {
        const snapshot = await database.ref('phc2022/upazilas').once('value');
        return snapshot.val() || {};
      } catch (error) {
        console.error('Error getting PHC data:', error.message);
        return {};
      }
    },
    
    async saveUpazila(upazilaId, data) {
      try {
        await database.ref(`phc2022/upazilas/${upazilaId}`).set(data);
        return true;
      } catch (error) {
        console.error('Error saving PHC data:', error.message);
        return false;
      }
    }
  },
  
  crop: {
    async getReports() {
      try {
        const snapshot = await database.ref('cropCalendar/reports').once('value');
        return snapshot.val() || {};
      } catch (error) {
        console.error('Error getting crop reports:', error.message);
        return {};
      }
    },
    
    async updateReport(reportId, data) {
      try {
        await database.ref(`cropCalendar/reports/${reportId}`).update(data);
        return true;
      } catch (error) {
        console.error('Error updating crop report:', error.message);
        return false;
      }
    }
  }
};

// Expose globally
window.DB = DB;
window.auth = auth;
window.database = database;
window.createUserWithEmailAndPassword = (auth, email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};
window.signInAnonymously = (auth) => {
  return auth.signInAnonymously();
};

console.log('✅ Firebase DB helper ready');