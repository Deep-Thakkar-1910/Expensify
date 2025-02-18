"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { AccountType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

interface createAccountInput {
  name: string;
  type: AccountType;
  balance?: string | undefined;
  isDefault: boolean;
}

// action for creating a new account
export const createAccountAction = async (userData: createAccountInput) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    // Validate the balance amount entered by user
    if (isNaN(parseFloat(userData.balance as unknown as string)))
      throw new Error("Balance must be a number");

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

    let account;
    const isAccountCount0 = user?._count.userAccounts === 0;
    if (isAccountCount0) {
      // If the user has no accounts, create a default account
      account = await db.userAccount.create({
        data: {
          ...userData,
          name: userData.name.trim(),
          balance: parseFloat((userData.balance as unknown as string) ?? "0"),
          userId: session?.user.id,
          isDefault: true,
        },
      });
    } else if (userData.isDefault) {
      // If the user has at least one account, keep the isDefault flag as requested by user and make all the other accounts non-default
      [, account] = await db.$transaction([
        db.userAccount.updateMany({
          where: {
            userId: session.user.id,
          },
          data: {
            isDefault: false,
          },
        }),
        db.userAccount.create({
          data: {
            ...userData,
            name: userData.name.trim(),
            balance: parseFloat((userData.balance as unknown as string) ?? "0"),
            userId: session?.user.id,
          },
        }),
      ]);
      console.log(account);
    } else {
      account = await db.userAccount.create({
        data: {
          ...userData,
          name: userData.name.trim(),
          balance: parseFloat((userData.balance as unknown as string) ?? "0"),
          userId: session?.user.id,
        },
      });
    }

    // serealize the account to send it back to the client
    account = {
      ...account,
      balance: account.balance.toNumber(),
    };

    revalidatePath("/dashboard");

    // Return the account when it is created successfully
    return { success: true, account };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
      return { succes: false, error: "Account with this name already exists." };
    } else if (err instanceof Error) {
      console.error(err.stack);
      return { success: false, error: err.message };
    } else {
      return { sucess: false, error: "Internal Server Error" };
    }
  }
};

// action for getting all the accounts
export const getUserAccounts = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const userAccounts = await db.userAccount.findMany({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });
    const serealizedAccounts = userAccounts?.map((account) => ({
      ...account,
      balance: account.balance.toNumber(),
    }));

    return {
      success: true,
      userAccounts: serealizedAccounts,
    };
  } catch (err) {
    if (err instanceof Error || err instanceof PrismaClientKnownRequestError) {
      console.log(err.stack);
      return { success: false, error: err.message };
    } else {
      return { success: false, error: "Something Went Wrong." };
    }
  }
};
