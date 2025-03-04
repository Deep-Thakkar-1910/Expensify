import { serve } from "inngest/next";
import { inngest } from "./inggest-client";
import { budgetAlert } from "./budgetAlert";
import {
  processRecurringTransaction,
  triggerReccurringTransactions,
} from "./recurringTransactions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    budgetAlert,
    triggerReccurringTransactions,
    processRecurringTransaction,
  ],
});
