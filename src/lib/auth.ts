import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "consent",
    },
  },
});
