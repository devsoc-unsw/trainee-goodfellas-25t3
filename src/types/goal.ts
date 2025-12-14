export interface Goal {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
  hours_required: number;
  hours_completed: number;
  habit_id: number;
}