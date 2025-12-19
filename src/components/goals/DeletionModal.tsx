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
  // TODO: move this into a deletion modal componbetn
  const handleDeleteHabit = (habit: Habit) => {
    if (!session?.user) {
      setError('Must be logged in to delete a habit.');
      return;
    }
    setModalVisibility(false);
    deleteHabit(session, habit.id);
  }

  // TODO: make this not ugly
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisibility(false)}>
        <View className="mt-4 p-4 flex flex-row gap-2 border-t border-gray-700/50 w-max">
        {/* TODO: fix the colors here lol */}
          <TouchableOpacity
              onPress={() => setModalVisibility(false)}
              className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl px-5 py-3 flex-auto"
            ><Text className="text-yellow-400 font-semibold text-center">Cancel</Text></TouchableOpacity>
          <TouchableOpacity
              onPress={() => handleDeleteHabit(habit)}
              className="bg-red-600/20 border border-red-500/30 rounded-xl px-5 py-3 flex-auto">
            <Text className="text-red-400 font-semibold text-center">Delete</Text>
          </TouchableOpacity>
        </View>
    </Modal>
  )
}