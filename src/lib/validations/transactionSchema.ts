import * as z from "zod";

export const transactionSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
  type: z
    .enum(["INCOME", "EXPENSE"])
    .refine((value) => value === "INCOME" || value === "EXPENSE", {
      message: "Type is required",
    }),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  userAccountId: z.string(),
  isRecurring: z.boolean(),
  recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
});

export type TransactionSchemaType = z.infer<typeof transactionSchema>;
