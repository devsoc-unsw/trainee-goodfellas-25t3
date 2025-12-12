import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { DashboardScreen } from '../screens/DashboardScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TimerScreen } from '../screens/TimerScreen';
import { HabitsScreen } from '../screens/HabitsScreen';

export type RootTabParamList = {
  HomePage: undefined;
  CreateGoals: undefined;
  ListOfHabits: undefined;
  UserProfile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#030712',
    card: '#030712',
    primary: '#1a7fe6',
    text: '#ffffff',
    border: 'transparent',
  },
};

const iconMap: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomePage: 'home',
  CreateGoals: 'star',
  ListOfHabits: 'list',
  UserProfile: 'person',
};

export const AppNavigator = () => (
  <NavigationContainer theme={navTheme}>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1a7fe6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#030712',
          borderTopColor: '#0f172a',
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconMap[route.name as keyof RootTabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="HomePage" options={{ tabBarLabel: "Home Page"}} component={DashboardScreen} />
      <Tab.Screen name="CreateGoals" options={{ tabBarLabel: "Create Goals"}} component={GoalsScreen} />
      <Tab.Screen name="ListOfHabits" options={{ tabBarLabel: "List of Habits"}} component={HabitsScreen} />
      <Tab.Screen name="UserProfile" options={{ tabBarLabel: "User Profile"}} component={SettingsScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);
