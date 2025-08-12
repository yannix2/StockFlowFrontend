'use client';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <Card className="bg-gray-900 border-gray-800 p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <Wrench className="h-8 w-8 text-yellow-400" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            This Page is Under Development
          </h1>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            We're working hard to bring you an amazing dashboard experience. 
            Thank you for your patience and understanding during this process.
          </p>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/10 text-yellow-400 rounded-full text-sm border border-yellow-500/20 mb-6">
            <Wrench className="h-4 w-4" />
            <span>Development in Progress</span>
          </div>
        </Card>
      </motion.div>

      <div className="flex gap-4">
        <Button asChild variant="outline" className="border-yellow-500/30 hover:text-white text-yellow-800 hover:bg-yellow-500/10">
          <Link href="/">
            Go Back to Home
          </Link>
        </Button>
        <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Link href="/dashboard">
            Go Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}