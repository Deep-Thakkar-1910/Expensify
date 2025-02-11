"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import GoogleButton from "./GoogleButton";

export default function AuthForm() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-bold">Howdy!</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg p-6 lg:flex-row ">
          <GoogleButton />
        </div>
      </CardContent>
    </Card>
  );
}
