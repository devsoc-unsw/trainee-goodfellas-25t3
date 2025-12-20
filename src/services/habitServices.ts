import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

export async function getHabit(session:Session, id:number) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('id', id)
    .single();

  if (error) {
    return { error: error.message }
  }
  return { habit: data };
}

export async function fetchHabits(session: Session) {
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

export async function createHabit(
  session:Session, name: string, description: string) {
  if (!name) {
    return { error: 'Name is required.' };
  }

  const { data, error } = await supabase
    .from('habits')
    .insert([
      {
        user_id: session.user.id,
        name,
        description: description || null,
        created_at: new Date(),
        total_hours: 0
      }
    ]);

  if (error) {
    return { error: error.message };
  }
}

export async function deleteHabit(session:Session, id:number) {
  // goals will also be deleted, table constraint cascades the change
  const { data, error } = await supabase
    .from('habits')
    .delete().in('id', [id])
    .eq('user_id', session.user.id);
  if (error) {
    return { error: error.message };
  }
}

export async function updateHabit(
  session:Session, id: number, name?: string, description?: string) {
  const {error: err, habit} = await getHabit(session, id);
  if (err) {
    return { error: err };
  }
  if (!habit) {
    return { error: "Couldn't retrieve the original data." };
  }
  if (!name && !description) {
    return { error: 'Must provide either a name or a description.'}
  }

  const updated = {
    id: habit.id,
    created_at: habit.created_at,
    name: name || habit.name,
    description: description || habit.description || null,
    total_hours: habit.total_hours,
    user_id: habit.user_id
  };

  const { data, error } = await supabase
    .from('habits')
    .update(updated)
    .eq('user_id', session.user.id)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }
}