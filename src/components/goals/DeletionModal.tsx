import { Text, View, TouchableOpacity, FlatList, ActivityIndicator, Button, Modal } from 'react-native';
import { Habit } from '../../types/habit';
import { useState } from "react";
import { deleteHabit } from '../../services/habitServices';
import { useSession } from '../../contexts/SessionContext';

interface DeletionModalProps {
  habit: Habit;
  modalVisible: boolean;
  setModalVisibility: (value: boolean) => void;
}

export const DeletionModal = ({habit, modalVisible, setModalVisibility}: DeletionModalProps) => {
  const { session } = useSession();
  const [error, setError] = useState<string | null>(null);

  // Delete Habit
  const handleDeleteHabit = (habit: Habit) => {
    if (!session?.user) {
      setError('Must be logged in to delete a habit.');
      return;
    }
    setModalVisibility(false);
    deleteHabit(session, habit.id);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisibility(false)}>
        {/* FIXME: i'm trying to center this in the screen but modal is really finicky */}
        <View
          className="flex flex-col justify-center p-8 bg-gray-800 border border-t border-gray-700 rounded-2xl h-max mx-10 mt-36">
          <Text className="text-white text-lg font-semibold">Are you sure you want to delete {habit.name}?</Text>
          <View className="flex flex-row gap-4 justify-around align-center mt-4 w-max">
            <TouchableOpacity
                onPress={() => setModalVisibility(false)}
                className="bg-neutral-300/20 border border-neutral-50/30 rounded-xl px-5 py-3 flex-auto"
              ><Text className="text-white font-semibold text-center">Cancel</Text></TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleDeleteHabit(habit)}
                className="bg-red-600/20 border border-red-500/30 rounded-xl px-5 py-3 flex-auto">
              <Text className="text-red-400 font-semibold text-center">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        {error && (
            <View className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
              <Text className="text-red-400">{error}</Text>
            </View>
          )}
    </Modal>
  )
}