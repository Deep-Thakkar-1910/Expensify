import { Metadata } from "next";
import React from "react";
import AuthForm from "../_authComponents/AuthForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};
const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) return redirect("/dashboard");

  return (
    <section className="max-w-72 shrink-0 rounded-lg sm:max-w-96 md:max-w-lg lg:max-w-screen-sm">
      <AuthForm />
    </section>
  );
};

export default SignInPage;
