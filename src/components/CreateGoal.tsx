import { useState } from 'react';
import { supabase } from '../lib/supabase'
import { Button, TextInput, View, Text, StyleSheet } from 'react-native';

export const CreateGoal = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGoal = async () => {
    if (!name || !hours) {
      setError("Name and hours are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("goals")
      .insert([
        {
          name,
          description: description || null,
          hours: parseInt(hours, 10),
        },
      ]);

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error(error);
    } else {
      console.log("Goal created:", data);
      setName("");
      setDescription("");
      setHours("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Goal Name"
        placeholderTextColor='#888'
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        placeholderTextColor='#888'
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Hours"
        value={hours}
        placeholderTextColor='#888'
        onChangeText={setHours}
        keyboardType="numeric"
      />
      <Button
        title={loading ? "Creating..." : "Create Goal"}
        onPress={handleCreateGoal}
        disabled={loading}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: '#fff',
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});