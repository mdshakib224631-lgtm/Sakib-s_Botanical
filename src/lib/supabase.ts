import { createClient } from '@supabase/supabase-js';

// Default to Sakib's Botanical Supabase credentials
const SAKIBS_BOTANICAL_URL = 'https://qopjbhmmznorkynqdhoz.supabase.co';
const SAKIBS_BOTANICAL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGpiaG1tem5vcmt5bnFkaG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxOTU5NDYsImV4cCI6MjEwNzc3MTk0Nn0.mqerptGJ4nefZOd33vTH2ZFRygh7GtYUzag-V8oBUIY';

function cleanSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return SAKIBS_BOTANICAL_URL;
  let url = rawUrl.trim().replace(/^['"]|['"]$/g, '');
  if (!url || url.includes('pwgincgmyvxncrixzsni')) return SAKIBS_BOTANICAL_URL;

  // Remove trailing slashes and redundant paths like /rest/v1
  url = url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

function cleanSupabaseKey(rawKey?: string, activeUrl?: string): string {
  if (!rawKey || typeof rawKey !== 'string') return SAKIBS_BOTANICAL_KEY;
  const key = rawKey.trim().replace(/^['"]|['"]$/g, '');
  if (!key || key.includes('pwgincgmyvxncrixzsni') || key.length < 50) return SAKIBS_BOTANICAL_KEY;
  // If pointing to the Sakib Botanical Supabase project, strictly ensure its verified anon key is used
  if (activeUrl && activeUrl.includes('qopjbhmmznorkynqdhoz')) {
    return SAKIBS_BOTANICAL_KEY;
  }
  return key;
}

const supabaseUrl = cleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = cleanSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY, supabaseUrl);

// Resilient fetch with brief retry for transient network hiccups
const resilientFetch: typeof fetch = async (input, init) => {
  try {
    return await fetch(input, init);
  } catch (err) {
    // If transient network interruption occurs, retry once after a short pause
    try {
      await new Promise((r) => setTimeout(r, 400));
      return await fetch(input, init);
    } catch (retryErr) {
      // Re-throw so Supabase client receives error object
      throw retryErr;
    }
  }
};

console.info('Connected to Supabase project:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: resilientFetch,
  },
});
