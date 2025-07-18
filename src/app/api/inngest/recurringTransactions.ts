import db from "@/lib/prisma";
import { inngest } from "./inggest-client";
import { calucalateNextTransactionDate } from "@/lib/utils";

// this function is for fetching the transactions which are recurring and need to be processed and sending the events
export const triggerReccurringTransactions = inngest.createFunction(
  {
    id: "trigger-reccurring-transactions",
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    const allTransactions = await step.run("getAllTransactions", async () => {
      // find all the transactions which are recurring and need to be processed
      return await db.transaction.findMany({
        where: {
          isRecurring: true,
          nextRecurring: {
            lte: new Date(),
          },
        },
      });
    });

    if (allTransactions.length > 0) {
      const events = allTransactions.map((transaction) => ({
        name: "process-recurring-transaction",
        data: { transactionId: transaction.id, userId: transaction.userId },
      }));
      await inngest.send(events);
    }
    return { tiggered: allTransactions.length };
  },
);

// this function is for processing the recurring transactions in batches
export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10,
      period: "60s",
      key: "event.data.userId",
    },
  },
  { event: "process-recurring-transaction" }, // to get the event data from triggerReccurringTransactions
  async ({ event, step }) => {
    if (!event.data.transactionId || !event.data.userId) {
      return { error: "Invalid event data" };
    }

    await step.run("getAndProcessTransaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
      });

      if (
        !transaction ||
        !transactionDue(transaction.lastProcessed, transaction.nextRecurring!)
      ) {
        return { error: "Transaction not found or past due" };
      }

      const balanceAmountIncrement =
        transaction?.type === "INCOME"
          ? transaction.amount.toNumber()
          : -transaction.amount.toNumber();

      await db.$transaction([
        // creating a new transaction based on parent(first recurring) transaction created.
        db.transaction.create({
          data: {
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            type: transaction.type,
            category: transaction.category,
            date: transaction.nextRecurring ?? new Date(),
            userId: transaction.userId,
            userAccountId: transaction.userAccountId,
            isRecurring: false,
          },
        }),

        // updating the balance of the user account
        db.userAccount.update({
          where: {
            id: transaction.userAccountId,
          },
          data: {
            balance: {
              increment: balanceAmountIncrement,
            },
          },
        }),

        // updating the parent transaction to set the lastProcessed and nextRecurring date
        db.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            lastProcessed: new Date(),
            nextRecurring: calucalateNextTransactionDate(
              new Date(),
              transaction.recurringInterval,
            ),
          },
        }),
      ]);
      return {
        success: true,
        message: `processed transaction of ${transaction.amount.toString()} for transaction${transaction.id}`,
      };
    });
  },
);

// this function is for checking that the transaction is due or not.
const transactionDue = (lastProcessed: Date | null, nextRecurring: Date) => {
  if (!lastProcessed) {
    // if the transaction has never been processed
    return true;
  }
  return new Date() >= nextRecurring; // if the transaction date is passed it will return true meaning the transaction is past due
};
