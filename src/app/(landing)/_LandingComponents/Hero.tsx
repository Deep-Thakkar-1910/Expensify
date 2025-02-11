"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

export default function Hero() {
  return (
    <main className="mx-auto max-w-screen-xl px-4 py-14 lg:py-24">
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-6xl font-bold text-transparent">
          Transform Your Expenses into Insights with AI
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Harness the power of artificial intelligence to automatically track,
          categorize, and optimize your expenses. Say goodbye to manual entry
          and hello to smart financial management.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Start for Free <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="relative mb-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <div className="relative h-[300px] w-full overflow-hidden rounded-lg shadow-2xl lg:h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
            alt="Dashboard Preview"
            className="h-full w-full object-cover"
            height={1920}
            width={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      </motion.div>
    </main>
  );
}
