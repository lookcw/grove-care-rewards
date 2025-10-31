import { TrendingUp, Clock, AlertCircle } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: TrendingUp,
      title: "Premiums Keep Rising",
      description: "Healthcare costs increase by hundreds of dollars per employee annually, straining your budget and employee satisfaction."
    },
    {
      icon: Clock,
      title: "Lost Productivity",
      description: "Workers missing days due to preventable health issues means lost productivity and revenue for your business."
    },
    {
      icon: AlertCircle,
      title: "Reactive, Not Proactive",
      description: "Lack of access to preventive care leads to expensive acute care and longer recovery times."
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold lg:text-5xl mb-6">
            The Healthcare Cost Crisis
          </h2>
          <p className="text-lg text-muted-foreground">
            Small and medium businesses face mounting healthcare challenges that threaten both financial stability and workforce wellbeing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-6">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
