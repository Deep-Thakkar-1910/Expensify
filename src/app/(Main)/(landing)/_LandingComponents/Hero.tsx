"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <main className="mx-auto max-w-screen-xl px-4 py-14 pt-20 lg:py-28">
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-4xl font-bold text-transparent md:text-4xl lg:text-6xl">
          Transform Your Expenses into Insights with AI
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Harness the power of artificial intelligence to automatically track,
          categorize, and optimize your expenses. Say goodbye to manual entry
          and hello to smart financial management.
        </p>
        <Button size="lg" className="gap-2" asChild>
          <Link href={"/sign-in"}>
            Start for Free <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        className="relative mb-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/hero.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="mx-auto rounded-lg border shadow-2xl"
              priority
            />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
