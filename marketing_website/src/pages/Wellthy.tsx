import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import FocusAreas from "@/components/FocusAreas";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Wellthy = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <FocusAreas />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Wellthy;
