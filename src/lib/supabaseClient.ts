
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://avgbzxjwwpxkiebsncey.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2J6eGp3d3B4a2llYnNuY2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTU2NjgsImV4cCI6MjA3MjQ3MTY2OH0.M_jlSzSq6yLWmxyhQaBlAtITD3hBPW2TCla1aEc9Of4";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
});
