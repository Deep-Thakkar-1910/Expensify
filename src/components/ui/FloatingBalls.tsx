"use client";

import { motion } from "motion/react";

export default function FloatingBalls() {
  const balls = [
    { x: "0%", y: "0%", size: 300, color: "bg-red-500" },
    { x: "100%", y: "0%", size: 200, color: "bg-blue-500" },
    { x: "50%", y: "100%", size: 250, color: "bg-green-500" },
    { x: "80%", y: "50%", size: 180, color: "bg-yellow-500" },
    { x: "20%", y: "60%", size: 220, color: "bg-purple-500" },
  ];
  return (
    <>
      {balls.map((ball, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${ball.color} opacity-30 blur-3xl dark:opacity-20`}
          style={{
            left: ball.x,
            top: ball.y,
            width: ball.size,
            height: ball.size,
          }}
          animate={{
            x: [0, 10, -10, 0],
            y: [0, -10, 10, 0],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </>
  );
}
