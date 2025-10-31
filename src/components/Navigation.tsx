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
          
          <Button size="sm" asChild>
            <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
              Get Started
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
