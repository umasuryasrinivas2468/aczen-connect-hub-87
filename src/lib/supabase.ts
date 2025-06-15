
import { createClient } from '@supabase/supabase-js'

console.log('Supabase configuration check...');

// Using the actual Supabase credentials provided by the user
const supabaseUrl = 'https://vkvrelytzvtauxlhunzd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdnJlbHl0enZ0YXV4bGh1bnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTY4MjcsImV4cCI6MjA2NTU3MjgyN30.QoAVDGmzyTQq5g1WWGM38aVYHW9tm-d3odMej57_pTM'

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('URL missing:', !supabaseUrl);
  console.error('Key missing:', !supabaseKey);
  throw new Error('Missing Supabase environment variables')
}

console.log('Creating Supabase client...');
export const supabase = createClient(supabaseUrl, supabaseKey)
console.log('Supabase client created successfully');
