import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateGoal } from '../components/CreateGoal';

export const GoalsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-white">Goals</Text>
        <CreateGoal />
      </View>
    </SafeAreaView>
  );
};
