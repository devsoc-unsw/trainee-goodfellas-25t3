import { useState } from 'react';
import { supabase } from '../../utils/supabase'
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';
import { useSession } from '../../contexts/SessionContext';

export const CreateHabit = () => {
  const { session } = useSession();

  const [name, setName] = useState('');
  const [description, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateHabit = async () => {
    if (!name) {
      setError('Name is required.');
      return;
    }

    if (!session?.user) {
      setError('Must be logged in to create a habit.');
      return;
    }

    setLoading(true);
    setError(null);

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

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error(error);
    } else {
      setName('');
      setDesc('');
    }
  }

  return (
    <View className='gap-4'>
      <TextInput
        className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
        placeholder="Habit Name"
        placeholderTextColor='#888'
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
        placeholder="Description (optional)"
        placeholderTextColor='#888'
        value={description}
        onChangeText={setDesc}
      />
      <Button
        title={loading ? "Creating..." : "Create Habit"}
        onPress={handleCreateHabit}
        disabled={loading}
      />
      {error && <Text className='text-red-500'>{error}</Text>}
    </View>
  )
}
