/**
 * Custom Hook: useHabitsData
 * 
 * This hook manages all habits data in one place so we don't have to
 * write the same deta fetching code in every screen
 * 
 * Features:
 * - Automatically loads habits when the screen opens
 * - Shows loading state while fetching data
 * - Handles errors if something goes wrong
 * - Listens for real-time changes (when you create/update/delete a habit)
 * - Provides a manual refresh function if needed
 * 
 * How to use:
 * const { habits, loading, error, refresh } = useHabitsData();
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useSession } from '../contexts/SessionContext';
import { Habit } from '../types/habit';
import { fetchHabits as fetchHabitsService } from '../services/habitServices';

export function useHabitsData(setHabits: (h: Habit[]) => void) {
  const { session } = useSession();

  // list of habits state is updated through calling the setHabits func passed in
  
  // State to show loading spinner
  const [loading, setLoading] = useState(true);
  
  // State to store error messages
  const [error, setError] = useState<string | null>(null);

  /**
   * Function to load habits from the database
   * We use useCallback so the function doesn't get recreated on every render
   */
  const loadHabits = useCallback(async () => {
    // Don't fetch if user is not logged in ! 
    if (!session?.user) {
      setLoading(false);
      return;
    }

    // Start loading
    setLoading(true);
    setError(null);

    // Call our service function to fetch habits
    const result = await fetchHabitsService(session);

    // Check if there was an error
    if (result.error) {
      setError(result.error);
      console.error('Error fetching habits:', result.error);
    } else if (result.habits) {
      // Success! Update the habits list
      setHabits(result.habits);
    }

    // Stop loading
    setLoading(false);
  }, [session?.user]);

  /**
   * Effect: Load habits when the component first mounts
   * or when the user session changes
   */
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  /**
   * Effect: Set up real-time listener for database changes
   * This automatically updates the habits list when:
   * - A new habit is created
   * - An existing habit is updated
   * - A habit is deleted
   */
  useEffect(() => {
    // Don't set up listener if user is not logged in
    if (!session?.user) return;

    // Create a channel to listen for changes
    const channel = supabase
      .channel('habits-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'habits',
          filter: `user_id=eq.${session.user.id}`, // Only listen to current user's habits
        },
        (payload) => {
          // When a change happens, log it and reload the habits
          console.log('Habit changed in database:', payload);
          loadHabits();
        }
      )
      .subscribe();

    // Cleanup: Remove the listener when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user, loadHabits]);

  /**
   * Return everything that screens need:
   * - habits: Array of all habits
   * - loading: Boolean to show loading spinner
   * - error: Error message if something went wrong
   * - refresh: Function to manually reload habits
   */
  return {
    loading,
    error,
    refresh: loadHabits,
  };
}
