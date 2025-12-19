import { Text, View, ActivityIndicator, TextInput, ScrollView, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types/habit';
import { useEffect, useState, useMemo } from "react";
import { useSession } from '../contexts/SessionContext';
import { fetchGoals as getGoals, updateGoal } from '../services/goalServices';

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(habit?.name || "");
    setDescription(habit?.description || "");
  }, [])

  const handleEditHabit = async () => {
    if (!session?.user) {
      setError("Must be logged in to edit a habit.");
      return;
    }

    setLoading(true);
    setError(null);
    
    // const ret = await createGoal(session, name, description, selectedHabit, parseInt(hours, 10));
    alert("create an edit HABIT call to the supabase (1) handle name checking as well, returning an error if no name");

    setLoading(false);

    // if (ret?.error) {
    //   setError(ret?.error);
    //   console.error(error);
    // } else {
    //   setName("");
    //   setDescription("");
    //   setHours("");
    //   setHabit(null);
    //   onSuccess?.(); // Notify parent of success
    // }
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
                    <Button
                      title={loading ? "Creating..." : "Create Habit"}
                      onPress={handleEditHabit}
                      disabled={loading}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );}