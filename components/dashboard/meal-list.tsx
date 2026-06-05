"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteMeal } from "@/app/actions";
import { toast } from "sonner";
import type { Meal } from "@/lib/types";

const categoryColors: Record<string, string> = {
  breakfast: "bg-yellow-100 text-yellow-800",
  lunch: "bg-green-100 text-green-800",
  dinner: "bg-blue-100 text-blue-800",
  snack: "bg-purple-100 text-purple-800",
};

function DeleteButton({ mealId }: { mealId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await deleteMeal(mealId);
          if (result?.error) toast.error(result.error);
          else toast.success("Meal deleted");
        });
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}

export function MealList({ meals }: { meals: Meal[] }) {
  if (meals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No meals logged today. Add your first meal!
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {meals.map((meal) => (
        <li
          key={meal.id}
          className="flex items-center justify-between rounded-lg border bg-background px-4 py-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                categoryColors[meal.meal_category] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {meal.meal_category}
            </span>
            <span className="font-medium truncate">{meal.name}</span>
          </div>
          <div className="flex items-center gap-4 ml-4 shrink-0">
            <span className="text-sm font-semibold">{meal.calories} kcal</span>
            <div className="hidden sm:flex gap-2 text-xs text-muted-foreground">
              <span>P: {meal.protein}g</span>
              <span>C: {meal.carbs}g</span>
              <span>F: {meal.fats}g</span>
            </div>
            <DeleteButton mealId={meal.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}
