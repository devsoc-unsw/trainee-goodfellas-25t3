import { useState } from 'react';
import { supabase } from '../../utils/supabase'
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';
import { useSession } from '../../contexts/SessionContext';
import { SelectHabit } from './HabitSelector';

interface CreateGoalProps {
  onSuccess?: () => void;
}

export const CreateGoal = ({ onSuccess }: CreateGoalProps) => {
  const { session } = useSession()

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [selectedHabit, setHabit] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGoal = async () => {
    if (!selectedHabit) {
      setError('Please select a habit.');
      return;
    }

    if (!name || !hours) {
      setError("Name and hours are required.");
      return;
    }

    if (!session?.user) {
      setError("Must be logged in to create a goal.");
      return;
    }

    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("goals")
      .insert([
        {
          habit_id: selectedHabit,
          name,
          description: description || null,
          hours_required: parseInt(hours, 10),
          hours_completed: 0
        },
      ]);

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error(error);
    } else {
      setName("");
      setDescription("");
      setHours("");
      setHabit(null);
      onSuccess?.(); // Notify parent of success
    }
  };

  function getSelectedHabit(habitId:number) {
    setHabit(habitId);
  }

  return (
    <View className='gap-4'>
      <SelectHabit setSelected={getSelectedHabit}/>
      <TextInput
        className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
        placeholder="Goal Name"
        placeholderTextColor='#888'
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
        placeholder="Description (optional)"
        placeholderTextColor='#888'
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
        placeholder="Hours"
        value={hours}
        placeholderTextColor='#888'
        onChangeText={setHours}
        keyboardType="numeric"
      />
      <Button
        title={loading ? "Creating..." : "Create Goal"}
        onPress={handleCreateGoal}
        disabled={loading}
      />
      {error && <Text className='text-red-500'>{error}</Text>}
    </View>
  );
};