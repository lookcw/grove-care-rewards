import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Video, TrendingUp, Users, DollarSign, Clock, Target, HeartPulse } from "lucide-react";
import heroImage from "@/assets/hero-pt-clinic.jpg";
import appDemo from "@/assets/app-demo.jpg";
import analytics from "@/assets/analytics.jpg";

const PTAdherence = () => {
  const SIGNUP_URL = "https://form.typeform.com/to/rsdirECg";

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
              <a href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
                Get Started
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden pt-20">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-block">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  Empowering PT Clinics with AI
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Patient
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Adherence</span> with AI-Powered Verification
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Partner with Grove Health to boost therapy adherence, improve outcomes, and scale your practice. 
                Our AI verifies exercise form through video, helping your clinic see more patients and bill more effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="xl" 
                  variant="hero" 
                  onClick={() => window.open(SIGNUP_URL, '_blank')}
                  className="group"
                >
                  Get Started Free
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="xl" 
                  variant="outline"
                  onClick={() => window.open(SIGNUP_URL, '_blank')}
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={heroImage} 
                  alt="Physical therapist working with patient in modern clinic"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">The Adherence Challenge</h2>
            <p className="text-xl text-muted-foreground">
              Low adherence to physical therapy exercises is costing clinics revenue and limiting patient outcomes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold text-destructive mb-2">Low Completion</h3>
                <p className="text-muted-foreground">Most patients don't complete their prescribed exercises</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Better Outcomes</h3>
                <p className="text-muted-foreground">Significantly improved results with proper adherence to therapy protocols</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Reduced Re-injury</h3>
                <p className="text-muted-foreground">Consistent exercise adherence greatly reduces re-injury rates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={appDemo} 
                alt="Grove Health app showing video verification and exercise tracking"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-4xl font-bold">AI-Powered Video Verification</h2>
              <p className="text-xl text-muted-foreground">
                Our platform uses advanced computer vision to automatically verify that patients are performing exercises correctly, 
                providing real-time feedback and ensuring proper form.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Automated Form Analysis</h3>
                    <p className="text-muted-foreground">AI analyzes exercise videos and provides instant feedback on form and technique</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adherence Tracking</h3>
                    <p className="text-muted-foreground">Monitor patient compliance in real-time and intervene when needed</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Progress Insights</h3>
                    <p className="text-muted-foreground">Detailed analytics help you and patients visualize improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Impact Section */}
      <section className="py-20 bg-gradient-accent">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Evidence-Based Impact</h2>
            <p className="text-xl text-muted-foreground">
              Research shows that improved adherence dramatically enhances patient outcomes
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={analytics} 
                alt="Data analytics showing improved outcomes with better adherence"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Faster Recovery Times</h3>
                      <p className="text-muted-foreground">Patients with high adherence recover significantly faster</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Reduced Re-injury Rates</h3>
                      <p className="text-muted-foreground">Proper exercise completion substantially reduces chronic pain recurrence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Better Patient Satisfaction</h3>
                      <p className="text-muted-foreground">Higher adherence correlates with 4.5+ star patient satisfaction scores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Clinics */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Grow Your Practice</h2>
            <p className="text-xl text-muted-foreground">
              We partner with your clinic to enhance efficiency and increase revenue, not replace your expertise
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">See More Patients</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Automate exercise monitoring to free up therapist time. Scale your practice by managing more patient programs simultaneously.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Increase Efficiency</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Reduce time spent on manual progress tracking. Our AI handles routine monitoring so you can focus on complex cases.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Bill More Effectively</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Better adherence means better outcomes. Document progress with verified data to support billing and demonstrate value.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Clinic?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join forward-thinking PT clinics that are improving patient outcomes and growing their practice with Grove Health
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                variant="hero" 
                onClick={() => window.open(SIGNUP_URL, '_blank')}
                className="group"
              >
                Start Free Trial
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                onClick={() => window.open(SIGNUP_URL, '_blank')}
              >
                Contact Sales
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • Setup in minutes • Free 30-day trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6">
          <div className="text-center text-muted-foreground">
            <p className="font-semibold text-foreground mb-2">Grove Health</p>
            <p className="text-sm">Empowering PT clinics with AI-powered adherence solutions</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PTAdherence;
