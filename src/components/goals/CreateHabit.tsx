import { useState } from 'react';
import { TouchableOpacity, TextInput, View, Text } from 'react-native';
import { useSession } from '../../contexts/SessionContext';
import { createHabit } from '../../services/habitServices';

export const CreateHabit = () => {
  const { session } = useSession();

  const [name, setName] = useState('');
  const [description, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateHabit = async () => {
    if (!session?.user) {
      return { error: 'Must be logged in to create a habit.' };
    }

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
      <TouchableOpacity
        onPress={handleCreateHabit}
        disabled={loading}
        className={`mt-2 rounded-xl px-4 py-3 ${
          loading
            ? 'bg-blue-400'
            : 'bg-blue-600 active:bg-blue-700'
            }`}
          >
        <Text
          className="text-white text-center font-semibold"
          >
        {loading ? 'Creating...': 'Create Habit'}
        </Text>
      </TouchableOpacity>
      {error && <Text className='text-red-500'>{error}</Text>}
    </View>
  )
}
