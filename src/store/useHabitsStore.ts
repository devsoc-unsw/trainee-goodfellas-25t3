/**
 * REFERENCE IMPLEMENTATION ONLY - NOT PRODUCTION READY
 * 
 * This is a sample Zustand store demonstrating how to manage habit tracking state.
 * Feel free to modify, extend, or completely rewrite based on your needs.
 * 
 * Key Features Demonstrated:
 * - Zustand for state management (lightweight alternative to Redux)
 * - AsyncStorage persistence (data survives app restarts)
 * - Timer/Pomodoro functionality
 * - Habit progress tracking with levels
 * - Theme preferences
 * 
 * Learn more:
 * - Zustand docs: https://docs.pmnd.rs/zustand/getting-started/introduction
 * - AsyncStorage: https://react-native-async-storage.github.io/async-storage/
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

import { habitPresets } from '../constants/presets';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Represents a single habit that the user is tracking */
export type Habit = {
  id: string;
  name: string;
  targetHours: number;        // Goal hours to reach level 10
  totalMinutes: number;        // Accumulated time spent
  reward?: string;             // What you get when completing the goal
  color: string;               // Visual theme color (hex)
  level: number;               // 1-10 based on progress
  createdAt: string;           // ISO timestamp
};

/** A logged work session for a habit */
export type HabitSession = {
  id: string;
  habitId: string;
  minutes: number;
  notes?: string;
  loggedAt: string;            // ISO timestamp
  source: 'timer' | 'manual';  // How it was recorded
};

/** Active timer state (null if no timer running) */
export type TimerState = {
  habitId: string;
  startedAt: number;           // Unix timestamp in ms
  mode: 'focus' | 'break';
  plannedMinutes: number;
  note?: string;
};

/** Pomodoro technique settings */
export type PomodoroSettings = {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
};

/** User theme preferences */
export type ThemePreference = {
  palette: 'sunrise' | 'midnight' | 'forest';
  backgroundImageUri?: string;
  borderStyle: 'default' | 'legendary';
};

/** Main store shape - all state and actions */
export type HabitStore = {
  // State
  habits: Record<string, Habit>;    // Key-value map for O(1) lookups
  sessions: HabitSession[];         // Recent sessions (newest first)
  timer: TimerState | null;
  pomodoro: PomodoroSettings;
  theme: ThemePreference;
  presets: typeof habitPresets;
  achievements: string[];
  
  // Actions
  startTimer: (habitId: string, minutes: number, mode?: TimerState['mode'], note?: string) => void;
  stopTimer: (note?: string) => void;
  logManualSession: (habitId: string, minutes: number, notes?: string) => void;
  addHabit: (payload: Pick<Habit, 'name' | 'targetHours' | 'color' | 'reward'>) => Habit;
  addPresetHabit: (presetId: string) => Habit | null;
  setTheme: (theme: Partial<ThemePreference>) => void;
  updatePomodoro: (settings: Partial<PomodoroSettings>) => void;
  resetData: () => void;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/** Generate a simple unique ID (not cryptographically secure) */
const uid = () => Math.random().toString(36).slice(2, 11);

/** Calculate level (1-10) based on progress toward target hours */
const calculateLevel = (totalMinutes: number, targetHours: number) => {
  const targetMinutes = Math.max(targetHours * 60, 1);
  const progress = totalMinutes / targetMinutes;
  return Math.min(10, Math.floor(progress * 10) + 1);
};

// ============================================================================
// PERSISTENCE CONFIGURATION
// ============================================================================

/**
 * Configure AsyncStorage persistence for the store.
 * Only selected fields are persisted (presets excluded to avoid hydration issues).
 */
const persistOptions = {
  name: 'habitify-store-v1',
  version: 1,
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state: HabitStore) => ({
    habits: state.habits,
    sessions: state.sessions,
    timer: state.timer,
    pomodoro: state.pomodoro,
    theme: state.theme,
    achievements: state.achievements,
  }),
};

// ============================================================================
// STORE CREATION
// ============================================================================

