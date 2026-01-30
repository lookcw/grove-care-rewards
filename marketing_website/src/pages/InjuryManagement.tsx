import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, DollarSign, FileText, Clock, AlertTriangle, Shield, HeartPulse, CheckCircle, TrendingDown, ClipboardCheck } from "lucide-react";

const InjuryManagement = () => {
  const CALENDLY_URL = "https://calendly.com/adedoyin-olagbegi/15min?month=2025-11";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">
              Ambara Health
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
                For Small Businesses
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Expert Injury Case Management,
              <span className="block text-primary mt-2">
                Lower Workers' Comp Costs
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We handle the backend work of workplace injury cases so you can focus on running your business.
              Your employees get the right care at the right time, and you save money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="xl"
                variant="hero"
                onClick={() => window.open(CALENDLY_URL, '_blank')}
                className="group"
              >
                Schedule Free Consultation
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Trusted by small businesses reducing injury costs by 30-40%
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">The Hidden Cost of Workplace Injuries</h2>
            <p className="text-xl text-muted-foreground">
              Small businesses face mounting workers' comp costs, complex case management,
              and lost productivity — all while trying to ensure injured employees get proper care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Rising Workers' Comp Costs</h3>
                <p className="text-muted-foreground text-sm">
                  Premiums increase 15-25% when injuries aren't managed efficiently
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Complex Case Management</h3>
                <p className="text-muted-foreground text-sm">
                  Navigating medical providers, claims, and compliance is overwhelming
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Extended Recovery Times</h3>
                <p className="text-muted-foreground text-sm">
                  Without proper guidance, employees stay out of work longer than necessary
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Compliance Challenges</h3>
                <p className="text-muted-foreground text-sm">
                  OSHA requirements and state regulations add administrative burden
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
            <h2 className="text-4xl font-bold mb-6">We Handle Everything Behind the Scenes</h2>
            <p className="text-xl text-muted-foreground">
              Ambara Health manages every aspect of workplace injury cases — from first report
              to return-to-work — ensuring your employees get excellent care at the lowest cost
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <TrendingDown className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lower Costs by 30-40%</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We coordinate with medical providers to ensure appropriate, cost-effective care — eliminating unnecessary treatments and expenses
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <ClipboardCheck className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Expert Case Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our team handles all documentation, provider coordination, and compliance — you stay focused on your business
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Faster Return to Work</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We keep employees engaged and on track with their recovery, getting them back to work 25% faster on average
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How Ambara Health Works</h2>
            <p className="text-xl text-muted-foreground">
              Simple, transparent injury case management that saves you time and money
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">First Report of Injury</h3>
                    <p className="text-muted-foreground">
                      When an injury occurs, notify us immediately. We coordinate with your insurance carrier and begin case management within hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Medical Provider Coordination</h3>
                    <p className="text-muted-foreground">
                      We direct your employee to the right medical providers, ensure proper documentation, and monitor treatment plans to prevent overutilization.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Recovery & Return-to-Work</h3>
                    <p className="text-muted-foreground">
                      We keep your employee engaged throughout recovery, coordinate modified duty arrangements, and ensure a smooth return to full productivity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ongoing Support & Reporting</h3>
                    <p className="text-muted-foreground">
                      You receive regular updates on case status, costs, and timelines. We handle all communications with providers, insurance carriers, and regulatory agencies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits/ROI Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Measurable Results for Your Business</h2>
            <p className="text-xl text-muted-foreground">
              Small businesses using Ambara Health see immediate impact on their bottom line
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg bg-gradient-accent">
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">30-40%</div>
                <p className="text-muted-foreground font-medium">
                  Average reduction in workers' comp costs
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-accent">
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">25%</div>
                <p className="text-muted-foreground font-medium">
                  Faster return to work times
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-accent">
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">50%</div>
                <p className="text-muted-foreground font-medium">
                  Reduction in unnecessary medical treatments
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-accent">
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground font-medium">
                  Compliance with state regulations
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
                <h2 className="text-3xl lg:text-4xl font-bold">Built for Small Businesses, By People Who Care</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm <a href="https://www.linkedin.com/in/adedoyin-o/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Adedoyin</a>,
                  a former EMT now working on Ambara Health. We've seen firsthand how workplace injuries can devastate small businesses —
                  both financially and emotionally. That's why we built a solution focused on doing what's right for your employees
                  while protecting your business.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're working with a small group of forward-thinking business owners who want to take control of their workers' comp costs
                  without compromising on employee care. If you're tired of rising premiums and confusing case management, let's talk.
                </p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    variant="default"
                    onClick={() => window.open(CALENDLY_URL, '_blank')}
                    className="group"
                  >
                    Schedule a Free Consultation
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
              Ready to Lower Your Workers' Comp Costs?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join small businesses across the country that are reducing injury costs by 30-40%
              while ensuring their employees get the best possible care
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                variant="hero"
                onClick={() => window.open(CALENDLY_URL, '_blank')}
                className="group"
              >
                Schedule Your Free Consultation
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No obligation • Learn how we can help reduce your workers' comp costs
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
              <p className="font-semibold text-foreground">Ambara Health</p>
            </div>
            <p className="text-sm">Expert injury case management for small businesses</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InjuryManagement;
