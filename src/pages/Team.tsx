import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, ArrowRight, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import adedoyinImage from "@/assets/adedoyin.jpeg";
import chrisImage from "@/assets/chris.jpeg";

const Team = () => {
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
            <Button variant="ghost" size="sm" asChild>
              <Link to="/demo-preop">
                Demo
              </Link>
            </Button>
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

      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden pt-20">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <HeartPulse className="h-4 w-4 mr-2" />
                Meet the Team
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Built by Clinicians and Engineers Who've Seen the Problem Up Close
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Our team has worked inside hospitals, surgical centers, and health systems — we've seen how much time clinicians spend on manual follow-up. Grove Health exists to give that time back.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Adedoyin */}
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={adedoyinImage}
                  alt="Adedoyin - CEO & Co-Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-8 pb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Adedoyin</h3>
                    <p className="text-primary font-semibold mb-1">CEO & Co-Founder</p>
                    <p className="text-sm text-muted-foreground">Former EMT</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    As an EMT, Adedoyin experienced firsthand the challenges in our healthcare
                    system. Now she's leading Grove Health's mission to improve patient adherence and reduce
                    costs through innovative solutions.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://www.linkedin.com/in/adedoyin-o/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      Connect on LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chris */}
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={chrisImage}
                  alt="Chris - CTO & Co-Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-8 pb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Chris</h3>
                    <p className="text-primary font-semibold mb-1">CTO & Co-Founder</p>
                    <p className="text-sm text-muted-foreground">Technology Leader</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Chris brings deep technical expertise to Grove Health, building scalable solutions
                    that help healthcare providers and patients achieve better outcomes through
                    technology and data-driven insights.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://www.linkedin.com/in/christopher-look/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" />
                      Connect on LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-accent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-background rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="space-y-6 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold">Our Story</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We started Grove Health because we've experienced — as patients, providers, and caregivers —
                  how difficult it is to navigate our healthcare system. We believe that better technology
                  and aligned incentives can make healthcare more accessible, affordable, and effective for everyone.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Whether it's helping surgical clinics reduce readmissions, enabling PT clinics to improve
                  adherence, or making it easier for families to manage home care, we're building solutions
                  that create value for all stakeholders in the healthcare ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Want to Work With Us?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're always looking to partner with healthcare providers, payers, and innovators
              who share our mission to improve healthcare outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                variant="hero"
                asChild
                className="group"
              >
                <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                  Get In Touch
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
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
            <p className="text-sm">Transforming healthcare economics</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Team;
