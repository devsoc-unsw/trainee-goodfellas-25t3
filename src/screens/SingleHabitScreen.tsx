import { Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Habit } from '../types/habit';
import { Goal } from "../types/goal";
import { useEffect, useState } from "react";
import { useSession } from '../contexts/SessionContext';
import { supabase } from '../utils/supabase';
import { FlatList } from 'react-native-gesture-handler';
import { Card, Title, Paragraph } from "react-native-paper";

interface SingleHabitScreenProps {
  route?: {
    params?: {
      habit: Habit;
    };
  };
}

export const SingleHabitScreen = ({ route }: SingleHabitScreenProps) => {
  const habit = route?.params?.habit;

  const { session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [session]);

  // TODO: No refresh functionality - need to add pull-to-refresh or manual refresh button
  async function fetchGoals() {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habit?.id);

    if (error) {
      setError(error.message);
      console.error('Error fetching goals:', error);
    } else if (data) {
      setGoals(data);
      console.log('Fetched goals:', data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#030712]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a7fe6" />
          <Text className="text-gray-400 mt-4">Loading goals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <View className="flex-1 px-4 pt-4">
        {!habit ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1a7fe6" />
            {/* It is actually loading goals for that habit */}
            <Text className="text-gray-400 mt-4">Habit unable to load ;-;</Text>
          </View>
        ) : (
          <View>
            {loading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#1a7fe6" />
                <Text className="text-gray-400 mt-4">Loading goals...</Text>
              </View>
            ) : (
              <View>
                <Text className="text-2xl font-bold text-white mb-4 self-center">{habit.name}</Text>
                <Text className="text-gray-400 text-sm mt-1 self-center">{habit.description}</Text>
                <Text className="text-xl font-bold text-white mt-4 mb-4 self-center">Goals for {habit.name}</Text>
                <FlatList 
                  data={goals}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View>
                      <Card>
                        <Card.Content>
                          <Text className="text-lg">Goal: {item.name}</Text>
                          <Text className="text-base">Description: {item.description}</Text>
                        </Card.Content>
                      </Card>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};