import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import CreateAccountDrawer from "./CreateAccountDrawer";

import AccountCard from "./AccountCard";
import { UserAccount as PrismaUserAccount } from "@prisma/client";

interface UserAccount extends Omit<PrismaUserAccount, "balance"> {
  balance: number;
}

const AccountDisplay = async ({
  accounts,
}: {
  accounts: UserAccount[] | undefined;
}) => {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
      <CreateAccountDrawer>
        <Card className="flex cursor-pointer flex-col items-center justify-center p-4">
          <CardContent>
            <Plus className="size-16" />
          </CardContent>
          <CardDescription className="text-base font-medium text-primary lg:text-lg">
            Add New Account
          </CardDescription>
        </Card>
      </CreateAccountDrawer>
      {(accounts?.length as unknown as number) > 0 &&
        accounts?.map((account) => {
          return (
            <AccountCard
              key={account.id}
              account={{ ...account, balance: account.balance.toString() }}
            />
          );
        })}
    </div>
  );
};

export default AccountDisplay;
