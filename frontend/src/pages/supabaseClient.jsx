import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[DEBUG] Supabase URL:', supabaseUrl);
console.log('[DEBUG] Supabase Key:', supabaseKey ? '***' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase credentials missing! Check your APIs file and restart the server.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);