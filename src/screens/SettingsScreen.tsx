import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../contexts/SessionContext';
import Account from '../components/auth/account';

export const SettingsScreen = () => {
  const { session } = useSession()

  if (!session) {
    return <Text>Loading</Text>
  }

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="text-2xl font-bold text-white">Settings</Text>
        <Account />
      </View>
    </SafeAreaView>
  );
};
