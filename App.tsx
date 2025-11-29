import 'react-native-gesture-handler';
import './global.css';

import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { useHabitsStore } from './src/store/useHabitsStore';

export default function App() {
  const themePalette = useHabitsStore((state) => state.theme.palette);
  const backgroundColor =
    themePalette === 'midnight'
      ? '#030712'
      : themePalette === 'forest'
        ? '#041b16'
        : '#0f1b33';

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
