"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const updateOrCreateBudget = async (amount: number) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        id: session?.user.id,
      },
      include: {
        _count: {
          select: {
            userAccounts: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    const result = await db.budget.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        amount,
      },
      create: {
        userId: session.user.id,
        amount,
      },
    });

    if (result.id) {
      revalidatePath("/dashboard");
      return {
        success: true,
        budget: { ...result, amount: result.amount.toNumber() },
      };
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};

export const getCurrentBudgetWithExpenses = async (userAccountId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        id: session?.user.id,
      },
      include: {
        _count: {
          select: {
            userAccounts: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    // retreiving the budget for an account
    const budget = await db.budget.findFirst({
      where: { userId: session.user.id },
      select: {
        amount: true,
      },
    });

    // creating this month's startDate and endDate
    const now = new Date();
    const nowMonth = now.getMonth();
    const nowYear = now.getFullYear();
    const startDate = new Date(nowYear, nowMonth, 1);
    const endDate = new Date(nowYear, nowMonth + 1, 0);

    //getting the sum of all the transactions for this month
    const transactionSum = await db.transaction.aggregate({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
        userAccountId,
        type: {
          not: {
            equals: "INCOME",
          },
        },
      },
      _sum: {
        amount: true,
      },
    });

    const initialBudget = budget
      ? { ...budget, amount: budget.amount.toNumber() }
      : null;
    const currentExpenses = transactionSum._sum.amount?.toNumber() ?? 0;
    console.log("current expenses and budget", currentExpenses, initialBudget);
    return { success: true, initialBudget, currentExpenses };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};
