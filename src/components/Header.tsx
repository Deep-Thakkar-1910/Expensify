"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  ArrowRight,
  LayoutDashboard,
  PiggyBank,
  ReceiptIndianRupee,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import AvatarDropdown from "./AvatarDropdown";

export default function Header() {
  const session = authClient.useSession();
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed z-50 w-full border-b border-border/40 bg-white/45 backdrop-blur-sm"
    >
      <nav className="mx-auto flex items-center justify-between px-4 py-4 lg:px-12 lg:py-6">
        <Link href="/" className="flex items-center gap-2">
          <PiggyBank className="size-8 text-primary" />
          <span className="text-xl font-bold lg:text-2xl">Expensify</span>
        </Link>
        <div className="flex gap-4">
          {session?.data?.user ? (
            <>
              <Button
                className="hidden items-center justify-center gap-2 lg:flex"
                asChild
              >
                <Link href={"/dashboard"}>
                  <LayoutDashboard /> Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                className="hidden items-center justify-center gap-2 lg:flex"
                asChild
              >
                <Link href={"/transaction"}>
                  <ReceiptIndianRupee />
                  Transaction
                </Link>
              </Button>
              {/* Mobile icons */}
              <Button className="rounded-md lg:hidden" asChild size={"icon"}>
                <Link href={"/dashboard"}>
                  <LayoutDashboard />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-md lg:hidden"
                asChild
                size={"icon"}
              >
                <Link href={"/transactions"}>
                  <ReceiptIndianRupee />
                </Link>
              </Button>
              <AvatarDropdown />
            </>
          ) : (
            <>
              <Button asChild>
                <Link
                  href={"/sign-in"}
                  className="hidden items-center justify-center gap-2 lg:flex"
                >
                  Get Started
                  <ArrowRight />
                </Link>
              </Button>
              {/* Mobile icon */}
              <Button asChild size={"sm"}>
                <Link
                  href={"/sign-in"}
                  className="flex items-center justify-center gap-2 lg:hidden"
                >
                  Get Started
                  <ArrowRight />
                </Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
