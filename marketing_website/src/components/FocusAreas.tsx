import { Activity, Stethoscope, AlertOctagon } from "lucide-react";

const FocusAreas = () => {
  const areas = [
    {
      icon: Activity,
      title: "MSK Issues",
      description: "Musculoskeletal conditions are the leading cause of lost workdays. We keep members active with proactive care and physical therapy adherence.",
      stats: "Reduced lost work days"
    },
    {
      icon: Stethoscope,
      title: "Diabetes Management",
      description: "Consistent glucose monitoring and medication adherence prevents complications and reduces hospital visits.",
      stats: "Improved A1C control"
    },
    {
      icon: AlertOctagon,
      title: "ER Prevention",
      description: "Most ER visits are preventable. We guide members to appropriate care settings and reduce costly emergency visits.",
      stats: "Significant cost savings"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold lg:text-5xl mb-6">
            Where We Make the Biggest Impact
          </h2>
          <p className="text-lg text-muted-foreground">
            We focus on the conditions that drive the most costs and lost productivity for SMBs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {areas.map((area, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all border border-border"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <area.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{area.title}</h3>
              <p className="text-muted-foreground mb-6">{area.description}</p>
              <div className="pt-6 border-t border-border">
                <div className="text-sm font-semibold text-primary">{area.stats}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
