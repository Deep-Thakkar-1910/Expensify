"use server";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const updateDefaultAccount = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const [, updatedAccount] = await db.$transaction([
      db.userAccount.updateMany({
        where: { userId: session.user.id },
        data: {
          isDefault: false,
        },
      }),
      db.userAccount.update({
        where: { id },
        data: {
          isDefault: true,
        },
      }),
    ]);

    revalidatePath("/dashboard");
    return {
      success: true,
      account: {
        ...updatedAccount,
        balance: updatedAccount.balance.toNumber(),
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};

export const getUserAccountWithTransactions = async (accountId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const account = await db.userAccount.findUnique({
      where: { id: accountId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!account) throw new Error("Account not found");

    return {
      ...account,
      balance: account.balance.toNumber(),
      transactions: account.transactions.map((t) => ({
        ...t,
        amount: t.amount.toNumber(),
      })),
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};

export const bulkDeleteTransactions = async (ids: string[]) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const transactions = await db.transaction.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        userAccountId: true,
        amount: true,
        type: true,
      },
    });

    if (transactions.length === 0) throw new Error("No transactions found");

    const ammountToChange = transactions.reduce((acc: number, curr) => {
      const value = curr.amount.toNumber();
      return curr.type === "INCOME" ? acc - value : acc + value;
    }, 0);

    console.log("ammountToChange", ammountToChange);

    const [deleted] = await db.$transaction([
      db.transaction.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      }),

      db.userAccount.update({
        where: {
          id: transactions[0].userAccountId,
        },
        data: {
          balance: {
            increment: ammountToChange,
          },
        },
      }),
    ]);

    if (deleted.count === ids.length) {
      revalidatePath("/dashboard");
      revalidatePath(`/account/${session.user.id}`);
      return { success: true };
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};
