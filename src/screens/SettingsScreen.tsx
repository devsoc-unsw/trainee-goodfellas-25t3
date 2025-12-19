import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../contexts/SessionContext';
import Account from '../components/auth/account';

/**
 * Settings/Profile Screen
 * Shows account settings and user profile management
 */
export const SettingsScreen = () => {
  const { session } = useSession();

  // Show loading if no session
  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-[#030712]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a7fe6" />
          <Text className="text-gray-400 mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="px-6 py-6">
          <Text className="text-2xl font-bold text-white mb-2">Profile</Text>
          <Text className="text-gray-400 text-sm">
            Manage your account settings
          </Text>
        </View>

        {/* Account Settings Section */}
        <View className="px-6 mb-6">
          <Account />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
