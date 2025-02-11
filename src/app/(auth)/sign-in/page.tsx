import { Metadata } from "next";
import React from "react";
import AuthForm from "../_authComponents/AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};
const SignUpPage = () => {
  return (
    <section className="max-w-72 shrink-0 rounded-lg sm:max-w-96 md:max-w-lg lg:max-w-screen-sm">
      <AuthForm />
    </section>
  );
};

export default SignUpPage;
