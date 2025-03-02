import db from "@/lib/prisma";
import { inngest } from "./inggest-client";
import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "@/lib/emailTemplate";
export const budgetAlert = inngest.createFunction(
  {
    id: "Cron For Budget Alert",
  },
  {
    cron: "0 */6 * * *",
  },
  async ({ step }) => {
    const budgets = await step.run("check-budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              userAccounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });
    await step.run("", async () => {
      const startDate = new Date();
      startDate.setDate(1);
      for (const budget of budgets) {
        const defaultAccount = budget.user.userAccounts[0];
        const transactionSum = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            userAccountId: defaultAccount.id,
            date: {
              gte: startDate,
            },
            type: {
              not: {
                equals: "INCOME",
              },
            },
          },
          _sum: {
            amount: true,
          },
        });
        const currentExpense = transactionSum._sum.amount?.toNumber() || 0;
        const percentUsed = (currentExpense / parseFloat(budget.amount)) * 100;

        if (
          percentUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            body: EmailTemplate({
              type: "budget-alert",
              userName: defaultAccount.name,
              data: {
                percentUsed,
                budgetAmount: parseInt(budget.amount as string).toFixed(1),
                totalExpenses: parseInt(currentExpense.toString()).toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });

          await db.budget.update({
            where: {
              id: budget.id,
            },
            data: {
              lastAlertSent: new Date(),
            },
          });
        }
      }
    });
  },
);

const isNewMonth = (date1: Date, date2: Date) => {
  return (
    date1.getMonth() !== date2.getMonth() ||
    date1.getFullYear() !== date2.getFullYear()
  );
};
