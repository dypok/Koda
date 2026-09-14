import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://sertfbduqivvjrmeblvh.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnRmYmR1cWl2dmpybWVibHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNDY3MjcsImV4cCI6MjEwNDkyMjcyN30.jC5gwZVgxqsA_VFbS6OAHOFKsmVdcpNhuH175KZ3Q3E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
