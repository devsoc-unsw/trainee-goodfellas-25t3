import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

export async function createGoal(
  session:Session, name: string, description: string, habitId: number, hours: number)
{
  if (!session.user) {
    return { error: 'Must be logged in to create a goal.' };
  }

  if (!name || !hours) {
    return { error: 'Name and hours are required.' };
  }

  const { data, error } = await supabase
    .from("goals")
    .insert([
      {
        habit_id: habitId,
        name,
        description: description || null,
        hours_required: hours,
        hours_completed: 0
      },
    ]);

    if (error) {
    return { error: error.message };
  }
}