import Header from "./_LandingComponents/Header";
import Hero from "./_LandingComponents/Hero";
import Features from "./_LandingComponents/Features";
import Footer from "./_LandingComponents/Footer";
import Stats from "./_LandingComponents/Stats";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <Header />
        <Hero />
        <Features />
        <Stats />
        <Footer />
      </div>
    </>
  );
}
