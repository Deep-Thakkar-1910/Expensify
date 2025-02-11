"use client";

import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed z-50 w-full border-b border-border/40 bg-white/45 backdrop-blur-sm"
    >
      <nav className="py:2 container mx-auto flex items-center justify-between lg:py-6">
        <Link href="/" className="flex items-center gap-2">
          <PiggyBank className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Expensify</span>
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">About</Button>
          <Button>Get Started</Button>
        </div>
      </nav>
    </motion.header>
  );
}
