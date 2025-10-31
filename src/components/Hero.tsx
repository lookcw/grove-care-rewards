import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-healthcare.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(var(--gradient-hero))]">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block rounded-full bg-accent px-4 py-2">
              <span className="text-sm font-semibold text-accent-foreground">
                Trusted by forward-thinking SMBs
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
              Stop Rising Premiums.
              <span className="block text-primary mt-2">
                Start Rewarding Health.
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground lg:text-xl max-w-xl">
              Your healthcare premiums are increasing by hundreds of dollars every year. 
              We're stopping that in its tracks by paying your members to stay healthy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </div>
            
            <div className="flex gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">32%</div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2.8x</div>
                <div className="text-sm text-muted-foreground">Higher Engagement</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">94%</div>
                <div className="text-sm text-muted-foreground">Member Satisfaction</div>
              </div>
            </div>
          </div>
          
          <div className="relative lg:h-[600px]">
            <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-medium)]">
              <img
                src={heroImage}
                alt="Healthcare professionals collaborating"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
