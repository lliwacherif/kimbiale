import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://pxufxatfecpxnhkhgxpj.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4dWZ4YXRmZWNweG5oa2hneHBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0OTg2NDAsImV4cCI6MjA5OTA3NDY0MH0.xHC9-YPD9uA8coAW7ZYGo1f3MEoLXaRWeJKdRrQYRBs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
