import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

export async function fetchHabits(session: Session|null) {
  if (!session?.user) {
      return { error: 'Must be logged in to fetch habits.' };
    }

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', session.user.id); // Only fetch habits for current user

    if (error) {
      return { error: error.message };
    }

    return { habits: data };
}