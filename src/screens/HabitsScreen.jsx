import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HabitsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-white">Habits</Text>
      </View>
    </SafeAreaView>
  );
};
