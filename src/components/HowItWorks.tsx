import { Card } from "@/components/ui/card";
import { UserPlus, FileText, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Add Your Patients",
    description: "Quick setup with patient profiles including medical history, medications, and care plans."
  },
  {
    icon: FileText,
    number: "02",
    title: "Log Care Activities",
    description: "Caregivers simply tap to record vitals, medications given, and daily observations."
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Stay in Sync",
    description: "Everyone on the care team sees real-time updates and knows exactly what's needed."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Simple Process, Powerful Results
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in minutes, not days
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
                )}
                <Card className="p-8 text-center relative z-10 bg-card hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">{step.number}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
