import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateGoal } from '../components/goals/CreateGoal';
import { CreateHabit } from '../components/goals/CreateHabit';

export const GoalsScreen = () => {
  return (
    <SafeAreaView className="flex-1 gap-10 justify-center bg-[#030712]">
      <View className=" items-center justify-center">
        <Text className="text-2xl font-bold text-white">Habits</Text>
        <CreateHabit />
      </View>
      <View className=" items-center justify-center">
        <Text className="text-2xl font-bold text-white">Goals</Text>
        <CreateGoal />
      </View>
    </SafeAreaView>
  );
};
