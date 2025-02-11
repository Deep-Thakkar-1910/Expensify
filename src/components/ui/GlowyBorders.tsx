"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface GlowyBorderProps {
  children: React.ReactNode;
}

export default function GlowyBorder({ children }: GlowyBorderProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className="relative w-full max-w-72 shrink-0 rounded-lg sm:max-w-96 md:max-w-lg lg:max-w-screen-sm"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-foreground via-red-500 to-primary opacity-75 blur-lg" />
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent-foreground via-red-500 to-primary"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2), transparent 40%)`,
        }}
      />
      <div className="relative rounded-lg bg-transparent">{children}</div>
    </motion.div>
  );
}
