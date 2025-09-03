
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    'https://avgbzxjwwpxkiebsncey.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Z2J6eGp3d3B4a2llYnNuY2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4OTU2NjgsImV4cCI6MjA3MjQ3MTY2OH0.M_jlSzSq6yLWmxyhQaBlAtITD3hBPW2TCla1aEc9Of4'
  )
}
