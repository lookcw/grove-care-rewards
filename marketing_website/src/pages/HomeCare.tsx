import Header from "@/components/Header";
import HomeCareHero from "@/components/HomeCareHero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import HomeCareFooter from "@/components/HomeCareFooter";

const HomeCare = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HomeCareHero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <HomeCareFooter />
    </div>
  );
};

export default HomeCare;
