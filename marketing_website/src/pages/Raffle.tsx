import { useEffect } from "react";
import { HeartPulse } from "lucide-react";

const Raffle = () => {
  useEffect(() => {
    // Load Typeform embed script
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      const existingScript = document.querySelector('script[src="//embed.typeform.com/next/embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Ambara Health</span>
          </a>
        </div>
      </header>

      {/* Typeform Container */}
      <section className="pt-20 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div
            data-tf-live="01K9W763VJHV82WMYWQF2MDAJG"
            className="w-full"
            style={{ minHeight: "600px" }}
          />
        </div>
      </section>
    </div>
  );
};

export default Raffle;

