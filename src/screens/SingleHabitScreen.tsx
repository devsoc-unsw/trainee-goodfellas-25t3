import { Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types/habit';
import { Goal } from "../types/goal";
import { useEffect, useState } from "react";
import { useSession } from '../contexts/SessionContext';
import { supabase } from '../utils/supabase';
import { FlatList } from 'react-native-gesture-handler';
import { Card } from "react-native-paper";
import { EChartWrapper } from "../components/common/EChartWrapper"

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [session]);

  // TODO: No refresh functionality - need to add pull-to-refresh or manual refresh button
  async function fetchGoals() {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('habit_id', habit?.id);

    if (error) {
      setError(error.message);
      console.error('Error fetching goals:', error);
    } else if (data) {
      setGoals(data);
      console.log('Fetched goals:', data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#030712]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a7fe6" />
          <Text className="text-gray-400 mt-4">Loading goals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayGoalProgressGraph = (goal: Goal) => {
    const value = 100; // TODO: update this
    const max = goal.hours_required;
    const percent = Math.round((value / max) * 100);

    return {
      backgroundColor: 'transparent',
      grid: {
        left: 12,
        right: 12,
        top: 20,
        bottom: 12,
        containLabel: true
      },      
      xAxis: { 
        type: 'value', 
        name: 'Hours Completed', 
        nameLocation: 'middle',
        nameGap: 20,
        max, 
        show: true
      },
      yAxis: { 
        type: 'category', 
        data: ['Progress'], 
        show: true 
      },
      series: [
        {
          type: 'bar',
          data: [{ value }],
          barWidth: 18,
          itemStyle: { color: '#1a7fe6', borderRadius: 9 },
          label: {
            show: true,
            position: 'insideRight',
            formatter: `${percent}%`,
            color: '#fff',
            fontWeight: '600',
          },
        },
      ],
    };

  }

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 px-4 pt-4">
        {!habit ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1a7fe6" />
            {/* It is actually loading goals for that habit */}
            <Text className="text-gray-400 mt-4">Habit unable to load ;-;</Text>
          </View>
        ) : (
          <View>
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#1a7fe6" />
                <Text className="text-gray-400 mt-4">Loading goals...</Text>
              </View>
            ) : (
              <View>
                <Text className="text-2xl font-bold text-white mb-4 self-center">{habit.name}</Text>
                <Text className="text-gray-400 text-sm mt-1 self-center">{habit.description}</Text>
                <Text className="text-xl font-bold text-white mt-4 mb-4 self-center">Goals for {habit.name}</Text>
                <FlatList 
                  data={goals}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View>
                      <Card className="mt-2 mb-2">
                        <Card.Content>
                          <Text className="text-lg">Goal: {item.name}</Text>
                          <Text className="text-base">Description: {item.description}</Text>
                          <Text className="text-base">Progress: {item.hours_completed} / {item.hours_required} hours completed</Text>
                          <EChartWrapper option={displayGoalProgressGraph(item) as any} height={60} />
                        </Card.Content>
                      </Card>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};