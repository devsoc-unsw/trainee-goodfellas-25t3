import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../utils/supabase'
import { useSession } from '../../contexts/SessionContext';
import { Habit } from '../../types/habit'
import Dropdown from 'react-native-input-select';
import { Picker } from '@react-native-picker/picker'
import { Text } from 'react-native';

// used for the dropdown to select a habit in goals menu

interface SelectHabitProps {
  setSelected: (habitId: number) => void;
  refreshTrigger?: number; // Trigger refresh when this value changes
}

interface PickerItemProps {
  label: string;
  value: number;
}

export const SelectHabit = ({ setSelected, refreshTrigger }: SelectHabitProps) => {
  const { session } = useSession();
  const [ dropdownOpts, setDropdownOpts ] = useState<{label:string; value:number;}[]>([]);
  const [ selectedOpt, setSelectedOpt ] = useState<number | undefined>();
  const [ error, setError ] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!session?.user) {
      setError('Must be logged in to fetch habits.');
      return;
    }

    setError(null);

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', session.user.id); // Only fetch habits for current user

    if (error) {
      setError(error.message);
      console.error(error);
    } else if (data) {
      setDropdownOpts(data.map((e: Habit) => ({ label: e.name, value: e.id })));
    }
  }, [session?.user]);

  // Initial load and refresh when refreshTrigger changes
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits, refreshTrigger]);

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
          fetchHabits(); // Refresh when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user, fetchHabits]);

  const PickerItem = ({ label, value }: PickerItemProps) => {
    return (
      <Picker.Item label={label} value={value}/>
    )
  }

  return (
    <>
      <Picker
        selectedValue={selectedOpt}
        onValueChange={(val:number) => {
          setSelectedOpt(val as number);
          setSelected(val as number);
        }}
        placeholder='Select a habit...'
        style={{
            backgroundColor: '#171717',
            borderColor: '#404040',
            color: '#fff',
            fontSize: 16,
            borderWidth: 1,
            borderRadius: 8,
            minHeight: 48,
            paddingHorizontal: 16,
        }}>
        { dropdownOpts.map((o) => (<PickerItem label={o.label} value={o.value}/>))}
      </Picker>
      {/* FIXME: i swapped the package but it is still ugly i am sorry... */}
      {/* <Dropdown
        placeholder='Select a habit...'
        options={dropdownOpts}
        selectedValue={selectedOpt}
        onValueChange={(value) => {
          setSelectedOpt(value as number);
          setSelected(value as number);
        }}
        primaryColor={'#3b82f6'}
        dropdownStyle={{
          backgroundColor: '#171717',
          borderColor: '#404040',
          borderWidth: 1,
          borderRadius: 8,
          minHeight: 48,
          paddingHorizontal: 16,
        }}
        placeholderStyle={{
          color: '#888',
          fontSize: 16,
        }}
        selectedItemStyle={{
          color: '#fff',
          fontSize: 16,
        }}
        dropdownContainerStyle={{
          backgroundColor: '#262626',
          borderColor: '#404040',
          borderRadius: 8,
        }}
        listComponentStyles={{
          itemSeparatorStyle: {
            backgroundColor: '#404040',
          },
        }}
        dropdownIconStyle={{
          width: 20,
          height: 20,
        }}
      /> */}
      {error && <Text style={{ color: '#ef4444', marginTop: 4 }}>{error}</Text>}
    </>
  );
}