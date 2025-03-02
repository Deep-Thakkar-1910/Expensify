import { serve } from "inngest/next";
import { inngest } from "./inggest-client";
import { budgetAlert } from "./budgetAlert";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [budgetAlert],
});
