"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateGoal } from "@/app/actions";
import { toast } from "sonner";

export function GoalEditor({ currentGoal }: { currentGoal: number }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(currentGoal));
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const goal = parseInt(value, 10);
    if (isNaN(goal) || goal <= 0) {
      toast.error("Please enter a valid calorie goal");
      return;
    }
    startTransition(async () => {
      const result = await updateGoal(goal);
      if (result?.error) toast.error(result.error);
      else {
        toast.success("Goal updated!");
        setEditing(false);
      }
    });
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted-foreground">Goal: {currentGoal} kcal</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditing(true)}>
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        className="h-7 w-24 text-sm"
        type="number"
        min="1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") setEditing(false);
        }}
        autoFocus
      />
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSave} disabled={isPending}>
        <Check className="h-3 w-3 text-green-600" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditing(false)}>
        <X className="h-3 w-3 text-red-500" />
      </Button>
    </div>
  );
}
