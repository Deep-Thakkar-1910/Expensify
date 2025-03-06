import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AccountDisplay from "./_dashboardComponents/Display/Account/AccountDisplay";
import { BudgetProgress } from "./_dashboardComponents/Display/Budget/BudgetProgress";
import { getUserAccounts } from "@/actions/Dashboard";
import { getCurrentBudgetWithExpenses } from "@/actions/Budget";
import { TransactionOverview } from "./_dashboardComponents/Display/Transaction/TransactionOverview";
import { getAllTransactions } from "@/actions/Transaction";

const DahboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getAllTransactions(),
  ]);
  const defaultAccount = accounts?.userAccounts?.find(
    (acc) => acc.isDefault,
  )?.id;

  if (!accounts.success) {
    notFound();
  }

  const { initialBudget, currentExpenses } = await getCurrentBudgetWithExpenses(
    defaultAccount!,
  );

  return (
    <>
      <section className="flex size-full min-h-[100dvh] flex-col items-start justify-start gap-y-4 bg-gradient-to-br from-gray-200 to-white/80 px-8 pb-4 pt-20 text-black lg:gap-y-8 lg:px-12 lg:pt-28">
        <h1 className="gradient-bg text-4xl font-bold text-transparent drop-shadow-md md:text-4xl lg:text-6xl">
          Dashboard
        </h1>
        <BudgetProgress
          initialBudget={initialBudget}
          currentExpenses={currentExpenses}
        />
        {accounts.userAccounts && (
          <TransactionOverview
            accounts={accounts.userAccounts}
            transactions={transactions.map((transaction) => ({
              ...transaction,
              amount: transaction.amount.toString(),
            }))}
          />
        )}
        <AccountDisplay accounts={accounts.userAccounts} />
      </section>
    </>
  );
};

export default DahboardPage;
