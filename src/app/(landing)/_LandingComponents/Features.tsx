"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bell, Brain, Receipt, PieChart } from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Budget Alerts",
    description:
      "Stay on top of your spending with real-time notifications and smart budget tracking alerts.",
  },
  {
    icon: Brain,
    title: "Personalized Insights",
    description:
      "Get AI-powered recommendations and insights tailored to your spending patterns.",
  },
  {
    icon: Receipt,
    title: "Smart Receipt Scanning",
    description:
      "Instantly capture and categorize receipts with our advanced AI recognition technology.",
  },
  {
    icon: PieChart,
    title: "AI Spend Analysis",
    description:
      "Detailed spending reports and trends analysis powered by advanced AI algorithms.",
  },
];

export default function Features() {
  return (
    <motion.section
      className="mx-auto mb-10 grid max-w-screen-xl gap-6 px-8 md:grid-cols-2 lg:mb-32 lg:grid-cols-4 lg:gap-8 lg:p-0"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      initial="initial"
      animate="animate"
    >
      {features.map(({ icon: Icon, title, description }, idx) => (
        <Card className="p-4 lg:p-6" key={idx}>
          <Icon className="mb-4 size-12 text-primary" />
          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </Card>
      ))}
    </motion.section>
  );
}
