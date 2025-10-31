import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertCircle, TrendingDown, Users, Clock, Shield, HeartPulse, CheckCircle } from "lucide-react";

const PostSurgicalCare = () => {
  const CALENDLY_URL = "https://calendly.com/adedoyin-olagbegi/15min?month=2025-11";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">
              Grove Health
            </span>
          </a>

          <div className="flex items-center gap-3">
            <Button size="sm" asChild>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                Schedule Chat
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden pt-20">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                For Specialty Surgical & Rehab Clinics
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Reduce Readmissions,
              <span className="block text-primary mt-2">
                Improve Post-Op Adherence
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Helping orthopedic, bariatric surgery, joint-replacement, and outpatient surgery centers
              keep patients on track after discharge — without consuming valuable staff time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="xl"
                variant="hero"
                onClick={() => window.open(CALENDLY_URL, '_blank')}
                className="group"
              >
                Schedule 15-Minute Chat
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Join a small group of clinics getting early access
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">The Post-Discharge Challenge</h2>
            <p className="text-xl text-muted-foreground">
              High-volume surgical clinics face mounting pressure from value-based contracts
              and bundled payments — while struggling with scalable post-op follow-up
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Bundled Payment Pressure</h3>
                <p className="text-muted-foreground text-sm">
                  Every readmission or complication cuts into already-thin margins
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">High Readmission Risk</h3>
                <p className="text-muted-foreground text-sm">
                  Patients struggle to follow care plans without structured support
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Manual Follow-Up</h3>
                <p className="text-muted-foreground text-sm">
                  Staff time consumed by clunky, manual check-ins that don't scale
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Value-Based Contracts</h3>
                <p className="text-muted-foreground text-sm">
                  Payment models demand better outcomes with fewer resources
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Measurable ROI Within 90 Days</h2>
            <p className="text-xl text-muted-foreground">
              Grove Health helps you improve patient adherence post-discharge while reducing
              the labor cost of follow-up — with measurable impact on your bottom line
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Reduce Readmissions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Keep patients on track with their recovery plans, reducing complications and costly readmissions
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lower Labor Costs</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Automate routine follow-ups, freeing your staff to focus on high-value patient care
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Scalable Solution</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Manage high volumes of post-discharge patients without adding headcount
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Personal Touch / About Section */}
      <section className="py-20 bg-gradient-accent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-background rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold">Built by Patients, Providers, and Caregivers</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm <a href="https://www.linkedin.com/in/adedoyin-o/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Adedoyin</a>,
                  a former EMT now working on Grove Health. We're building this tool because we've experienced firsthand — as patients,
                  providers, and caregivers — how difficult it is to stay on track after surgery.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're speaking with a handful of specialty clinics around the country to understand how they're approaching
                  post-op follow-ups today. We want to learn what's working (and what's not) and see if you'd be interested
                  in being among a small number of clinics who get early access to our tool.
                </p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    variant="default"
                    onClick={() => window.open(CALENDLY_URL, '_blank')}
                    className="group"
                  >
                    Let's Chat for 15 Minutes
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Improve Post-Op Follow-Ups?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join forward-thinking specialty clinics that are reducing readmissions and
              scaling their post-discharge care with Grove Health
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                variant="hero"
                onClick={() => window.open(CALENDLY_URL, '_blank')}
                className="group"
              >
                Schedule Your 15-Minute Chat
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No obligation • Just a conversation about what's working for your clinic
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6">
          <div className="text-center text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HeartPulse className="h-6 w-6 text-primary" />
              <p className="font-semibold text-foreground">Grove Health</p>
            </div>
            <p className="text-sm">Improving post-surgical care through better patient adherence</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PostSurgicalCare;
