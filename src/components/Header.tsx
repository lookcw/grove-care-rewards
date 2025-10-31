import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">
            Grove Health
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Button size="sm" asChild>
            <a href="https://forms.gle/bB3YbSCANanEyaWk7" target="_blank" rel="noopener noreferrer">
              Get Started
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
