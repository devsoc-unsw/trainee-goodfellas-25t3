import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Habit } from '../types/habit';
import { supabase } from '../utils/supabase';
import { useSession } from '../contexts/SessionContext';
import { HabitsStackParamList } from '../navigation/AppNavigator';

export const HabitsScreen = () => {
  const { session } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<HabitsStackParamList>>();

  useEffect(() => {
    fetchHabits();
  }, [session]);

  // TODO: No refresh functionality - need to add pull-to-refresh or manual refresh button
  async function fetchHabits() {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      setError(error.message);
      console.error('Error fetching habits:', error);
    } else if (data) {
      setHabits(data);
      console.log('Fetched habits:', data);
    }

    setLoading(false);
  }
  
  function redirectToHabitScreen(habit: Habit) {
    navigation.navigate('SingleHabit', { habit });
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#030712]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a7fe6" />
          <Text className="text-gray-400 mt-4">Loading habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return(
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-white mb-4">My Habits</Text>
        {error && (
          <View className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
            <Text className="text-red-400">{error}</Text>
          </View>
        )}
        {habits.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400 mb-2">No habits yet</Text>
            <Text className="text-gray-500 text-sm">Go to Create Goals tab to add habits</Text>
          </View>
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => redirectToHabitScreen(item)}
                className="bg-gray-800 p-4 rounded-lg mb-3 border border-gray-700"
              >
                <Text className="text-white text-lg font-semibold">{item.name}</Text>
                {item.description && (
                  <Text className="text-gray-400 text-sm mt-1">{item.description}</Text>
                )}
                <Text className="text-gray-500 text-xs mt-2">
                  Total hours: {item.total_hours}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
