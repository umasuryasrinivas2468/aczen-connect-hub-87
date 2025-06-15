
import { createClient } from '@supabase/supabase-js'

console.log('Supabase configuration check...');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('URL missing:', !supabaseUrl);
  console.error('Key missing:', !supabaseKey);
  throw new Error('Missing Supabase environment variables')
}

console.log('Creating Supabase client...');
export const supabase = createClient(supabaseUrl, supabaseKey)
console.log('Supabase client created successfully');
