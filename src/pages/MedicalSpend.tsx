import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, DollarSign, TrendingDown, TrendingUp, Users, BarChart3, Shield, HeartPulse, CheckCircle, Search, UserCheck, Navigation } from "lucide-react";

const MedicalSpend = () => {
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
                For Employers & Health Plans
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Cut Medical Spend by 20-30%,
              <span className="block text-primary mt-2">
                Without Compromising Quality
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We analyze your claim data to identify high-spend areas, then redirect your employees
              to lower-cost, high-quality providers through personal health navigation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="xl"
                variant="hero"
                onClick={() => window.open(CALENDLY_URL, '_blank')}
                className="group"
              >
                See Your Savings Potential
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Average client saves $2,000-$5,000 per employee annually
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">The Hidden Cost of Healthcare Waste</h2>
            <p className="text-xl text-muted-foreground">
              Most employers are overspending on healthcare by 20-40% due to lack of price transparency,
              inefficient provider networks, and employees making uninformed decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Price Variation</h3>
                <p className="text-muted-foreground text-sm">
                  Same procedure can cost 10x more at one facility vs. another in your network
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No Transparency</h3>
                <p className="text-muted-foreground text-sm">
                  Employees can't easily compare costs and quality before making healthcare decisions
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Uninformed Choices</h3>
                <p className="text-muted-foreground text-sm">
                  Without guidance, employees default to expensive, convenient providers
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Rising Premiums</h3>
                <p className="text-muted-foreground text-sm">
                  Healthcare costs increase 5-8% annually, squeezing budgets and employee wallets
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
            <h2 className="text-4xl font-bold mb-6">Data-Driven Savings, Human Touch</h2>
            <p className="text-xl text-muted-foreground">
              Grove Health combines advanced claim data analytics with personal health navigation
              to reduce your medical spend while improving employee care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Claim Data Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We analyze your claims to identify high-spend procedures, overpriced providers, and opportunities for savings
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Navigation className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Personal Health Navigation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our health navigators guide employees to lower-cost, high-quality providers for their specific needs
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Quality Guaranteed</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We only recommend providers with proven outcomes — lower cost never means lower quality
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
            <h2 className="text-4xl font-bold mb-6">How Grove Health Works</h2>
            <p className="text-xl text-muted-foreground">
              A simple, proven approach to reducing healthcare costs
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
                    <h3 className="text-xl font-bold mb-2">Analyze Your Claim Data</h3>
                    <p className="text-muted-foreground">
                      We securely access your claims data and identify where you're overspending. Our analytics reveal price variations,
                      utilization patterns, and specific opportunities for savings across your population.
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
                    <h3 className="text-xl font-bold mb-2">Build Your Savings Roadmap</h3>
                    <p className="text-muted-foreground">
                      We present you with a customized savings plan, showing exactly where costs can be reduced and by how much.
                      You'll see projected savings across procedures, providers, and service categories.
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
                    <h3 className="text-xl font-bold mb-2">Navigate Your Employees</h3>
                    <p className="text-muted-foreground">
                      When employees need care, our personal health navigators connect with them directly — helping them find
                      lower-cost, high-quality providers, schedule appointments, and answer questions.
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
                    <h3 className="text-xl font-bold mb-2">Track & Optimize Savings</h3>
                    <p className="text-muted-foreground">
                      You receive regular reports showing exactly how much you're saving. We continuously analyze your data
                      to find new opportunities and refine our recommendations.
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
            <h2 className="text-4xl font-bold mb-6">Real Results for Your Bottom Line</h2>
            <p className="text-xl text-muted-foreground">
              Companies using Grove Health see immediate, measurable impact on healthcare costs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg bg-gradient-accent">
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">20-30%</div>
                <p className="text-muted-foreground font-medium">
                  Average reduction in medical spend
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-accent">
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">$3,500</div>
                <p className="text-muted-foreground font-medium">
                  Average savings per employee annually
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-accent">
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">90%</div>
                <p className="text-muted-foreground font-medium">
                  Employee satisfaction with navigation service
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-accent">
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">6 mo</div>
                <p className="text-muted-foreground font-medium">
                  Average time to full ROI
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-accent">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Where We Drive the Most Savings</h2>
            <p className="text-xl text-muted-foreground">
              Our claim data analysis consistently identifies high-impact savings opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Imaging & Diagnostics</h3>
                    <p className="text-muted-foreground text-sm">
                      MRIs, CT scans, and lab work with 300-500% price variation across providers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Outpatient Surgery</h3>
                    <p className="text-muted-foreground text-sm">
                      Hospital outpatient departments often 2-3x more expensive than ASCs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Physical Therapy</h3>
                    <p className="text-muted-foreground text-sm">
                      Independent PT clinics provide same outcomes at 40-60% lower cost
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Specialty Drugs</h3>
                    <p className="text-muted-foreground text-sm">
                      Redirect to specialty pharmacies and alternative dispensing channels
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Orthopedic Procedures</h3>
                    <p className="text-muted-foreground text-sm">
                      Hip/knee replacements with major price and outcome differences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">Emergency Care</h3>
                    <p className="text-muted-foreground text-sm">
                      Urgent care and telemedicine alternatives for non-emergency situations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Personal Touch / About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-background rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold">Built to Solve a Real Problem</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm <a href="https://www.linkedin.com/in/adedoyin-o/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Adedoyin</a>,
                  a former EMT now working on Grove Health. After seeing firsthand how broken healthcare pricing is — and how
                  much employers and patients overpay for the same care — I knew we needed a better solution.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We built Grove Health to bring transparency and guidance to healthcare spending. Our team combines data analytics
                  expertise with compassionate health navigation to help companies cut costs while improving employee experiences.
                </p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    variant="default"
                    onClick={() => window.open(CALENDLY_URL, '_blank')}
                    className="group"
                  >
                    See Your Savings Potential
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
              Ready to Cut Your Medical Spend?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join forward-thinking employers reducing healthcare costs by 20-30% through
              data-driven insights and personal health navigation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                variant="hero"
                onClick={() => window.open(CALENDLY_URL, '_blank')}
                className="group"
              >
                Get Your Free Savings Analysis
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No obligation • See exactly where you're overspending
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
            <p className="text-sm">Reducing medical spend through data-driven health navigation</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MedicalSpend;
