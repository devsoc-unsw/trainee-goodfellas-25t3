import { useState } from 'react';
import { Button, TextInput, View, Text } from 'react-native';
import { useSession } from '../../contexts/SessionContext';
import { createHabit } from '../../services/habitServices';

export const CreateHabit = () => {
  const { session } = useSession();

  const [name, setName] = useState('');
  const [description, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateHabit = async () => {
    setLoading(true);
    setError(null);

    const ret = await createHabit(session, name, description);

    setLoading(false);

    if (ret?.error) {
      setError(ret.error);
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
