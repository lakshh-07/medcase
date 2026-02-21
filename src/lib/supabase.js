import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rjsiriapbttrdmjffyph.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_jyGnU2EUs3-GN5_lJFdTDg_yX4uv8nE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)