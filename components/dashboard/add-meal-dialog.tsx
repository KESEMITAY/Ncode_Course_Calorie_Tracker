"use client";

import { useState, useTransition, useRef } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMeal } from "@/app/actions";
import { toast } from "sonner";

export function AddMealDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    if (!category) {
      toast.error("Please select a meal category");
      return;
    }
    formData.set("meal_category", category);

    startTransition(async () => {
      const result = await addMeal(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Meal added!");
        setOpen(false);
        setCategory("");
        formRef.current?.reset();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            Add Meal
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log a Meal</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Meal Name</Label>
            <Input id="name" name="name" placeholder="e.g. Grilled chicken" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="calories">Calories (kcal)</Label>
              <Input id="calories" name="calories" type="number" min="0" placeholder="0" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input id="protein" name="protein" type="number" min="0" placeholder="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input id="carbs" name="carbs" type="number" min="0" placeholder="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fats">Fats (g)</Label>
              <Input id="fats" name="fats" type="number" min="0" placeholder="0" />
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="mt-1">
            {isPending ? "Saving..." : "Save Meal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
