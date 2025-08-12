'use client';
import { ThemeProvider } from "../components/themeProvider";

import { DashboardHeader } from "../components/HeaderDashboard";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CookiesProvider } from 'react-cookie';
import AuthChecker from "../components/AuthChecker";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen bg-white dark:bg-black">
          <DashboardHeader />
          
          <div className="flex flex-1 overflow-hidden">

            
            {/* Main content - scrollable */}
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex-1 overflow-y-auto p-6 transition-all duration-300 ml-0 md:ml-64"
            >
              <div className="mx-auto my-10 max-w-7xl">
                <CookiesProvider>
                  <AuthChecker />{children}</CookiesProvider>
                
              </div>
            </motion.main>
          </div>
          
          {/* Notification toaster with animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Toaster 
              position="top-right" 
              richColors
              toastOptions={{
                className: 'bg-gray-900 border border-gray-800 text-white',
              }}
            />
          </motion.div>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}