import { HeartPulse } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Grove Health
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Making patient care clear and simple for caregivers everywhere.
          </p>
          <p className="text-sm text-muted-foreground">© 2024 Grove Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
