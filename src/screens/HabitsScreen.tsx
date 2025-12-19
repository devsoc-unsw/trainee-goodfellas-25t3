import { Text, View, TouchableOpacity, FlatList, ActivityIndicator, Button, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Habit } from '../types/habit';
import { HabitsStackParamList } from '../navigation/AppNavigator';
import { useHabitsData } from '../hooks/useHabitsData';
import { useState } from "react";
import { DeletionModal } from '../components/goals/DeletionModal';

export const HabitsScreen = () => {
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [modalVisible, setModalVisibility] = useState(false);

  function toggleModal() {
    setModalVisibility(!modalVisible);
  }

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

  // Edit Habit
  const editHabit = (habit: Habit) => {
    navigation.navigate('EditHabit', { habit });
  }

  return(
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 px-4 pt-4">
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
            renderItem={({ item }) => {
              const isSelected = selectedHabitId === item.id;

              return (
              <TouchableOpacity 
                onPress={() => redirectToHabitScreen(item)}
                className="bg-gray-800 p-4 rounded-lg mb-3 border border-gray-700 flex flex-column justify-between"
              >
                <View className="flex flex-row justify-between">
                  <View className="w-40 flex-none">
                    <Text className="text-white text-lg font-semibold">{item.name}</Text>
                    {item.description && (
                      <Text className="text-gray-400 text-sm mt-1">{item.description}</Text>
                    )}
                  </View>
                  <Text className="text-gray-500 text-xs mt-2">
                    Total hours: {item.total_hours}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setSelectedHabitId(isSelected ? null : item.id)}
                    className="bg-gray-700 active:bg-gray-600 rounded-xl px-4 py-3"
                  >
                    <Text className="text-white text-center font-semibold text-base">
                      {isSelected ? '✕' : '···'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {isSelected && (
                  <View className="mt-4 p-4 flex flex-row gap-2 border-t border-gray-700/50 w-max">
                    <TouchableOpacity
                      onPress={() => editHabit(item)}
                      className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl px-5 py-3 flex-auto"
                    >
                      <Text className="text-yellow-400 font-semibold text-center">Edit Habit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleModal()}
                      className="bg-red-600/20 border border-red-500/30 rounded-xl px-5 py-3 flex-auto"
                    >
                      <Text className="text-red-400 font-semibold text-center">Delete Habit</Text>
                    </TouchableOpacity>
                    <DeletionModal habit={item} modalVisible={modalVisible} setModalVisibility={setModalVisibility}/>
                  </View>
                )}
              </TouchableOpacity>
            )}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
