import { Text, View, ActivityIndicator, TextInput, ScrollView, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types/habit';
import { useEffect, useState } from "react";
import { useSession } from '../contexts/SessionContext';
import { updateHabit } from '../services/habitServices';

interface EditHabitScreenProps {
  route?: {
    params?: {
      habit: Habit;
    };
  };
}

export const EditHabitScreen = ({ route }: EditHabitScreenProps) => {
  const habit = route?.params?.habit;
  const { session } = useSession()
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(habit?.name || "");
    setDescription(habit?.description || "");
  }, []);

  const handleEditHabit = async () => {
    if (!session?.user) {
      setError('Must be logged in to edit a habit.');
      return;
    }
    if (!habit?.id) {
      setError('Could not find this habit in the database.');
      return;
    }

    setLoading(true);
    setError(null);

    const ret = await updateHabit(session, habit.id, name, description);

    setLoading(false);

    if (ret?.error) {
      setError(ret.error);
      console.error(error);
    } else {
      console.log("Habit Edits Saved");
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="items-center mb-6">
            {habit === undefined ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400 mb-2">Habit is not defined</Text>
                <Text className="text-gray-500 text-sm">Uh oh...</Text>
              </View>
            ) : (
              <View className="bg-gray-800 rounded-lg p-6 w-full">
                <Text className="text-2xl font-bold text-white text-center mb-8">
                  ✍️ Edit your Habit "{habit.name}"
                </Text>

                <View className="flex flex-col gap-4 items-start">
                  <Text className="text-gray-400 text-center text-base max-w-[80%]">Habit Name:</Text>
                  <TextInput
                    className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
                    placeholder="Habit Name"
                    placeholderTextColor='#888'
                    value={name}
                    onChangeText={setName}
                  />
                  <Text className="text-gray-400 text-center text-base max-w-[80%]">Habit Description:</Text>
                  <TextInput
                    className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
                    placeholder="Description (optional)"
                    placeholderTextColor='#888'
                    value={description}
                    onChangeText={setDescription}
                  />
                  <View className="w-full">
                    <TouchableOpacity
                      onPress={handleEditHabit}
                      disabled={loading}
                      className={`mt-6 rounded-xl px-4 py-3 ${
                        loading
                          ? 'bg-blue-400'
                          : 'bg-blue-600 active:bg-blue-700'
                          }`}
                        >
                      <Text
                        className="text-white text-center font-semibold"
                        >
                      {loading ? 'Saving...': 'Save Edits'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
          {error && (
            <View className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
              <Text className="text-red-400">{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );}