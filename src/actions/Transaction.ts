"use server";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { aj } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { headers } from "next/headers";
import { calucalateNextTransactionDate } from "@/lib/utils";

export const CreateTransaction = async (transactionData: any) => {
  // explicit any to avoid type errors for prisma query data
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    if (!transactionData) throw new Error("Transaction data is required");

    const req = await request();

    const decision = await aj.protect(req, { userId: session.user.id });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new Error("Too many requests,Please try again later!");
      }
    }

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

export const getAllTransactions = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const transactions = await db.transaction.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return transactions.map((transaction) => ({
      ...transaction,
      amount: transaction.amount.toNumber(),
    }));
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};
