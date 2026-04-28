// ============================================
// BBS Data Migration Script
// Migrate from localStorage to Supabase
// ============================================

async function migrateLocalStorageToSupabase() {
  try {
    // Check if Supabase is available
    if (!window.supabaseClient) {
      console.error('Supabase client not initialized');
      return false;
    }

    // Get existing localStorage data
    const localUsers = JSON.parse(localStorage.getItem('bbs_emp_v1') || '[]');

    if (localUsers.length === 0) {
      console.log('No local data to migrate');
      return true;
    }

    console.log(`Found ${localUsers.length} users in localStorage`);

    // Check if data already exists in Supabase
    const existingUsers = await getUsers();
    if (existingUsers.length > 0) {
      console.log('Supabase already has data. Skipping migration.');
      return true;
    }

    // Migrate users to Supabase
    const migrationSuccess = await saveUsers(localUsers);

    if (migrationSuccess) {
      console.log('✅ Migration successful!');
      console.log(`Migrated ${localUsers.length} users to Supabase`);

      // Optional: Clear localStorage after successful migration
      // localStorage.removeItem('bbs_emp_v1');
      // console.log('Local storage cleared');

      return true;
    } else {
      console.error('❌ Migration failed');
      return false;
    }

  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
}

// Auto-run migration when page loads (only if localStorage has data)
document.addEventListener('DOMContentLoaded', async function() {
  const localUsers = JSON.parse(localStorage.getItem('bbs_emp_v1') || '[]');
  if (localUsers.length > 0) {
    console.log('Local data detected. Starting migration...');
    await migrateLocalStorageToSupabase();
  }
});

// Manual migration function (call from console if needed)
window.migrateData = migrateLocalStorageToSupabase;