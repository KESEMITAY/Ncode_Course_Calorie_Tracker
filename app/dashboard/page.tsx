import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AddMealDialog } from "@/components/dashboard/add-meal-dialog";
import { MealList } from "@/components/dashboard/meal-list";
import { GoalEditor } from "@/components/dashboard/goal-editor";
import type { Meal, Profile } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().split("T")[0];

  const [{ data: profileData }, { data: mealsData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("meals")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileData as Profile | null;
  const meals = (mealsData ?? []) as Meal[];
  const goal = profile?.daily_calorie_goal ?? 2000;

  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalFats = meals.reduce((s, m) => s + m.fats, 0);

  const progress = Math.min(Math.round((totalCalories / goal) * 100), 100);
  const remaining = goal - totalCalories;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Summary card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Today&apos;s Summary</CardTitle>
            <GoalEditor currentGoal={goal} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{totalCalories}</span>
            <span className="text-muted-foreground mb-1">/ {goal} kcal</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {remaining > 0
              ? `${remaining} kcal remaining`
              : `${Math.abs(remaining)} kcal over goal`}
          </p>
          {/* Macros */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            {[
              { label: "Protein", value: totalProtein, color: "text-blue-600" },
              { label: "Carbs", value: totalCarbs, color: "text-yellow-600" },
              { label: "Fats", value: totalFats, color: "text-red-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className={`text-2xl font-semibold ${color}`}>{value}g</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meal log */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Meal Log</CardTitle>
            <AddMealDialog />
          </div>
        </CardHeader>
        <CardContent>
          <MealList meals={meals} />
        </CardContent>
      </Card>
    </div>
  );
}
