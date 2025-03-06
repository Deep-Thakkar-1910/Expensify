# Expensify - Budget & Expense Tracking Web App

Expensify is a budget and expense tracking application designed to help users manage their finances effectively. It includes AI-powered receipt scanning, budget tracking with alerts, monthly spend analysis, and AI-generated financial insights via email.

## Features

- **AI Receipt Scanning**: Upload receipts and let AI extract expense details.
- **Budget Tracking & Alerts**: Set budgets and receive alerts when approaching limits.
- **Monthly Spend Analysis**: Gain insights into your spending habits.
- **AI Insights Report**: Get personalized financial insights sent via email.
- **Secure Authentication**: Powered by BetterAuth.
- **Event-driven Processing**: Uses Inngest for background task handling.
- **Optimized UI**: Built with TailwindCSS for a sleek and responsive design.

## Tech Stack

- **Frontend**: Next.js (App Router)
- **Backend**: Next.js server actions
- **Database**: Prisma with PostgreSQL
- **Authentication**: BetterAuth
- **Background Jobs**: Inngest
- **Styling**: TailwindCSS
- **Shield and bot protection + rate-limiting**: ArcJet
- **AI Features**: Google Gemini API
- **Language**: TypeScript

## Preconditions:

- Your machine should have nodejs version 20+ installed and bun installed.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/expensify.git
   cd expensify
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env.local`
   - Update the necessary environment variables such as database URL, authentication keys, and API keys.

4. Apply database migrations:

   ```sh
   bunx prisma migrate dev
   ```

5. Start the development server:

   ```sh
   bun dev
   ```

6. Open the app in your browser:
   ```
   http://localhost:3000
   ```
