import { getUserAccounts } from "@/actions/Dashboard";
import { defaultCategories } from "@/data/Category";
import { Metadata } from "next";
import TransactionForm from "../_transactionComponents/TransactionForm";
import { GetInitialTransaction } from "@/actions/Transaction";

export const metadata: Metadata = {
  title: "Transaction",
  description: "Add a new transaction",
};

const CreateTransactionPage = async ({
  searchParams,
}: {
  searchParams: { edit: string };
}) => {
  const { edit } = await searchParams;
  const editMode = !!edit;
  const accounts = await getUserAccounts();
  let initialData;
  if (editMode) {
    initialData = await GetInitialTransaction(edit);
  }
  return (
    <div className="flex w-full flex-col items-center justify-center px-5 pt-20 lg:pt-28">
      <h1 className="mb-4 place-self-start bg-gradient-to-r from-fuchsia-700 to-blue-600 bg-clip-text text-4xl font-bold text-transparent lg:text-6xl">
        Add Transaction
      </h1>
      <TransactionForm
        accounts={accounts?.userAccounts || []}
        defaultCategories={defaultCategories}
        editMode={editMode}
        initialData={initialData?.transaction}
        transactionId={edit}
      />
    </div>
  );
};

export default CreateTransactionPage;
