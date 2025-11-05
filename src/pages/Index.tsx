import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, TrendingDown, Users, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <HeartPulse className="h-4 w-4 mr-2" />
                Transforming Healthcare Economics
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Welcome to{" "}
              <span className="text-primary">Grove Health</span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Reducing cost of care is our goal. We believe healthy individuals leads to healthier businesses,
              physically and financially.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="hero" size="lg" className="group" asChild>
                <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                  Get In Touch
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
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
              We're on a mission to make healthcare more accessible, affordable, and effective
              by aligning incentives between individuals, businesses, and healthcare providers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingDown className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Cost Reduction</h3>
                <p className="text-muted-foreground">
                  We help businesses reduce healthcare costs through innovative approaches
                  to preventive care and wellness.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Better Outcomes</h3>
                <p className="text-muted-foreground">
                  By focusing on prevention and engagement, we improve health outcomes
                  for individuals and communities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Sustainable Solutions</h3>
                <p className="text-muted-foreground">
                  Our solutions are designed to create long-term value for all stakeholders
                  in the healthcare ecosystem.
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
            <h2 className="text-4xl font-bold mb-6">Our Solutions</h2>
            <p className="text-xl text-muted-foreground">
              Explore how we're revolutionizing different aspects of healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <Link to="/employee-wellness" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    SMB Health Benefits
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Stop rising premiums. Start rewarding health. Transform your healthcare costs
                    with member engagement.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/home-care" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Home Care Management
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Making caregiving easier with simple, organized systems that help track
                    patient needs effortlessly.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/pt-adherence" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    PT Adherence
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Transform patient adherence with AI-powered verification. Help clinics
                    see more patients and improve outcomes.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/post-surgical-care" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Post-Surgical Care
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Reduce readmissions and improve post-op adherence for specialty surgical clinics
                    through scalable follow-up.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/injury-management" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Injury Management
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Expert workplace injury case management for small businesses. Lower workers' comp
                    costs by 30-40% while ensuring employee care.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/medical-spend" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Lower Medical Spend by 15%
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Save $100 per employee per year by eliminating unnecessary care that cuts
                    into your time and costs your dime.
                  </p>
                  <div className="flex items-center text-primary font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
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
              Questions? Let's Talk
            </h2>
            <p className="text-xl text-muted-foreground">
              If you have any questions, please reach out. We'd love to hear from you.
            </p>
            <Button variant="hero" size="lg" className="group" asChild>
              <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                Contact Us
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
