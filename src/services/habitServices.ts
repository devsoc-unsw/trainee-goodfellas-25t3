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

export async function createHabit(
  session:Session|null, name: string, description: string) {
  if (!name) {
    return { error: 'Name is required.' };
  }

  if (!session?.user) {
    return { error: 'Must be logged in to create a habit.' };
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

export async function deleteHabit(session:Session|null, id:number) {
  if (!session?.user) {
    return { error: 'Must be logged in to delete a habit.' };
  }

  // goals will also be deleted, table constraint cascades the change
  const { data, error } = await supabase
    .from('habits')
    .delete().in('id', [id])
    .eq('user_id', session.user.id);
  if (error) {
    return { error: error.message };
  }
}

// TODO: this works, just need to fix RLS policy for updating
export async function updateHabit(
  session:Session|null, id: number, name?: string, description?: string) {
  if (!session?.user) {
    return { error: 'Must be logged in to edit a habit.' };
  }

  const {error: err, habit} = await getHabit(session, id);
  if (err) {
    return { error: err };
  }
  if (!habit) {
    return { error: "Couldn't retrieve the original data." };
  }

  const updated = {
    id: habit.id,
    created_at: habit.created_at,
    name: name || habit.name,
    description: description || habit.description || null,
    total_hours: habit.total_hours,
    user_id: habit.user_id
  };

  console.log(`new stuff is ${name} and ${description} we update ${id}`);
  console.log(`old stuff is ${habit.name} and ${habit.description}`);
  const { data, error } = await supabase
    .from('habits')
    .update(updated)
    .eq('user_id', session.user.id)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }
}