import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AccountDisplay from "./_dashboardComponents/Display/Account/AccountDisplay";
import { BudgetProgress } from "./_dashboardComponents/Display/Budget/BudgetProgress";
import { getUserAccounts } from "@/actions/Dashboard";
import { getCurrentBudgetWithExpenses } from "@/actions/Budget";

const DahboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  const accounts = await getUserAccounts();
  const defaultAccount = accounts?.userAccounts?.find(
    (acc) => acc.isDefault,
  )?.id;

  const { initialBudget, currentExpenses } = await getCurrentBudgetWithExpenses(
    defaultAccount!,
  );

  return (
    <>
      <section className="flex size-full h-[100dvh] flex-col items-start justify-start gap-y-4 bg-gradient-to-br from-gray-200 to-white/80 px-8 pt-20 text-black lg:gap-y-8 lg:px-12 lg:pt-28">
        <h1 className="bg-gradient-to-br from-fuchsia-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent drop-shadow-md md:text-4xl lg:text-6xl">
          Dashboard
        </h1>
        <BudgetProgress
          initialBudget={initialBudget}
          currentExpenses={currentExpenses}
        />
        <AccountDisplay accounts={accounts.userAccounts} />
      </section>
    </>
  );
};

export default DahboardPage;
