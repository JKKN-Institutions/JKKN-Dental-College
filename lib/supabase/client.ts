import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('[supabase/client] Missing environment variables!');
    console.error('[supabase/client] URL:', url ? 'SET' : 'MISSING');
    console.error('[supabase/client] Key:', key ? 'SET' : 'MISSING');
    throw new Error('Missing Supabase environment variables');
  }

  console.log('[supabase/client] Creating client with URL:', url);

  return createBrowserClient(url, key);
}
