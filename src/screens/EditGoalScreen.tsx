import { Text, View, ActivityIndicator, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { useSession } from '../contexts/SessionContext';
import { Goal } from '../types/goal';
import { updateGoal } from '../services/goalServices';

interface EditGoalScreenProps {
  route?: {
    params?: {
      goal: Goal;
    };
  };
}

export const EditGoalScreen = ({ route }: EditGoalScreenProps) => {
  const goal = route?.params?.goal;
  const { session } = useSession()
  // name and desc are allowed to be undefined, the user can choose to update one or the other
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(goal?.name || "");
    setDescription(goal?.description || "");
  }, []);

  const handleEditGoal = async () => {
    if (!session?.user) {
      setError('Must be logged in to edit a goal.');
      return;
    }
    if (!goal?.id) {
      setError('Could not find this goal in the database.');
      return;
    }

    setLoading(true);
    setError(null);

    // allow user to edit name and desc
    const ret = await updateGoal(goal.id, name, description, goal.habit_id, goal.hours_completed);

    setLoading(false);

    if (ret?.error) {
      setError(ret.error);
      console.error(error);
    } else {
      console.log("Goal Edits Saved");
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="items-center mb-6">
            {goal === undefined ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400 mb-2">Habit is not defined</Text>
                <Text className="text-gray-500 text-sm">Uh oh...</Text>
              </View>
            ) : (
              <View className="bg-gray-800 rounded-lg p-6 w-full">
                <Text className="text-2xl font-bold text-white text-center mb-8">
                  ✍️ Edit your Goal "{goal.name}"
                </Text>

                <View className="flex flex-col gap-4 items-start">
                  <Text className="text-gray-400 text-center text-base max-w-[80%]">Goal Name:</Text>
                  <TextInput
                    className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
                    placeholder="Goal Name"
                    placeholderTextColor='#888'
                    value={name}
                    onChangeText={setName}
                  />
                  <Text className="text-gray-400 text-center text-base max-w-[80%]">Goal Description:</Text>
                  <TextInput
                    className="w-72 h-12 px-4 rounded-lg bg-neutral-900 text-white border border-neutral-700"
                    placeholder="Description (optional)"
                    placeholderTextColor='#888'
                    value={description}
                    onChangeText={setDescription}
                  />
                  <View className="w-full">
                    <TouchableOpacity
                      onPress={handleEditGoal}
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