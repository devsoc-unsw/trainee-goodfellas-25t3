import { Text, View, ActivityIndicator, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types/habit';
import { Goal } from "../types/goal";
import { useEffect, useState, useMemo } from "react";
import { useSession } from '../contexts/SessionContext';
import { fetchGoals as getGoals, updateGoal } from '../services/goalServices';

interface EditHabitScreenProps {
  route?: {
    params?: {
      habit: Habit;
    };
  };
}

export const EditHabitScreen = ({ route }: EditHabitScreenProps) => {
  const habit = route?.params?.habit;

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="items-center mb-6">
            {habit === undefined ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400 mb-2">Habit is not defined</Text>
                <Text className="text-gray-500 text-sm">Uh oh...</Text>
              </View>
            ) : (
              <View>
                <Text className="text-3xl font-bold text-white text-center mb-2">
                  Edit "{habit.name}"
                </Text>

                <View>
                  

                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );}