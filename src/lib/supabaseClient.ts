import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://avgbzxjwwpxkiebsncey.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2J6eGp3d3B4a2llYnNuY2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTU2NjgsImV4cCI6MjA3MjQ3MTY2OH0.M_jlSzSq6yLWmxyhQaBlAtITD3hBPW2TCla1aEc9Of4'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anonymous key are required. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}

// The `schema: 'public'` option is retained to prevent the schema cache issues we've been seeing.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
})
