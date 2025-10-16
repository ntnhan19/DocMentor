// src/pages/public/HomePage.tsx
import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Hero from "../../features/homepage/components/Hero";
import Features from "../../features/homepage/components/Features";
//import Statistics from "../../features/homepage/components/Statistics";
import HowItWorks from "../../features/homepage/components/HowItWorks";
//import Testimonials from "../../features/homepage/components/Testimonials";
import FAQ from "../../features/homepage/components/FAQ";
import CallToAction from "../../features/homepage/components/CallToAction";

const HomePage: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#0a0118] text-white overflow-x-hidden">
      {/* Header full width */}
      <Header />

      {/* Main content full width */}
      <main className="flex-1 w-full">
        <section className="w-full">
          <Hero />
        </section>

        <section className="w-full">
          <Features />
        </section>

        <section className="w-full">
          <HowItWorks />
        </section>

        <section className="w-full">
          <FAQ />
        </section>

        <section className="w-full">
          <CallToAction />
        </section>
      </main>

      {/* Footer full width */}
      <Footer />
    </div>
  );
};

export default HomePage;
