import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { Goal } from "../types/goal";

export async function getGoal(id: number) {
  // postgresql function called handles user ownership of data
  const { data, error } = await supabase
    .rpc('fetch_goal', { goal_id: id });
  
  if (error) {
    return { error: error.message }
  } else if ((data as Goal[]).length != 1) {
    return { error: 'Could not find the goal.' }
  }

  return { goal: data[0] };
}

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

export async function deleteGoal(id: number) {
  // postgresql function called handles user ownership of data
  const { data, error } = await supabase
    .rpc('delete_goal', { goal_id: id });
  
  if (error) {
    return { error: error.message }
  }
}