"use server";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { headers } from "next/headers";

export const CreateTransaction = async (transactionData: any) => {
  // explicit any to avoid type errors for prisma query data
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    if (!transactionData) throw new Error("Transaction data is required");

    const [transaction] = await db.$transaction([
      db.transaction.create({
        data: {
          ...transactionData,
          userId: session.user.id,
          nextRecurring: calucalateNextTransactionDate(
            new Date(transactionData.date),
            transactionData.recurringInterval,
          ),
        },
      }),
      db.userAccount.update({
        where: {
          id: transactionData.userAccountId,
        },
        data: {
          balance: {
            increment:
              transactionData.type === "INCOME"
                ? transactionData.amount
                : -transactionData.amount,
          },
        },
      }),
    ]);
    revalidatePath("/dashboard");
    revalidatePath(`/account/${transactionData.userAccountId}`);
    return {
      success: true,
      transaction: { ...transaction, amount: transaction.amount.toNumber() },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};

const calucalateNextTransactionDate = (
  date: Date,
  reccuringType: string | null,
): Date => {
  switch (reccuringType) {
    case "DAILY":
      return new Date(date.setDate(date.getDate() + 1));
    case "WEEKLY":
      return new Date(date.setDate(date.getDate() + 7));
    case "MONTHLY":
      return new Date(date.setMonth(date.getMonth() + 1));
    default:
      return date;
  }
};

export const GetInitialTransaction = async (transactionId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
    });

    return {
      success: true,
      transaction: { ...transaction, amount: transaction?.amount?.toNumber() },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};

export const UpdateTransaction = async (
  transactionId: string,
  transactionData: any,
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    if (!transactionData) throw new Error("Transaction data is required");

    const [transaction] = await db.$transaction([
      db.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          ...transactionData,
          nextRecurring: calucalateNextTransactionDate(
            new Date(transactionData.date),
            transactionData.recurringInterval,
          ),
        },
      }),
      db.userAccount.update({
        where: {
          id: transactionData.userAccountId,
        },
        data: {
          balance: {
            increment:
              transactionData.type === "INCOME"
                ? transactionData.amount
                : -transactionData.amount,
          },
        },
      }),
    ]);
    revalidatePath("/dashboard");
    revalidatePath(`/account/${transactionData.userAccountId}`);
    return {
      success: true,
      transaction: { ...transaction, amount: transaction.amount.toNumber() },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};
