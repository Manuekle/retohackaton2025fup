"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Moon, Sun } from "lucide-react";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
}
