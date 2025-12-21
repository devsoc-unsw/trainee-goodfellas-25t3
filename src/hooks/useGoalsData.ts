/**
 * Custom Hook: useGoalsData
 * 
 * Adapted from Daniel's useHabitsData :)
 * 
 * This hook manages all goals data in one place so we don't have to
 * write the same deta fetching code in every screen
 * 
 * Features:
 * - Automatically loads goals when the screen opens
 * - Shows loading state while fetching data
 * - Handles errors if something goes wrong
 * - Listens for real-time changes (when you create/update/delete a goal)
 * - Provides a manual refresh function if needed
 * 
 * How to use:
 * const { goals, loading, error, refresh } = useGoalsData();
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useSession } from '../contexts/SessionContext';
import { fetchGoals as fetchGoalsService } from '../services/goalServices';
import { Goal } from '../types/goal';

export function useGoalsData(setGoals: (g: Goal[]) => void, habitId?: number) {
  const { session } = useSession();
  
  // State to show loading spinner
  const [loading, setLoading] = useState(true);
  
  // State to store error messages
  const [error, setError] = useState<string | null>(null);

  /**
   * Function to load goals from the database
   * We use useCallback so the function doesn't get recreated on every render
   */
  const loadGoals = useCallback(async () => {
    // Don't fetch if user is not logged in ! 
    if (!session?.user) {
      setLoading(false);
      return;
    }
    if (!habitId) {
      setLoading(false);
      setError("Couldn't fetch goals under this habit.");
      return;
    }

    // Start loading
    setLoading(true);
    setError(null);

    // Call our service function to fetch goals
    const result = await fetchGoalsService(habitId);

    // Check if there was an error
    if (result?.error) {
      setError(result.error);
      console.error('Error fetching goals:', result.error);
    } else if (result?.goals) {
      // Success! Update the goals list
      setGoals(result.goals);
    }

    // Stop loading
    setLoading(false);
  }, [session?.user]);

  /**
   * Effect: Load goals when the component first mounts
   * or when the user session changes
   */
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  /**
   * Effect: Set up real-time listener for database changes
   * This automatically updates the goals list when:
   * - A new goal is created
   * - An existing goal is updated
   * - A goal is deleted
   */
  useEffect(() => {
    // Don't set up listener if user is not logged in
    if (!session?.user) return;

    // Create a channel to listen for changes
    const channel = supabase
      .channel('goals-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'goals',
          filter: `habit_id=eq.${habitId}`,
        },
        (payload) => {
          // When a change happens, log it and reload the goals
          console.log('Goal changed in database:', payload);
          loadGoals();
        }
      )
      .subscribe();

    // Cleanup: Remove the listener when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user, loadGoals]);

  /**
   * Return everything that screens need:
   * - doesn't return goals array, since it's set with setGoals
   * - loading: Boolean to show loading spinner
   * - error: Error message if something went wrong
   * - refresh: Function to manually reload goals
   */
  return {
    loading,
    error,
    refresh: loadGoals,
  };
}
