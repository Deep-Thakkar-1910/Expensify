"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Stats() {
  return (
    <>
      <motion.section
        className="mb-32 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-16 text-4xl font-bold">
          Trusted by Over 10,000+ Users
        </h2>
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">98%</span>
            <span className="text-muted-foreground">Accuracy Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">30%</span>
            <span className="text-muted-foreground">Average Savings</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">24/7</span>
            <span className="text-muted-foreground">AI Support</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">5M+</span>
            <span className="text-muted-foreground">Receipts Processed</span>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mb-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-8 text-4xl font-bold">Ready to Take Control?</h2>
        <p className="mb-8 text-xl text-muted-foreground">
          Join thousands of users who have transformed their financial
          management with Expensify.
        </p>
        <Button size="lg" className="gap-2" variant={"outline"}>
          Get Started Now <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.section>
    </>
  );
}
