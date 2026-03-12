import { SplineHero } from "@/components/ui/spline-hero";
import { Features } from "@/components/landing/features";
import { CategoriesSection } from "@/components/sections/categories-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Cta } from "@/components/landing/cta";
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <SplineHero />
      <Features />
      <CategoriesSection />
      <HowItWorks />
      <Cta />
      <FooterSection />
    </main>
  );
}
