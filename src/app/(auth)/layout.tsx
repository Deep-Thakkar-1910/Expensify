import React from "react";
import FloatingBalls from "@/components/ui/FloatingBalls";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 md:p-24">
      <div className="relative z-10 flex w-full shrink-0 flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Expensify</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track, Save, and Spend Smarter!
          </p>
        </div>
        {children}
      </div>
      <FloatingBalls />
    </main>
  );
}
