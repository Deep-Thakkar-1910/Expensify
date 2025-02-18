import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import CreateAccountDrawer from "./CreateAccountDrawer";
import { getUserAccounts } from "@/actions/Dashboard";
import AccountCard from "./AccountCard";

const AccountDisplay = async () => {
  const accounts = await getUserAccounts();
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
      {(accounts?.userAccounts?.length as unknown as number) > 0 &&
        accounts?.userAccounts?.map((account) => {
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
