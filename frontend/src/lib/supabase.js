import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (import.meta.env.DEV && (!url || !key)) {
  console.warn(
    'MedCase: Missing Supabase env. Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

const supabase = createClient(url || '', key || '')

export default supabase
