"use client";

import { AnimatedSidebar } from "@/components/dashboard/AnimatedSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <AnimatedSidebar />
      {/* Mobile: sin margen, Desktop: margen izquierdo para el sidebar */}
      <div className="flex-1 w-full lg:ml-64">
        <main className="p-4 sm:p-6 pt-20 lg:pt-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
