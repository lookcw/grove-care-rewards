import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, ArrowLeft, Building2, User, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const ReferralDemos = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Grove Health</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/team">
                Team
              </Link>
            </Button>
            <Button size="sm" asChild>
              <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Choose Your Demo Experience
              </h1>
              <p className="text-xl text-muted-foreground">
                See how Grove Health streamlines referral management for clinics and patients
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Clinic Demo Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Clinic Demo</h2>
                  <p className="text-muted-foreground mb-6">
                    For healthcare providers: see the clinic-facing workflow and dashboard for managing outbound referrals.
                  </p>
                  <Button variant="hero" size="lg" className="w-full group" asChild>
                    <a
                      href="https://grovehealth-referral-demo.lovable.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Launch Clinic Demo
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Patient Demo Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 text-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Patient Demo</h2>
                  <p className="text-muted-foreground mb-6">
                    See what the patient experience looks like when receiving referral reminders and guidance.
                  </p>
                  <Button variant="outline" size="lg" className="w-full group" asChild>
                    <a
                      href="https://grove-health-patient-experience.lovable.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Launch Patient Demo
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Want a personalized walkthrough?
              </p>
              <Button variant="hero" size="lg" asChild>
                <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                  Schedule a Live Demo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-primary">Grove Health</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/team" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Team
              </Link>
              <p className="text-sm text-muted-foreground">
                © 2025 Grove Health. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReferralDemos;
