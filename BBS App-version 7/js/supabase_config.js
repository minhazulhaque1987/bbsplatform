// ============================================
// Supabase Configuration
// Bangladesh Bureau of Statistics - BBS Platform
// ============================================

// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://hdmlqsqbsuyrueklhtwk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkbWxxc3Fic3V5cnVla2xodHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTQwMzgsImV4cCI6MjA5Mjg5MDAzOH0.hDdMimEkdRR158x5GxZ_3hbooGNr2OYpuDejLKdEJ-M';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;