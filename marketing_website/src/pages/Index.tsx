import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse, Clock, Eye, Scale, ArrowRight, Stethoscope, Activity, CheckCircle, Phone, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import heroDoctorImage from "@/assets/hero-doctor-2.svg";

const Index = () => {
  const [numDoctors, setNumDoctors] = useState<string>("10");
  const [surgeriesPerDoctor, setSurgeriesPerDoctor] = useState<string>("250");
  const [revenuePerSurgery, setRevenuePerSurgery] = useState<string>("3000");
  const [cancellationRate, setCancellationRate] = useState<string>("8");

  const calculateSavings = () => {
    const doctors = parseFloat(numDoctors) || 0;
    const surgeries = parseFloat(surgeriesPerDoctor) || 0;
    const revenue = parseFloat(revenuePerSurgery) || 0;
    const cancelRate = parseFloat(cancellationRate) || 0;

    const totalSurgeries = doctors * surgeries;
    const cancelledSurgeries = totalSurgeries * (cancelRate / 100);
    const preventableCancellations = cancelledSurgeries * 0.6; // 60% are preventable
    const potentialSavings = preventableCancellations * revenue;

    return potentialSavings;
  };

  const savings = calculateSavings();
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
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background pt-20 pb-20 px-4 min-h-[calc(100vh-64px)]">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-7xl mx-auto">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">Reduce Cancellations, Fill More OR Slots</span>
              </h1>

              <div className="text-lg lg:text-xl text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Grove Health helps surgical centers and clinics reduce last-minute cancellations, fill empty OR slots, and ensure patients arrive prepared.
                </p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Turn long pre-op papers into actionable digital checklists</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Send automated reminders for fasting and medication instructions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Schedule PCP appointments to speed up medical clearance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Use telehealth to get patients cleared when PCP availability is limited</span>
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

      {/* Revenue Calculator Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Calculate Revenue Savings
              </h2>
              <p className="text-xl text-muted-foreground">
                See how much your clinic could save by reducing preventable surgery cancellations
              </p>
            </div>

            {numDoctors && parseFloat(numDoctors) > 0 && (
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-2">Potential Annual Savings</p>
                <p className="text-5xl font-bold text-primary">
                  ${savings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  Research shows that <strong>60% of surgery cancellations are preventable</strong> with proper pre-operative preparation and patient communication.
                </p>
              </div>
            )}

            <Card className="border-none shadow-lg">
              <CardContent className="pt-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="numDoctors">Number of Surgeons</Label>
                    <Input
                      id="numDoctors"
                      type="number"
                      placeholder="Enter number of surgeons"
                      value={numDoctors}
                      onChange={(e) => setNumDoctors(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surgeriesPerDoctor">Surgeries per Surgeon per Year</Label>
                    <Input
                      id="surgeriesPerDoctor"
                      type="number"
                      value={surgeriesPerDoctor}
                      onChange={(e) => setSurgeriesPerDoctor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenuePerSurgery">Revenue per Surgery ($)</Label>
                    <Input
                      id="revenuePerSurgery"
                      type="number"
                      value={revenuePerSurgery}
                      onChange={(e) => setRevenuePerSurgery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cancellationRate">Pre-Op Cancellation Rate (%)</Label>
                    <Input
                      id="cancellationRate"
                      type="number"
                      value={cancellationRate}
                      onChange={(e) => setCancellationRate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <Button variant="hero" size="lg" className="group" asChild>
                <a href="https://form.typeform.com/to/awtQDiTB" target="_blank" rel="noopener noreferrer">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
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
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  One Touch PCP Scheduling
                </h3>
                <p className="text-muted-foreground">
                  We schedule PCP appointments on behalf of patients to make medical clearance easy and ensure they're ready for surgery.
                </p>
              </CardContent>
            </Card>
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
