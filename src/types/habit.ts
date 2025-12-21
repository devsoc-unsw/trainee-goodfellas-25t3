export interface Habit {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  total_hours: number;
}