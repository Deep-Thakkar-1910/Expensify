import * as z from "zod";

export const accountFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Account name must be at least 2 characters long" }),
    balance: z.string().min(1, "Enter an initial balance amount"),
    type: z.enum(["CURRENT", "SAVINGS", "INVESTMENT"]),
    isDefault: z.boolean(),
  })
  .refine((check) => !isNaN(parseFloat(check.balance)), {
    message: "Please enter a valid balance amount",
    path: ["balance"],
  });
