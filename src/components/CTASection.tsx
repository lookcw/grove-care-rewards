import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(var(--gradient-primary))] p-12 lg:p-20 shadow-[var(--shadow-medium)]">
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold lg:text-5xl mb-6 text-primary-foreground">
              Ready to Transform Your Healthcare Costs?
            </h2>
            <p className="text-lg lg:text-xl mb-8 text-primary-foreground/90">
              Join the SMBs who are reducing costs, boosting productivity, and creating healthier workforces with grovehealth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="group bg-white hover:bg-white/90 text-primary"
              >
                Schedule a Demo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
