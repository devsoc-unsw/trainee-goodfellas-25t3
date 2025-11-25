// Supabase is temporarily disabled, using local AsyncStorage
// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
//   ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
//   : null;

export const supabase = null;

export const syncSessionsToCloud = async () => {
  // TODO: Implement cloud sync when needed
  return Promise.resolve();
};
