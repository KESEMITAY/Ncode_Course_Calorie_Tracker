import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="flex items-center gap-2">
          <Flame className="h-10 w-10 text-orange-500" />
          <h1 className="text-4xl font-bold tracking-tight">CalTrack</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Track your daily calories and macros. Stay on top of your nutrition goals.
        </p>
        <Button size="lg" nativeButton={false} render={<Link href="/login" />}>
          Get Started
        </Button>
      </div>
    </main>
  );
}
