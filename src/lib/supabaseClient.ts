import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qfhnylafanneyfniuemn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaG55bGFmYW5uZXlmbml1ZW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NzE2NzEsImV4cCI6MjA3MjQ0NzY3MX0.LyDSiADTZhANVHFCjyqgO1qWFvH9HmqbNwn9z6PB3Uk'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
