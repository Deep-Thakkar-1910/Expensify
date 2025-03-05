import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface EmailDataProps {
  userName: string;
  type: "monthly-report" | "budget-alert";
  redirectUrl: string | undefined;
  data: Record<string, any>;
}

export default function EmailTemplate({
  userName = "Alex",
  type = "monthly-report",
  redirectUrl,
  data,
}: EmailDataProps) {
  // Calculate remaining budget and savings
  const remaining =
    type === "budget-alert"
      ? data?.budgetAmount - data?.totalExpenses
      : data?.stats.totalIncome - data?.stats.totalExpenses;

  // Determine if we're over budget for styling
  const isOverBudget = type === "budget-alert" && remaining < 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Html>
      <Head>
        <title>
          {type === "monthly-report"
            ? "Monthly Financial Report"
            : "Budget Alert"}
        </title>
        <style>
          {`
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                padding: 10px !important;
              }
              .header {
                padding: 20px 10px !important;
              }
              .content {
                padding: 20px 10px !important;
              }
              .stats-container {
                padding: 15px !important;
              }
              .stat-column {
                display: block !important;
                width: 100% !important;
                margin-bottom: 15px !important;
              }
              .heading {
                font-size: 22px !important;
              }
              .subheading {
                font-size: 18px !important;
              }
            }
          `}
        </style>
      </Head>
      <Preview>
        {type === "monthly-report"
          ? `Your Monthly Financial Report for ${data?.month}`
          : `Budget Alert: ${data?.percentUsed.toFixed(1)}% of budget used`}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container} className="container">
          {/* Header */}
          <Section style={styles.header} className="header">
            <Row>
              <Column>
                <Text style={styles.logoText}>Expensify</Text>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={styles.content} className="content">
            {/* Title Section */}
            <Row>
              <Column>
                <Heading style={styles.heading} className="heading">
                  {type === "monthly-report"
                    ? `Financial Report: ${data?.month}`
                    : "Budget Alert"}
                </Heading>
                <Text style={styles.greeting}>Hello {userName},</Text>
                <Text style={styles.intro}>
                  {type === "monthly-report"
                    ? `Here's your financial summary for ${data?.month}:`
                    : `You've used ${data?.percentUsed.toFixed(1)}% of your monthly budget.`}
                </Text>
              </Column>
            </Row>

            {/* Stats Overview */}
            <Section style={styles.statsContainer} className="stats-container">
              <Row>
                <Column style={styles.statColumn} className="stat-column">
                  <Section style={styles.stat}>
                    <Text style={styles.emojiIcon}>💰</Text>
                    <Text style={styles.statLabel}>
                      {type === "monthly-report"
                        ? "Total Income"
                        : "Budget Amount"}
                    </Text>
                    <Text style={styles.statValue}>
                      {formatCurrency(
                        type === "monthly-report"
                          ? data?.stats.totalIncome
                          : data?.budgetAmount,
                      )}
                    </Text>
                  </Section>
                </Column>
                <Column style={styles.statColumn} className="stat-column">
                  <Section style={styles.stat}>
                    <Text style={styles.emojiIcon}>💳</Text>
                    <Text style={styles.statLabel}>
                      {type === "monthly-report"
                        ? "Total Expenses"
                        : "Spent So Far"}
                    </Text>
                    <Text style={styles.statValue}>
                      {formatCurrency(
                        type === "monthly-report"
                          ? data?.stats.totalExpenses
                          : data?.totalExpenses,
                      )}
                    </Text>
                  </Section>
                </Column>
                <Column style={styles.statColumn} className="stat-column">
                  <Section style={styles.stat}>
                    <Text style={styles.emojiIcon}>
                      {isOverBudget ? "⚠️" : "🐷"}
                    </Text>
                    <Text style={styles.statLabel}>
                      {type === "monthly-report" ? "Net Savings" : "Remaining"}
                    </Text>
                    <Text
                      style={{
                        ...styles.statValue,
                        color: isOverBudget
                          ? "#e53e3e"
                          : remaining > 0
                            ? "#38a169"
                            : "#718096",
                      }}
                    >
                      {formatCurrency(remaining)}
                    </Text>
                  </Section>
                </Column>
              </Row>
            </Section>

            {/* Monthly Report Specific Content */}
            {type === "monthly-report" && data?.stats?.byCategory && (
              <Section style={styles.categorySection}>
                <Heading style={styles.subheading} className="subheading">
                  Expenses by Category
                </Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount], index) => (
                    <Row
                      key={index}
                      style={
                        index <
                        Object.entries(data?.stats.byCategory).length - 1
                          ? styles.categoryRow
                          : {}
                      }
                    >
                      <Column>
                        <Text style={styles.categoryName}>{category}</Text>
                      </Column>
                      <Column style={styles.amountColumn}>
                        <Text style={styles.categoryAmount}>
                          {formatCurrency(amount as number)}
                        </Text>
                      </Column>
                    </Row>
                  ),
                )}
              </Section>
            )}

            {/* Insights Section */}
            {type === "monthly-report" && data?.insights && (
              <Section style={styles.insightsSection}>
                <Heading style={styles.subheading} className="subheading">
                  Expensify Insights
                </Heading>
                {data.insights.map((insight: string, index: number) => (
                  <Row key={index} style={styles.insightRow}>
                    <Column style={styles.bulletColumn}>
                      <Text style={styles.bullet}>•</Text>
                    </Column>
                    <Column>
                      <Text style={styles.insightText}>{insight}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {/* Budget Alert Specific Content */}
            {type === "budget-alert" && (
              <Section style={styles.alertSection}>
                <Text style={styles.alertText}>
                  {isOverBudget
                    ? "You've exceeded your monthly budget. Consider reviewing your expenses to get back on track."
                    : data?.percentUsed > 90
                      ? "You're close to your budget limit. Consider reducing expenses for the rest of the month."
                      : "You're managing your budget well. Keep it up!"}
                </Text>

                {/* Budget Progress Bar */}
                <Section style={styles.progressBarContainer}>
                  <Section
                    style={{
                      ...styles.progressBar,
                      width: `${Math.min(data?.percentUsed, 100)}%`,
                      backgroundColor:
                        data?.percentUsed > 90
                          ? "#f56565"
                          : data?.percentUsed > 75
                            ? "#ed8936"
                            : "#48bb78",
                    }}
                  />
                </Section>
                <Text style={styles.progressText}>
                  {data?.percentUsed.toFixed(1)}% of budget used
                </Text>
              </Section>
            )}

            {/* Call to Action */}
            {type === "budget-alert" && (
              <Section style={styles.ctaSection}>
                <Link href={`${redirectUrl}`} style={styles.ctaButton}>
                  View Full Details
                </Link>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Hr style={styles.divider} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Expensify - Track, Save, and Spend Smarter!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f8fafc",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: "0",
    padding: "0",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  header: {
    backgroundColor: "#4f46e5",
    padding: "30px 40px",
    textAlign: "center" as const,
  },
  logoText: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "700",
    margin: "0",
    letterSpacing: "-0.5px",
  },
  content: {
    padding: "40px",
  },
  heading: {
    color: "#1e293b",
    fontSize: "26px",
    fontWeight: "700",
    margin: "0 0 20px",
    lineHeight: "1.3",
  },
  subheading: {
    color: "#334155",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 15px",
  },
  greeting: {
    color: "#334155",
    fontSize: "18px",
    margin: "0 0 10px",
    fontWeight: "500",
  },
  intro: {
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 25px",
  },
  statsContainer: {
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    padding: "25px",
    marginBottom: "30px",
  },
  statColumn: {
    width: "33.33%",
    padding: "0 10px",
  },
  stat: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center" as const,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  statIcon: {
    margin: "0 auto 10px",
    display: "block",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0 0 5px",
    fontWeight: "500",
  },
  statValue: {
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0",
  },
  categorySection: {
    marginBottom: "30px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "20px",
  },
  categoryRow: {
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  categoryName: {
    color: "#334155",
    fontSize: "16px",
    margin: "0",
    fontWeight: "500",
  },
  amountColumn: {
    textAlign: "right" as const,
  },
  categoryAmount: {
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0",
  },
  insightsSection: {
    marginBottom: "30px",
    backgroundColor: "#f0f9ff",
    borderRadius: "8px",
    padding: "20px",
  },
  insightRow: {
    marginBottom: "10px",
  },
  bulletColumn: {
    width: "20px",
  },
  bullet: {
    color: "#4f46e5",
    fontSize: "18px",
    margin: "0",
    fontWeight: "bold",
  },
  insightText: {
    color: "#334155",
    fontSize: "16px",
    margin: "0",
    lineHeight: "1.5",
  },
  alertSection: {
    marginBottom: "30px",
    backgroundColor: "#fef2f2",
    borderRadius: "8px",
    padding: "20px",
  },
  alertText: {
    color: "#334155",
    fontSize: "16px",
    margin: "0 0 15px",
    lineHeight: "1.5",
  },
  progressBarContainer: {
    height: "10px",
    backgroundColor: "#e2e8f0",
    borderRadius: "5px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressBar: {
    height: "10px",
    borderRadius: "5px",
  },
  progressText: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0",
    textAlign: "right" as const,
  },
  ctaSection: {
    textAlign: "center" as const,
    marginTop: "30px",
  },
  ctaButton: {
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    display: "inline-block",
  },
  divider: {
    borderColor: "#e2e8f0",
    margin: "0",
  },
  footer: {
    padding: "20px 40px 30px",
    textAlign: "center" as const,
  },
  footerText: {
    color: "#64748b",
    fontSize: "16px",
    margin: "0 0 15px",
    fontWeight: "500",
  },
  emojiIcon: {
    fontSize: "24px",
    lineHeight: "1",
    margin: "0 auto 10px",
    display: "block",
    textAlign: "center" as const,
  },
};
