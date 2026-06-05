export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  meal_category: MealCategory;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  created_at: string;
}

export interface Profile {
  id: string;
  daily_calorie_goal: number;
  created_at: string;
}

export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  goal: number;
}
