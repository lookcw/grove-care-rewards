import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, Clock, Eye, Scale, ArrowRight, Stethoscope, Activity, Home, CheckCircle, Phone } from "lucide-react";
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
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">Reduce Cancellations, Fill More OR Slots</span>
              </h1>

              <div className="text-lg lg:text-xl text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Grove Health automates phone call and text reminders for surgical centers and clinics. We turn long pre-op papers into actionable checklists, helping you reduce last-minute cancellations, fill empty OR slots, and ensure patients arrive prepared.
                </p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Turn long pre-op papers into actionable digital checklists</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Send automated reminders when patients need to stop eating or taking medications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Call patients to confirm they've followed their pre-op instructions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Detect potential cancellations early so you can fill OR slots</span>
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
              Our tools make pre-operative preparation more efficient and less chaotic for both surgical centers and patients. Today, coordinators spend hours making routine pre-op calls — verifying NPO, medication holds, and checklist completion — just to make sure patients will show up ready. Last-minute cancellations waste expensive OR time and create scheduling nightmares. We automate those workflows so staff can focus on complex cases, while ensuring every patient arrives prepared for surgery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Reduce Cancellations, Fill More OR Slots</h3>
                <p className="text-muted-foreground">
                  Know days in advance when a patient won't be ready for surgery, not the morning of. Fill empty OR slots with other patients and eliminate wasted surgical time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Fewer Day-Of Cancellations</h3>
                <p className="text-muted-foreground">
                  Automated reminders and confirmation calls ensure patients follow NPO instructions and medication holds. Reduce last-minute surprises and maximize OR utilization.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scale className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Increase Revenue & Reduce Chaos</h3>
                <p className="text-muted-foreground">
                More completed surgeries mean more revenue. Less wasted OR time means better margins. Automated pre-op workflows eliminate scheduling complications and manual coordination headaches.
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
              We help surgical centers automate and streamline the preparation work that happens before surgery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link to="/post-op" className="group">
              <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Stethoscope className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    Pre-Op Checklist Management
                  </h3>
                  <p className="text-muted-foreground">
                    Digitizes lengthy paper checklists into patient-friendly workflows. Sends automated reminders for each requirement and tracks completion in real-time, so coordinators know exactly who's ready.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-none shadow-md h-full">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Adherence Notifications
                </h3>
                <p className="text-muted-foreground">
                  Automatically messages patients at the right time to stop eating, hold medications, or complete other time-sensitive requirements. Takes the burden off staff to remember every patient's timeline.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md h-full">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Compliance Verification & Confirmation Calls
                </h3>
                <p className="text-muted-foreground">
                  Automated calls verify that patients followed their pre-op instructions correctly. Get confirmation before surgery day that patients are ready, reducing last-minute cancellations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Fill More OR Slots, Reduce Cancellations
            </h2>
            <p className="text-xl text-muted-foreground">
              We're partnering with surgical centers to eliminate last-minute cancellations and wasted OR time.
              <br className="hidden sm:block" />
              <span className="block sm:inline"> If your coordinators spend hours on manual pre-op calls and deal with scheduling chaos, we'd love to chat. Reach out today!</span>
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
