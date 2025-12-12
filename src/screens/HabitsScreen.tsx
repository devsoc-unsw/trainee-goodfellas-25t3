import { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SingleHabitScreen } from "./SingleHabitScreen.jsx";

export const HabitsScreen = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    // TODO: create when API call is finished
  }, [])
  
  function redirectToHabitScreen(habit) {
    
  }

  return(
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-white">Habits</Text>
        {habits.map(habit => {
          
          return (
            <Button onPress={() => redirectToHabitScreen(habit)}>{habit.name}</Button>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
