import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fwqjozrzejpbzjvotlnd.supabase.co'
const supabasePublishableKey = 'sb_publishable_jqaIOGWGXNG65wYwpvBuig__uVqu4wI'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})