import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ImpactSection from "@/components/landing/ImpactSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <PainPointsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ImpactSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
