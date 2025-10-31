import { Card } from "@/components/ui/card";
import { ClipboardList, Users, Bell, Shield, Clock, TrendingUp } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Organized Records",
    description: "All patient information in one place, easy to find and update in seconds."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Your entire care team stays in sync with instant updates and notifications."
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss medication times, appointments, or important care tasks."
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Bank-level security ensures patient data is always protected and private."
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Reduce paperwork by 70% and spend more time on what matters - patient care."
  },
  {
    icon: TrendingUp,
    title: "Better Outcomes",
    description: "Data-driven insights help you provide the highest quality care possible."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need for Better Care
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed specifically for home health caregivers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
