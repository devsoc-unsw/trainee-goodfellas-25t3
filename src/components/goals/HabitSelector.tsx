import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase'
import { useSession } from '../../contexts/SessionContext';
import { Habit } from '../../types/habit'
import Dropdown from 'react-native-input-select';
import { Text, View } from 'react-native';
import { fetchHabits } from '../../services/habitServices';

// used for the dropdown to select a habit in goals menu

interface SelectHabitProps {
  setSelected: (habitId: number) => void;
  refreshTrigger?: number; // Trigger refresh when this value changes
}

export const SelectHabit = ({ setSelected, refreshTrigger }: SelectHabitProps) => {
  const { session } = useSession();
  const [ dropdownOpts, setDropdownOpts ] = useState<{label:string; value:number;}[]>([]);
  const [ selectedOpt, setSelectedOpt ] = useState<number | undefined>();
  const [ error, setError ] = useState<string | null>(null);

  const fetchOptions = useCallback(async () => {
    if (!session?.user) {
      const err = 'Need to be logged in to create a goal.';
      setError(err);
      console.error(err);
      return;
    }

    const ret = await fetchHabits(session);
    if (ret.error) {
      setError(ret.error);
      console.error(error);
    } else if (ret.habits) {
      setDropdownOpts(ret.habits.map((e: Habit) => ({ label: e.name, value: e.id })));
    }
  }, [session?.user]);

  // Initial load and refresh when refreshTrigger changes
  useEffect(() => {
    fetchOptions();
  }, [fetchOptions, refreshTrigger]);

  // Subscribe to real-time changes in habits table
  useEffect(() => {
    if (!session?.user) return;

    const channel = supabase
      .channel('habits-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'habits',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          fetchOptions(); // Refresh when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user, fetchOptions]);

  return (
    // TODO: replace this with a better dropdown
    <>
      <Dropdown
        placeholder='Select a habit...'
        options={dropdownOpts}
        selectedValue={selectedOpt}
        onValueChange={(value) => {
          setSelectedOpt(value as number);
          setSelected(value as number);
        }}
        primaryColor={'#3b82f6'}
        placeholderStyle={{
          color: '#888',
          fontSize: 14,
        }}
        selectedItemStyle={{
          color: '#fff',
          fontSize: 16,
        }}
        dropdownContainerStyle={{
          flexDirection: 'row',
          alignContent: 'center',
          backgroundColor: '#171717',
          borderColor: '#404040',
          borderRadius: 8,
          borderWidth: 1,
          height: 42,
          paddingHorizontal: 16,
        }}
        listComponentStyles={{
          itemSeparatorStyle: {
            backgroundColor: '#404040',
          },
        }}
        dropdownIcon={<Text className="text-white font-light text-xl">▼</Text>}
        dropdownIconStyle={{
          top: 6,
          right: 12,
        }}
        autoCloseOnSelect={true}
        />
        {error && <Text style={{ color: '#ef4444', marginTop: 4 }}>{error}</Text>}
      </>
  );
}