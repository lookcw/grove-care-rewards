import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, Clock, Eye, Scale, ArrowRight, Stethoscope, Activity, Home, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroDoctorImage from "@/assets/hero-doctor-2.svg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Grove Health</span>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" asChild>
              <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background pt-20 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  <HeartPulse className="h-4 w-4 mr-2" />
                  Helping Care Teams
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Simplifying{" "}
                <span className="text-primary">Post-Op and Post-Discharge Follow-Up</span>
              </h1>

              <div className="text-lg lg:text-xl text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Grove Health builds AI tools that make it effortless for providers to track patient recovery, catch complications early, and reduce the manual work that happens after discharge or surgery.
                </p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Automates structured check-ins via text or voice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Flags responses that need nurse or coordinator review</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Reduces time spent on routine follow-up calls</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Gives every patient timely, personalized guidance at home</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="hero" size="lg" className="group" asChild>
                  <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                    Get In Touch With Us
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative lg:h-[700px] xl:h-[800px] flex items-center justify-center">
              <div className="rounded-2xl overflow-hidden shadow-lg w-full">
                <img
                  src={heroDoctorImage}
                  alt="Healthcare provider conducting patient checkup"
                  className="w-full h-full object-contain scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground">
              Our tools make recovery follow-up more efficient and less stressful for both patients and care teams. Today, nurses and coordinators spend hours making routine calls after surgery or discharge — asking about pain, wound care, and meds — just to make sure nothing's going wrong. We automate those check-ins so clinicians can focus on the cases that actually need attention, while every patient gets timely, personalized guidance at home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Efficiency for Care Teams</h3>
                <p className="text-muted-foreground">
                  We take the repetitive work out of follow-up by automating outreach, logging responses, and flagging what needs review, so staff spend more time on care, not phone calls.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Better Recovery Visibility</h3>
                <p className="text-muted-foreground">
                  Structured digital check-ins surface early warning signs like pain, swelling, and missed meds, before they escalate into complications or readmissions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scale className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Sustainable Care Delivery</h3>
                <p className="text-muted-foreground">
                By improving how patients and providers stay connected after discharge, we make high-quality recovery care scalable for any clinic, hospital, or home health team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Focus Areas</h2>
            <p className="text-xl text-muted-foreground">
              We help clinical teams automate and manage the follow-up work that happens after surgery or discharge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link to="/post-surgical-care" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Stethoscope className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Recovery Outreach & Check-Ins
                  </h3>
                  <p className="text-muted-foreground">
                    Automates post-op and post-discharge follow-ups to replace routine calls with structured text or voice check-ins by tracking pain, wounds, and meds, and alerting staff when something looks off.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/pt-adherence" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Patient Message Management
                  </h3>
                  <p className="text-muted-foreground">
                    Streamlines how teams handle incoming messages from recovering patients — summarizing updates, flagging urgent concerns, and routing them to the right clinician.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/home-care" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Care Coordination Across Settings
                  </h3>
                  <p className="text-muted-foreground">
                    Bridges communication between hospitals, clinics, and home-health teams so patients stay connected instead of falling through the cracks after discharge.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Save Staff Time, Without Sacrificing Patient Care.
            </h2>
            <p className="text-xl text-muted-foreground">
              We're partnering with care teams to reduce the time and cost of recovery communication while keeping patients supported.
              <br className="hidden sm:block" />
              <span className="block sm:inline"> If your clinicians spend hours on manual follow-up calls, we'd love to chat. Reach out today!</span>
            </p>
            <Button variant="hero" size="lg" className="group" asChild>
              <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
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

export default Index;
