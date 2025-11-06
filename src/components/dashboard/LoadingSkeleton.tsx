"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-4 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-8 w-32 mb-2 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-800" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="p-6">
            <Skeleton className="h-80 w-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="p-6">
            <Skeleton className="h-80 w-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white rounded-full animate-spin`}
      />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-xs text-gray-500 dark:text-gray-400">Cargando...</p>
    </div>
  );
}
