import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DashboardScreen } from '../screens/DashboardScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TimerScreen } from '../screens/TimerScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { SingleHabitScreen } from '../screens/SingleHabitScreen';
import { EditHabitScreen } from '../screens/EditHabitScreen';
import { Habit } from '../types/habit';
import { EditGoalScreen } from '../screens/EditGoalScreen';
import { Goal } from '../types/goal';

export type RootTabParamList = {
  HomePage: undefined;
  CreateGoals: undefined;
  ListOfHabits: undefined;
  UserProfile: undefined;
};

export type HabitsStackParamList = {
  HabitsList: undefined; 
  SingleHabit: { habit: Habit };
  EditHabit: { habit: Habit };
  EditGoal: { goal: Goal };
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<HabitsStackParamList>();

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

// Stack navigator for Habits
// The native stack avigator is suitable for this job.
// Reference: https://reactnavigation.org/docs/native-stack-navigator/
const HabitsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#030712' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="HabitsList"
      component={HabitsScreen}
      options={{ title: 'My Habits' }}
    />
    <Stack.Screen
      name="SingleHabit"
      component={SingleHabitScreen}
      options={{ title: 'Habit Details' }}
    />
    <Stack.Screen
      name="EditHabit"
      component={EditHabitScreen}
      options={{ title: 'Edit Habit' }}
    />
    <Stack.Screen
      name="EditGoal"
      component={EditGoalScreen}
      options={{ title: 'Edit Goal' }}
    />
  </Stack.Navigator>
);

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
      <Tab.Screen name="ListOfHabits" options={{ tabBarLabel: "List of Habits"}} component={HabitsStack} />
      <Tab.Screen name="UserProfile" options={{ tabBarLabel: "User Profile"}} component={SettingsScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);
