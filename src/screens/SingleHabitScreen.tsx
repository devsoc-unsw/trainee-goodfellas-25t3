import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types/habit';

interface SingleHabitScreenProps {
  route?: {
    params?: {
      habit: Habit;
    };
  };
}

export const SingleHabitScreen = ({ route }: SingleHabitScreenProps) => {
  const habit = route?.params?.habit;

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 px-4 pt-4">
        {!habit ? (
          <View className="flex-1 items-center justify-center">
            <Text>Unable to fetch the habit 😢</Text>
          </View>
        ) : (
          <View>
            <Text className="text-2xl font-bold text-white mb-4 self-center">{habit.name}</Text>
            <Text className="text-gray-400 text-sm mt-1 self-center">{habit.description}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};