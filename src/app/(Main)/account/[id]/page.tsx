import { Suspense } from "react";
import { getUserAccountWithTransactions } from "@/actions/Account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/TransactionsTable";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/AccountChart";

export default async function AccountPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const accountData = await getUserAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="mx-auto max-w-screen-xl space-y-8 px-5 pb-10 pt-20 lg:pt-28">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="gradient-bg text-5xl font-bold capitalize tracking-tight text-transparent sm:text-6xl">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="pb-2 text-right">
          <div className="text-xl font-bold sm:text-2xl">
            &#8377;{parseFloat(account.balance.toString()).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
