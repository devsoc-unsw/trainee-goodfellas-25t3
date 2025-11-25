export type HabitPreset = {
  id: string;
  name: string;
  targetHours: number;
  reward?: string;
  color: string;
};

export const habitPresets: HabitPreset[] = [];
