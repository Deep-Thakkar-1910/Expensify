"use server";
import { ReactNode } from "react";
import { Resend } from "resend";

interface sendEmailProps {
  to: string;
  subject: string;
  body: ReactNode;
}
export const sendEmail = async ({ to, subject, body }: sendEmailProps) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);

    const { data, error } = await resend.emails.send({
      from: "Expensify <onboarding@resend.dev>",
      to,
      subject,
      react: body,
    });

    if (error) throw error;
    else return data;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
    throw err;
  }
};
