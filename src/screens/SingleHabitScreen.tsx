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
        <Text className="text-2xl font-bold text-white mb-4">
          {habit ? habit.name : 'Single Habit'}
        </Text>
        {habit ? (
          <View className="bg-gray-800 p-4 rounded-lg">
            <Text className="text-white text-lg mb-2">{habit.name}</Text>
            {habit.description && (
              <Text className="text-gray-400 mb-2">{habit.description}</Text>
            )}
            <Text className="text-gray-500 text-sm">
              Total hours: {habit.total_hours}
            </Text>
          </View>
        ) : (
          <Text className="text-gray-400">No habit data provided</Text>
        )}
      </View>
    </SafeAreaView>
  );
};