/**
 * Main Zustand store with persistence middleware.
 * 
 * Usage in components:
 * ```tsx
 * const habits = useHabitsStore((state) => state.habits);
 * const addHabit = useHabitsStore((state) => state.addHabit);
 * ```
 */
export const useHabitsStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // INITIAL STATE
      // ========================================================================
      habits: {},
      sessions: [],
      timer: null,
      pomodoro: {
        focusMinutes: 25,
        breakMinutes: 5,
        longBreakMinutes: 15,
        cyclesBeforeLongBreak: 4,
      },
      theme: {
        palette: 'sunrise',
        borderStyle: 'default',
      },
      presets: habitPresets,
      achievements: [],
      
      // ========================================================================
      // ACTIONS - Timer Management
      // ========================================================================
      
      /** Start a new timer session */
      startTimer: (habitId, minutes, mode = 'focus', note) => {
        set({
          timer: {
            habitId,
            plannedMinutes: minutes,
            startedAt: Date.now(),
            mode,
            note,
          },
        });
      },
      
      /** Stop the timer and log the session */
      stopTimer: (note) => {
        const { timer } = get();
        if (!timer) return;
        const elapsedMinutes = Math.max(
          1,
          Math.round((Date.now() - timer.startedAt) / 60000)
        );
        get().logManualSession(timer.habitId, elapsedMinutes, note ?? timer.note);
        set({ timer: null });
      },
      
      // ========================================================================
      // ACTIONS - Session Logging
      // ========================================================================
      
      /** Log a work session and update habit progress */
      logManualSession: (habitId, minutes, notes) => {
        const { habits } = get();
        const habit = habits[habitId];
        if (!habit) return;
        const session: HabitSession = {
          id: uid(),
          habitId,
          minutes,
          notes,
          loggedAt: new Date().toISOString(),
          source: 'manual',
        };
        const updatedMinutes = habit.totalMinutes + minutes;
        const updatedHabit: Habit = {
          ...habit,
          totalMinutes: updatedMinutes,
          level: calculateLevel(updatedMinutes, habit.targetHours),
        };
        set((state) => ({
          habits: { ...state.habits, [habitId]: updatedHabit },
          sessions: [session, ...state.sessions].slice(0, 200), // Keep last 200 sessions
        }));
      },
      
      // ========================================================================
      // ACTIONS - Habit Management
      // ========================================================================
      
      /** Create a new custom habit */
      addHabit: ({ name, targetHours, color, reward }) => {
        const id = uid();
        const newHabit: Habit = {
          id,
          name,
          targetHours,
          totalMinutes: 0,
          reward,
          color,
          level: 1,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ habits: { ...state.habits, [id]: newHabit } }));
        return newHabit;
      },
      
      /** Add a habit from preset templates */
      addPresetHabit: (presetId) => {
        const preset = habitPresets.find((p) => p.id === presetId);
        if (!preset) return null;
        return get().addHabit({
          name: preset.name,
          targetHours: preset.targetHours,
          color: preset.color,
          reward: preset.reward,
        });
      },
      
      // ========================================================================
      // ACTIONS - Settings
      // ========================================================================
      
      /** Update theme preferences */
      setTheme: (theme) =>
        set((state) => ({ theme: { ...state.theme, ...theme } })),
      
      /** Update Pomodoro timer settings */
      updatePomodoro: (settings) =>
        set((state) => ({
          pomodoro: { ...state.pomodoro, ...settings },
        })),
      
      /** Reset all data (dangerous - use for testing/debug only) */
      resetData: () =>
        set({
          habits: {},
          sessions: [],
          achievements: [],
          timer: null,
        }),
    }),
    persistOptions
  )
);

// ============================================================================
// HELPER HOOKS (Optional)
// ============================================================================

/**
 * Type-safe selector helper (alternative to direct useHabitsStore usage).
 * 
 * Example:
 * ```tsx
 * const habits = useHabitSelector((store) => store.habits);
 * ```
 */
export type HabitSelector<T> = (store: HabitStore) => T;

export const useHabitSelector = <T,>(selector: HabitSelector<T>) =>
  useHabitsStore(selector);
