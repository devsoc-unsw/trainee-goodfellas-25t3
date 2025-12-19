import { Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Habit } from '../types/habit';
import { HabitsStackParamList } from '../navigation/AppNavigator';
import { useHabitsData } from '../hooks/useHabitsData';

export const HabitsScreen = () => {
  /**
   * Use our custom hook to get habits data
   * No need to write all the fetching code here anymore!
   * The hook automatically:
   * - Loads habits when screen opens
   * - Updates when habits change in database
   * - Handles loading and errors
   */
  const { habits, loading, error } = useHabitsData();
  
  // Get navigation so we can go to the single habit screen
  const navigation = useNavigation<NativeStackNavigationProp<HabitsStackParamList>>();
  
  /**
   * Function to navigate to a single habit's detail page
   */
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
        {/* Show message if no habits exist */}
        {habits.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400 mb-2">No habits yet</Text>
            <Text className="text-gray-500 text-sm">Go to Create Goals tab to add habits</Text>
          </View>
        ) : (
          /* Show list of all habits */
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
