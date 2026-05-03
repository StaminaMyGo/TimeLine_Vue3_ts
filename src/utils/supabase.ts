import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytzdcbubgpwukbhydqhk.supabase.co'; // 你的 Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0emRjYnViZ3B3dWtiaHlkcWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDA2MzUsImV4cCI6MjA5MzMxNjYzNX0.MFOlgJrt5DwDMLkQoT7DucqtAxpJfDDhoeLyxeYN4Zo'
// https://ytzdcbubgpwukbhydqhk.supabase.co
export const supabase = createClient(supabaseUrl, supabaseAnonKey);