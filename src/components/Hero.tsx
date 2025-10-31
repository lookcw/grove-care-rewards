import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroImage from "@/assets/hero-healthcare.jpg";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Making Caregiving Easier
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Empower your caregivers with a simple, organized system that makes tracking patient needs effortless. 
              Never miss a detail again.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground">Real-time updates across your team</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground">Reduce errors and improve care quality</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground">HIPAA compliant and secure</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="lg" asChild>
                <a href="https://forms.gle/bB3YbSCANanEyaWk7" target="_blank" rel="noopener noreferrer">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
            <img 
              src={heroImage} 
              alt="Healthcare professional reviewing patient records"
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
