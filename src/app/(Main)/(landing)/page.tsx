import Hero from "./_LandingComponents/Hero";
import Features from "./_LandingComponents/Features";
import Footer from "./_LandingComponents/Footer";
import Stats from "./_LandingComponents/Stats";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    return redirect("/dashboard");
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-accent">
        <Hero />
        <Features />
        <Stats />
        <Footer />
      </div>
    </>
  );
}
