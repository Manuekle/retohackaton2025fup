"use client";

import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      {children}
      <Analytics />
      <Toaster position="top-center" duration={5000} />
    </ClientProviders>
  );
}

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </AuthProvider>
    </ThemeProvider>
  );
}
