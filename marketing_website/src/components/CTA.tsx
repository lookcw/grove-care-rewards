import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-secondary p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Care Delivery?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of care providers who've already simplified their workflows and improved patient outcomes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 shadow-xl"
                asChild
              >
                <a href="https://forms.gle/bB3YbSCANanEyaWk7" target="_blank" rel="noopener noreferrer">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
