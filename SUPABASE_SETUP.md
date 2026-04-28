# BBS Platform - Supabase Integration Guide

## ✅ কী কী করা হয়েছে

### 1. Supabase Client Integration
- `js/supabase_config.js` - Supabase client initialization
- CDN script added to HTML head
- Global supabase client available as `window.supabaseClient`

### 2. Database Functions Updated
- `js/data.js` - All functions converted to async/await
- localStorage replaced with Supabase API calls
- Added proper error handling

### 3. UI Functions Updated
- `js/doSignup.js` - Made async, uses new database functions
- `js/doLogin.js` - Made async, improved user lookup
- `js/genUserId.js` - Made async
- `js/renderAdminPanel.js` - All admin functions made async

### 4. Database Schema
- `supabase_schema.sql` - Complete table schema with indexes and RLS policies
- Users table with all necessary fields
- Proper relationships and constraints

### 5. Migration Support
- `js/migrate_data.js` - Automatic migration from localStorage to Supabase
- Manual migration function available

## 🚀 Quick Setup Steps

### ধাপ ১: Supabase প্রজেক্ট তৈরি
1. [supabase.com](https://supabase.com) এ যান
2. "New Project" ক্লিক
3. প্রজেক্ট ডিটেলস ফিল আপ করুন

### ধাপ ২: Database তৈরি
1. Dashboard → "SQL Editor"
2. `supabase_schema.sql` এর কন্টেন্ট রান করুন

### ধাপ ৩: API Keys সেট
1. Dashboard → "Settings" → "API"
2. URL এবং anon key কপি করুন
3. `js/supabase_config.js` এ পেস্ট করুন:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### ধাপ ৪: Admin User যোগ
SQL Editor এ এই কুয়েরি রান করুন:

```sql
INSERT INTO users (userId, name, post, positionEn, positionGrade, office, officeEn, officeType, email, phone, password, role, status, createdAt)
VALUES ('ADMIN', 'সিস্টেম এডমিন মিনহাজ', 'পরিচালক', 'Director', '৩য় গ্রেড', 'M!N L@bs', 'M!N Labs', 'HQ Wing', 'minhazulhaque1987@gmail.com', '01818105801', 'minsha1991', 'admin', 'approved', NOW());
```

### ধাপ ৫: Test করুন
1. `BBS App.html` ওপেন করুন
2. Console এ "Migration successful" দেখলে ভালো
3. Login করুন: admin / minsha1991

## 🔧 Technical Details

### Database Schema
```sql
users table:
- id (UUID, Primary Key)
- userId (TEXT, Unique) - BBS0001, etc.
- name, post, office (TEXT)
- positionEn, positionGrade, officeEn, officeType (TEXT)
- email, phone (TEXT, Unique)
- password (TEXT) - Hash in production!
- role, status (TEXT)
- photo (TEXT)
- createdAt, updatedAt (TIMESTAMP)
```

### API Functions
- `getUsers()` - Get all users
- `addUser(user)` - Add new user
- `updateUser(userId, updates)` - Update user
- `getUserByEmail(email)` - Find by email
- `getUserByPhone(phone)` - Find by phone
- `getUserById(userId)` - Find by userId

### Security Features
- Row Level Security (RLS) enabled
- Policies for data access control
- Indexes on frequently queried fields

## 🚨 Important Notes

1. **Passwords**: Currently plain text. Use bcrypt for production!
2. **Environment**: Separate dev/prod projects
3. **Backups**: Enable automated backups
4. **Monitoring**: Check Supabase dashboard regularly

## 🐛 Troubleshooting

- **Connection issues**: Check API keys and network
- **RLS errors**: Verify policies in dashboard
- **Migration fails**: Check console for errors
- **Data not showing**: Verify table creation

## 📞 Support
যদি সমস্যা হয় তাহলে Supabase docs দেখুন: https://supabase.com/docs