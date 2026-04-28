/* ═══════════ DATABASE (Supabase) ═══════════ */
const SES_KEY = 'bbs_emp_ses_v1';

// Session management (still localStorage for client-side session)
function getSes()     { try{return JSON.parse(localStorage.getItem(SES_KEY))}catch{return null} }
function saveSes(u)   { localStorage.setItem(SES_KEY, JSON.stringify(u)) }
function clearSes()   { localStorage.removeItem(SES_KEY) }

// User management with Supabase
async function getUsers() {
  try {
    const { data, error } = await window.supabaseClient
      .from('users')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error in getUsers:', error);
    return [];
  }
}

async function saveUsers(users) {
  try {
    // For simplicity, we'll update all users (in production, you'd handle this better)
    // This is a basic implementation - you might want to use upsert or handle conflicts

    // First, clear existing users (simplified approach)
    const { error: deleteError } = await window.supabaseClient
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error clearing users:', deleteError);
      return false;
    }

    // Insert all users
    const { error: insertError } = await window.supabaseClient
      .from('users')
      .insert(users);

    if (insertError) {
      console.error('Error saving users:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveUsers:', error);
    return false;
  }
}

async function addUser(user) {
  try {
    const { data, error } = await window.supabaseClient
      .from('users')
      .insert([user])
      .select();

    if (error) {
      console.error('Error adding user:', error);
      return null;
    }
    return data[0];
  } catch (error) {
    console.error('Error in addUser:', error);
    return null;
  }
}

async function updateUser(userId, updates) {
  try {
    const { data, error } = await window.supabaseClient
      .from('users')
      .update(updates)
      .eq('userId', userId)
      .select();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }
    return data[0];
  } catch (error) {
    console.error('Error in updateUser:', error);
    return null;
  }
}

async function getUserByEmail(email) {
  try {
    const { data, error } = await window.supabaseClient
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user by email:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return null;
  }
}

async function getUserByPhone(phone) {
  try {
    const { data, error } = await window.supabaseClient
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by phone:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error in getUserByPhone:', error);
    return null;
  }
}

async function getUserById(userId) {
  try {
    const { data, error } = await window.supabaseClient
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by ID:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
}

/* Seed admin account if fresh */
(async function seedAdmin(){
  try {
    const existingAdmin = await getUserById('ADMIN');
    if (!existingAdmin) {
      const adminUser = {
        userId: 'ADMIN',
        name: 'সিস্টেম এডমিন মিনহাজ',
        post: 'পরিচালক',
        positionEn: 'Director',
        positionGrade: '৩য় গ্রেড',
        office: 'M!N L@bs',
        officeEn: 'M!N Labs',
        officeType: 'HQ Wing',
        email: 'minhazulhaque1987@gmail.com',
        phone: '01818105801',
        password: 'minsha1991', // In production, hash passwords!
        role: 'admin',
        status: 'approved',
        createdAt: new Date().toISOString(),
        photo: null
      };

      await addUser(adminUser);
      console.log('Admin account seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
})();