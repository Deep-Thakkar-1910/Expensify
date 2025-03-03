import { getUserAccounts } from "@/actions/Dashboard";
import { defaultCategories } from "@/data/Category";
import { Metadata } from "next";
import TransactionForm from "../_transactionComponents/TransactionForm";

export const metadata: Metadata = {
  title: "Transaction",
  description: "Add a new transaction",
};

const CreateTransactionPage = async () => {
  const accounts = await getUserAccounts();

  return (
    <div className="flex w-full flex-col items-center justify-center px-5 pt-20 lg:pt-28">
      <h1 className="mb-4 place-self-start bg-gradient-to-r from-fuchsia-700 to-blue-600 bg-clip-text text-4xl font-bold text-transparent lg:text-6xl">
        Add Transaction
      </h1>
      <TransactionForm
        accounts={accounts?.userAccounts || []}
        defaultCategories={defaultCategories}
      />
    </div>
  );
};

export default CreateTransactionPage;
