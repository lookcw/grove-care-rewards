import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">grove</span>
            <span className="text-2xl font-bold">health</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#solution" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#focus" className="text-sm font-medium hover:text-primary transition-colors">
              Our Focus
            </a>
            <a href="#results" className="text-sm font-medium hover:text-primary transition-colors">
              Results
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
