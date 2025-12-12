import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase'
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';
import { useSession } from '../../contexts/SessionContext';
import { Habit } from '../../types/habit'

// used for the dropdown to select a habit in goals menu

export const SelectHabit = () => {
  const { session } = useSession();
  const [ dropdownOpts, setDropdownOpts ] = useState<Habit[]>([]);
  const [ loading, setLoading] = useState(false);
  const [ error, setError ] = useState<string | null>(null);

  async function fetchHabits() {
    if (!session?.user) {
      setError('Must be logged in to fetch habits.');
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('habits')
      .select('id, name');

    setLoading(false);
    if (error) {
      setError(error.message);
      console.error(error);
    } else {
      setDropdownOpts(data);
    }
  }


  // on page render, fetch dropdown options
  useEffect(() => {
    fetchHabits();
  }, [])

  // TODO: use dropdownOpts in a dropdown component for user to select
}