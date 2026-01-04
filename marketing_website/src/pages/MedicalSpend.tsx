import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, DollarSign, TrendingUp, Users, BarChart3, Shield, HeartPulse, CheckCircle, Search, UserCheck, Navigation, Sparkles, Calculator } from "lucide-react";
import { useState } from "react";

const MedicalSpend = () => {
  const CALENDLY_URL = "https://calendly.com/adedoyin-olagbegi/15min?month=2025-11";
  const [employeeInput, setEmployeeInput] = useState<string>("100");

  const calculateSavings = () => {
    const numEmployees = parseInt(employeeInput) || 0;
    const savingsPerEmployee = 100;
    const totalSavings = numEmployees * savingsPerEmployee;
    return totalSavings.toLocaleString();
  };

  const handleEmployeeChange = (value: string) => {
    // Allow empty string or valid numbers
    if (value === "" || /^\d+$/.test(value)) {
      setEmployeeInput(value);
    }
  };

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
              Lower Your Medical Spend
              <span className="block text-primary mt-2">
                by 15%
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              We save you money by making sure your members don't get unnecessary care that cuts
              into your time and costs your dime. That's about $100 per employee per year.
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
              Connected to next-gen providers focused on quality for lower cost
            </p>
          </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <section className="py-20 bg-gradient-accent">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-none shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Calculate Your Savings</h2>
                  <p className="text-muted-foreground">
                    See how much you could save with Grove Health
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="employees" className="block text-sm font-medium mb-2">
                      Number of Employees
                    </label>
                    <input
                      id="employees"
                      type="text"
                      inputMode="numeric"
                      value={employeeInput}
                      onChange={(e) => handleEmployeeChange(e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter number of employees"
                    />
                  </div>

                  <div className="bg-primary/5 rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Your Estimated Annual Savings</p>
                    <p className="text-4xl font-bold text-primary">${calculateSavings()}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on $100 per employee per year
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => window.open(CALENDLY_URL, '_blank')}
                  >
                    Schedule a Call to Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">The Challenge with Traditional Healthcare</h2>
            <p className="text-xl text-muted-foreground">
              Most employers struggle with high healthcare costs because they lack access to
              innovative providers and expert guidance on what care is actually needed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">High-Cost Providers</h3>
                <p className="text-muted-foreground text-sm">
                  Traditional networks prioritize convenience over value, leading to inflated costs
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No Expert Guidance</h3>
                <p className="text-muted-foreground text-sm">
                  Employees don't know which providers deliver the best outcomes for their condition
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Unnecessary Care</h3>
                <p className="text-muted-foreground text-sm">
                  Without clinical expertise, employees often receive care they don't need
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Rising Costs</h3>
                <p className="text-muted-foreground text-sm">
                  Healthcare spend continues to increase without corresponding improvements in outcomes
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
            <h2 className="text-4xl font-bold mb-6">Eliminate Unnecessary Care</h2>
            <p className="text-xl text-muted-foreground">
              We save you money by making sure your members don't get unnecessary care that cuts
              into your time and costs your dime. Connected to next-gen providers who know what
              the right care is.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Next-Gen Provider Network</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We partner exclusively with innovative providers who deliver superior outcomes at lower costs through value-based care models
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Navigation className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Stop Unnecessary Care</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our clinical navigators prevent unnecessary procedures and treatments, saving you time and money while ensuring members get the right care
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Quality First, Always</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every provider in our network is vetted for clinical excellence — we never compromise on quality to reduce costs
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
              A simple approach to connecting employees with the right care
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
                    <h3 className="text-xl font-bold mb-2">Curated Provider Network</h3>
                    <p className="text-muted-foreground">
                      We carefully select and partner with next-generation healthcare providers who demonstrate superior clinical
                      outcomes while maintaining lower costs through innovative, value-based care models.
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
                    <h3 className="text-xl font-bold mb-2">Clinical Expertise</h3>
                    <p className="text-muted-foreground">
                      Our health navigators have clinical backgrounds and understand what the right care is. They evaluate each
                      employee's needs and determine the most appropriate and effective treatment path.
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
                    <h3 className="text-xl font-bold mb-2">Personalized Guidance</h3>
                    <p className="text-muted-foreground">
                      When employees need care, our navigators connect them directly with the best provider for their specific
                      condition — scheduling appointments and answering questions throughout their journey.
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
                    <h3 className="text-xl font-bold mb-2">Continuous Quality Monitoring</h3>
                    <p className="text-muted-foreground">
                      We track outcomes across our provider network, ensuring every partner maintains the highest standards
                      of care while delivering sustainable cost savings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-accent">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Where Our Network Excels</h2>
            <p className="text-xl text-muted-foreground">
              Our next-gen providers deliver exceptional outcomes across key healthcare categories
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
                      High-quality imaging centers with same-day results and transparent pricing
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
                    <h3 className="font-bold text-lg mb-1">Surgical Centers</h3>
                    <p className="text-muted-foreground text-sm">
                      Specialized ambulatory surgery centers with superior outcomes and efficiency
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
                      Evidence-based PT clinics focused on functional outcomes and prevention
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
                    <h3 className="font-bold text-lg mb-1">Specialty Care</h3>
                    <p className="text-muted-foreground text-sm">
                      Top specialists using latest protocols and technology for complex conditions
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
                    <h3 className="font-bold text-lg mb-1">Musculoskeletal Care</h3>
                    <p className="text-muted-foreground text-sm">
                      Integrated orthopedic care with proven outcomes and faster recovery times
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
                    <h3 className="font-bold text-lg mb-1">Preventive Care</h3>
                    <p className="text-muted-foreground text-sm">
                      Proactive primary care providers focused on preventing costly conditions
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
                <h2 className="text-3xl lg:text-4xl font-bold">Built on Clinical Expertise</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm <a href="https://www.linkedin.com/in/adedoyin-o/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Adedoyin</a>,
                  a former EMT now working on Grove Health. Throughout my healthcare career, I've seen how difficult it is for
                  patients to know what the right care is — and how often they end up with expensive, unnecessary treatments.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We built Grove Health to solve this problem by connecting employees with next-generation providers who focus on
                  delivering the right care, not the most profitable care. Our team brings clinical expertise and a commitment
                  to quality that ensures every recommendation we make is in the patient's best interest.
                </p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    variant="default"
                    onClick={() => window.open(CALENDLY_URL, '_blank')}
                    className="group"
                  >
                    Learn About Our Provider Network
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
              Ready to Lower Your Medical Spend by 15%?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop paying for unnecessary care. Save an average of $100 per employee per year
              by ensuring your members get the right care, not excessive care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              No obligation • Learn how we eliminate unnecessary care
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
            <p className="text-sm">Connecting you with next-gen providers focused on quality for lower cost</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MedicalSpend;
