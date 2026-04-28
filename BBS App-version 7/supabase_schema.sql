-- ============================================
-- BBS Users Table - Supabase Database Schema
-- Bangladesh Bureau of Statistics - BBS Platform
-- ============================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  userId TEXT UNIQUE, -- BBS0001, BBS0002, etc. (assigned by admin)
  name TEXT NOT NULL,
  post TEXT NOT NULL, -- Bengali position name
  positionEn TEXT, -- English position name
  positionGrade TEXT, -- Grade level (৩য় গ্রেড, ৪র্থ গ্রেড, etc.)
  office TEXT NOT NULL, -- Bengali office name
  officeEn TEXT, -- English office name
  officeType TEXT, -- HQ Wing, Divisional, District, Upazila
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- In production, hash passwords!
  role TEXT NOT NULL DEFAULT 'user', -- 'user' or 'admin'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  photo TEXT, -- URL to photo
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_userId ON users(userId);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
-- Allow anyone to read approved users (for public directory)
CREATE POLICY "Allow reading approved users" ON users
  FOR SELECT USING (status = 'approved');

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Allow admin to do everything
CREATE POLICY "Admin full access" ON users
  FOR ALL USING (role = 'admin');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();