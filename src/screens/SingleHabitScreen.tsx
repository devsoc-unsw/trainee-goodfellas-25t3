import { Text, View, ActivityIndicator, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types/habit';
import { Goal } from "../types/goal";
import { useEffect, useState, useMemo } from "react";
import { useSession } from '../contexts/SessionContext';
import { fetchGoals as getGoals, updateGoal } from '../services/goalServices';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HabitsStackParamList } from '../navigation/AppNavigator';
import { DeletionModal } from '../components/goals/DeletionModal';
import { useGoalsData } from '../hooks/useGoalsData';

interface SingleHabitScreenProps {
  route?: {
    params?: {
      habit: Habit;
    };
  };
}

export const SingleHabitScreen = ({ route }: SingleHabitScreenProps) => {
  const habit = route?.params?.habit;
  const { session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [customHours, setCustomHours] = useState<Record<number, string>>({});
  const [modalVisible, setModalVisibility] = useState(false);

  // uses the hook to refresh on goal creation/edit
  // sorry this is so sketchy, i wanted the habits to refresh on delete
  const { loading, error } = useGoalsData(setGoals, habit?.id);
  useEffect(() => {
    fetchGoals();
  }, [session]);

  const navigation = useNavigation<NativeStackNavigationProp<HabitsStackParamList>>();

  async function toggleModal() {
    // refresh goals when the modal is closed
    if (modalVisible) {
      await fetchGoals();
    }
    setModalVisibility(!modalVisible)
  }

  // used to manually refresh on goal deletion
  async function fetchGoals() {
    if (!session?.user || !habit?.id) {
      return;
    }
    const ret = await getGoals(habit.id);
    if (ret?.goals) {
      setGoals(ret.goals);
    }
  }

  // Update hours with custom or preset amount
  const updateHours = async (goalId: number, currentHours: number, amount: number) => {
    const newHours = Math.max(0, currentHours + amount); // Prevent negative hours
    const ret = await updateGoal(goalId, undefined, undefined, undefined, newHours);
    if (ret?.error) {
    } else {
      setCustomHours(prev => ({ ...prev, [goalId]: '' })); // Clear input after success
    }
  };

  // Add custom hours from input
  const addCustomHours = async (goalId: number, currentHours: number) => {
    const hours = parseInt(customHours[goalId] || '0');
    if (hours > 0) {
      await updateHours(goalId, currentHours, hours);
    }
  };

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalCompleted = goals.reduce((sum, g) => sum + g.hours_completed, 0);
    const totalRequired = goals.reduce((sum, g) => sum + g.hours_required, 0);
    const overallProgress = totalRequired > 0 ? (totalCompleted / totalRequired) * 100 : 0;
    const completedGoals = goals.filter(g => g.hours_completed >= g.hours_required).length;
    
    return { totalCompleted, totalRequired, overallProgress, completedGoals };
  }, [goals]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#030712]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-400 mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!habit) {
    return (
      <SafeAreaView className="flex-1 bg-[#030712]">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-lg">Unable to load habit</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Edit Goal
  const editGoal = (goal: Goal) => {
    navigation.navigate('EditGoal', { goal });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-white text-center mb-2">
              {habit.name}
            </Text>
            {habit.description && (
              <Text className="text-gray-400 text-center text-base max-w-[80%]">
                {habit.description}
              </Text>
            )}
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View className="mx-6 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <Text className="text-red-400 text-sm">{error}</Text>
          </View>
        )}

        {/* Goals Section */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-white mb-4">
            Your Goals {goals.length > 0 && `(${goals.length})`}
          </Text>

          {goals.length === 0 ? (
            <View className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 items-center">
              <Text className="text-gray-400 text-center text-base mb-1">No goals yet</Text>
              <Text className="text-gray-500 text-center text-sm">
                Create a goal to start tracking your progress
              </Text>
            </View>
          ) : (
            goals.map((goal, index) => {
              const progress = goal.hours_required > 0 
                ? (goal.hours_completed / goal.hours_required) * 100 
                : 0;
              const isCompleted = progress >= 100;
              const isSelected = selectedGoalId === goal.id;
              
              return (
                <View 
                  key={goal.id} 
                  className="mb-4 bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5 overflow-hidden"
                >
                  {/* Goal Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 mr-3">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-white text-lg font-bold flex-1">
                          {goal.name}
                        </Text>
                        {isCompleted && (
                          <View className="bg-green-500/20 border border-green-500/40 rounded-full px-2 py-1">
                            <Text className="text-green-400 text-xs font-semibold">✓ Done</Text>
                          </View>
                        )}
                      </View>
                      {goal.description && (
                        <Text className="text-gray-400 text-sm mt-1" numberOfLines={2}>
                          {goal.description}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Progress Stats */}
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-gray-500 text-sm">
                      {goal.hours_completed} / {goal.hours_required} hours
                    </Text>
                    <Text className={`text-sm font-semibold ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
                      {progress.toFixed(0)}%
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-2 bg-gray-700/50 rounded-full overflow-hidden mb-4">
                    <View 
                      className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </View>

                  {/* Custom Hours Input */}
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      keyboardType="number-pad"
                      value={customHours[goal.id] ?? ''}
                      onChangeText={(text) =>
                        setCustomHours(prev => ({
                          ...prev,
                          [goal.id]: text.replace(/[^0-9]/g, ''),
                        }))
                      }
                      placeholder="Hours"
                      placeholderTextColor="#6b7280"
                      className="bg-gray-700/50 border border-gray-600 text-white rounded-xl px-4 py-3 text-center min-w-[80px]"
                    />
                    
                    <TouchableOpacity 
                      onPress={() => addCustomHours(goal.id, goal.hours_completed)}
                      className="bg-blue-600 active:bg-blue-700 rounded-xl px-5 py-3 flex-1"
                    >
                      <Text className="text-white text-center font-semibold">Add Hours</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      onPress={() => setSelectedGoalId(isSelected ? null : goal.id)}
                      className="bg-gray-700 active:bg-gray-600 rounded-xl px-4 py-3"
                    >
                      <Text className="text-white text-center font-semibold text-base">
                        {isSelected ? '✕' : '···'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Quick Actions (Expanded) */}
                  {isSelected && (
                    <View className="mt-4 pt-4 border-t border-gray-700/50">
                      <Text className="text-gray-400 text-sm mb-3">Quick Actions</Text>
                      <View className="flex-row gap-2 mb-2">
                        <TouchableOpacity 
                          onPress={() => updateHours(goal.id, goal.hours_completed, 1)}
                          className="bg-blue-600/20 border border-blue-500/30 rounded-xl px-4 py-3 flex-1"
                        >
                          <Text className="text-blue-400 font-semibold text-center">+ 1h</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => updateHours(goal.id, goal.hours_completed, 5)}
                          className="bg-blue-600/20 border border-blue-500/30 rounded-xl px-4 py-3 flex-1"
                        >
                          <Text className="text-blue-400 font-semibold text-center">+ 5h</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => updateHours(goal.id, goal.hours_completed, 10)}
                          className="bg-blue-600/20 border border-blue-500/30 rounded-xl px-4 py-3 flex-1"
                        >
                          <Text className="text-blue-400 font-semibold text-center">+ 10h</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity 
                        onPress={() => updateHours(goal.id, goal.hours_completed, -1)}
                        className="bg-red-600/20 border border-red-500/30 rounded-xl px-4 py-3"
                      >
                        <Text className="text-red-400 font-semibold text-center">- 1 Hour</Text>
                      </TouchableOpacity>
                      <View className="flex-row gap-2 mt-2">
                        <TouchableOpacity
                          onPress={() => editGoal(goal)}
                          className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl px-3 py-3 flex-auto"
                        >
                          <Text className="text-yellow-400 font-semibold text-center">Edit Goal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => toggleModal()}
                          className="bg-red-600/20 border border-red-500/30 rounded-xl px-3 py-3 flex-auto"
                        >
                          <Text className="text-red-400 font-semibold text-center">Delete Goal</Text>
                        </TouchableOpacity>
                      </View>
                      <DeletionModal
                        toDelete={goal}
                        modalVisible={modalVisible}
                        toggleModal={toggleModal}/>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};