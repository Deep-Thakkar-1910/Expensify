import db from "@/lib/prisma";
import { inngest } from "./inggest-client";
import { Transaction } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendEmail } from "@/actions/send-email";
import EmailTemplate from "../../../../emails/emailTemplate";

export const generateMonthlyReports = inngest.createFunction(
  { id: "generate-monthly-reports", name: "Generate Monthly Reports" },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    try {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const users = await step.run("getting-all-users", async () => {
        return await db.user.findMany({});
      });

      for (const user of users) {
        await step.run(`generate-report-for-${user.email}`, async () => {
          try {
            // generating the report for a user.

            const stats = await getMonthlyStats(user.id, lastMonth);

            // getting the insights using gemini ai

            const lastFullMonth = lastMonth.toLocaleString("default", {
              month: "long",
            });

            const insights = await getAiInsights(stats, lastFullMonth);

            // sending the email report to the user
            await sendEmail({
              to: user.email,
              subject: `Monthly Report for ${lastFullMonth}`,
              body: EmailTemplate({
                userName: user.name,
                type: "monthly-report",
                redirectUrl: undefined,
                data: {
                  stats,
                  insights,
                  month: `${lastFullMonth} ${lastMonth.getFullYear()}`,
                },
              }),
            });

            return {
              success: true,
              message: `Monthly report generated and sent to ${user.email} `,
            };
          } catch (err) {
            if (err instanceof Error) {
              console.error(err.stack);
            }
            return {
              success: false,
              message: `Failed to generate monthly report for ${user.email}`,
            };
          }
        });
      }
      return { processed: users.length };
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.stack);
      }
      return { error: "Failed to generate monthly reports" };
    }
  },
);

// getting the stats for the last month
interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  byCategory: Record<string, number>;
  transactions: number;
}

const getMonthlyStats = async (
  userId: string,
  lastMonth: Date,
): Promise<MonthlyStats> => {
  const previousMonthStart = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth(),
    1,
  );
  const previousMonthEnd = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth() + 1,
    0,
  );
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd,
      },
    },
  });

  return transactions.reduce(
    (acc: MonthlyStats, transaction: Transaction) => {
      if (transaction.type === "EXPENSE") {
        acc.totalExpenses += transaction.amount.toNumber(); // adding the expense amount to the total expenses

        acc.byCategory[transaction.category] =
          (acc.byCategory[transaction.category] || 0) +
          transaction.amount.toNumber(); // adding the expense amount to the category
      } else {
        acc.totalIncome += transaction.amount.toNumber(); // adding the income amount to the total income
      }
      return acc;
    },
    {
      totalIncome: 0,
      totalExpenses: 0,
      byCategory: {},
      transactions: transactions.length,
    },
  );
};

//getting the insights using gemini ai
const getAiInsights = async (
  stats: MonthlyStats,
  lastFullMonth: string,
): Promise<string[]> => {
  try {
    const ai = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
    );

    const model = await ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${lastFullMonth}:
    - Total Income: ₹${stats.totalIncome}
    - Total Expenses: ₹${stats.totalExpenses}
    - Net Income: ₹${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    }
    // return generic insights if there is an error in generating insights using gemini api
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
};
