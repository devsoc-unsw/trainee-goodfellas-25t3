import 'react-native-gesture-handler';
import './global.css';

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { useHabitsStore } from './src/store/useHabitsStore';
import { supabase } from './src/utils/supabase'
import { Session } from '@supabase/supabase-js'
import Auth from './src/components/auth/auth';
import { SessionProvider } from './src/contexts/SessionContext';

export default function App() {
  const themePalette = useHabitsStore((state) => state.theme.palette);
  const backgroundColor =
    themePalette === 'midnight'
      ? '#030712'
      : themePalette === 'forest'
        ? '#041b16'
        : '#0f1b33';

  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SessionProvider>
          {session?.user ? (
          <AppNavigator />
          ) : (
            <Auth />
          )}
        </SessionProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
