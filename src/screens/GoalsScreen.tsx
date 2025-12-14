import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateGoal } from '../components/goals/CreateGoal';
import { CreateHabit } from '../components/goals/CreateHabit';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useSession } from '../contexts/SessionContext';

type TabType = 'habits' | 'goals';

interface Goal {
  id: number;
  name: string;
  hours_required: number;
  habit_id: number;
  habits: { name: string } | null;
}

// TODO: New UI - feel free to modify
export const GoalsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('habits');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const fetchGoals = async () => {
    if (!session?.user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('goals')
      .select(`
        id,
        name,
        hours_required,
        habit_id,
        habits!inner (
          name
        )
      `)
      .eq('user_id', session.user.id);

    if (!error && data) {
      // Transform data to match our Goal interface
      const transformedGoals: Goal[] = data.map(goal => ({
        id: goal.id,
        name: goal.name,
        hours_required: goal.hours_required,
        habit_id: goal.habit_id,
        habits: goal.habits ? { name: (goal.habits as any).name } : null
      }));
      setGoals(transformedGoals);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, [session]);

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-white text-center mb-2">
          My Goals & Habits
        </Text>
        <Text className="text-gray-400 text-center text-sm">
          Track your progress and build better habits
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-6 mb-6">
        <TouchableOpacity
          className={`flex-1 py-3 px-4 rounded-l-lg border-r border-gray-600 ${
            activeTab === 'habits'
              ? 'bg-blue-600 border-blue-600'
              : 'bg-gray-800 border-gray-700'
          }`}
          onPress={() => setActiveTab('habits')}
        >
          <Text className={`text-center font-semibold ${
            activeTab === 'habits' ? 'text-white' : 'text-gray-400'
          }`}>
            Create Habit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 px-4 rounded-r-lg ${
            activeTab === 'goals'
              ? 'bg-blue-600 border-blue-600'
              : 'bg-gray-800 border-gray-700'
          }`}
          onPress={() => setActiveTab('goals')}
        >
          <Text className={`text-center font-semibold ${
            activeTab === 'goals' ? 'text-white' : 'text-gray-400'
          }`}>
            Set Goal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        {activeTab === 'habits' ? (
          <View>
            <View className="bg-gray-800 rounded-lg p-4">
              <Text className="text-lg font-semibold text-white mb-2">
                🏃 Create a New Habit
              </Text>
              <Text className="text-gray-400 text-sm mb-4">
                Start building a habit you want to develop. Habits are the foundation of your goals.
              </Text>
              <CreateHabit />
            </View>
          </View>
        ) : (
          <View>
            {/* Existing Goals */}
            {goals.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-white mb-3">
                  🎯 Your Goals
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {goals.map((goal) => (
                    <View
                      key={goal.id}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-4 py-2"
                    >
                      <Text className="text-white text-sm font-medium">
                        {goal.name}
                      </Text>
                      <Text className="text-blue-100 text-xs">
                        {goal.hours_required}h • {goal.habits?.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Create Goal Form */}
            <View className="bg-gray-800 rounded-lg p-4">
              <Text className="text-lg font-semibold text-white mb-2">
                🎯 Set a Specific Goal
              </Text>
              <Text className="text-gray-400 text-sm mb-4">
                Turn your habits into measurable goals. Choose a habit and set a target to achieve.
              </Text>
              <CreateGoal onSuccess={fetchGoals} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
