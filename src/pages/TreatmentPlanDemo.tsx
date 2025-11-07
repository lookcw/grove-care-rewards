import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Save, Stethoscope, User, MessageSquare, Send, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ClinicType = "ortho" | "derm" | "bariatric";

const CLINIC_DATA = {
  ortho: {
    name: "Orthopedic",
    guidance: `GENERAL PAIN MANAGEMENT GUIDANCE:
- If you experience pain, take the pain medication you were prescribed
- Pain is normal after surgery but should gradually decrease over time
- Contact us if pain increases or is not controlled by medication

`,
    treatments: {
      slap_tear: {
        label: "SLAP Tear Repair",
        content: `Post-Operative Instructions - SLAP Tear Repair

MEDICATIONS:
- Take prescribed pain medication as directed
- Continue antibiotics until finished
- Anti-inflammatory as needed for swelling

ACTIVITY RESTRICTIONS:
- Keep arm in sling for 4-6 weeks
- No lifting objects heavier than a coffee cup
- No reaching behind your back
- Begin gentle pendulum exercises after 2 weeks

WOUND CARE:
- Keep incisions clean and dry for 48 hours
- May shower after 48 hours, pat dry gently
- Watch for signs of infection (redness, warmth, discharge)

FOLLOW-UP:
- Return for suture removal in 10-14 days
- Physical therapy will begin at 6 weeks
- Full recovery typically 4-6 months

CONTACT US IF:
- Fever over 101°F
- Increasing pain not relieved by medication
- Numbness or tingling in hand/fingers`
      },
      acl_reconstruction: {
        label: "ACL Reconstruction",
        content: `Post-Operative Instructions - ACL Reconstruction

MEDICATIONS:
- Take prescribed pain medication as directed
- Continue antibiotics until course is complete
- Blood thinner as prescribed to prevent clots

IMMOBILIZATION:
- Wear knee brace at all times (locked in extension for sleeping)
- Use crutches - weight bearing as tolerated
- Elevate leg above heart level when resting

PHYSICAL THERAPY:
- Begin gentle range of motion exercises immediately
- Formal PT starts at 1 week post-op
- Gradual progression over 6-9 months

ACTIVITY RESTRICTIONS:
- No pivoting, twisting, or running for 6 months
- No contact sports until cleared by surgeon
- Swimming allowed after incisions heal (2-3 weeks)

FOLLOW-UP:
- First visit at 2 weeks for wound check
- PT progress checks at 6 weeks, 3 months, 6 months
- Return to sport clearance typically 9-12 months`
      },
      rotator_cuff: {
        label: "Rotator Cuff Repair",
        content: `Post-Operative Instructions - Rotator Cuff Repair

MEDICATIONS:
- Pain medication as prescribed
- Anti-inflammatory medication to reduce swelling
- Muscle relaxant if experiencing spasms

SLING USE:
- Wear sling at all times for 6 weeks, including sleep
- Remove only for exercises and bathing
- No weight bearing on affected arm

WOUND CARE:
- Keep dressings clean and dry for 48 hours
- May shower after 2 days - let water run over shoulder
- Watch for signs of infection

PHYSICAL THERAPY:
- Passive range of motion only for first 6 weeks
- Active-assisted exercises begin at 6-8 weeks
- Strengthening begins at 12 weeks
- Full recovery typically 4-6 months

PRECAUTIONS:
- No reaching behind back for 12 weeks
- No lifting objects for 12 weeks
- Sleep in semi-reclined position`
      }
    },
    clinicInfo: `Orthopedic Surgery Center Information

ABOUT OUR FACILITY:
We are a state-of-the-art ambulatory surgery center specializing in orthopedic procedures. Our team includes board-certified orthopedic surgeons, anesthesiologists, and specialized surgical staff.

SPECIALTIES:
- Joint arthroscopy (knee, shoulder, ankle)
- Sports medicine and injuries
- Hand and wrist surgery
- Foot and ankle surgery
- Minimally invasive spine procedures
- Joint injections and pain management

FACILITY HOURS:
Monday - Friday: 6:00 AM - 6:00 PM
Surgery scheduling: 7:00 AM - 4:00 PM
Saturday: Emergency procedures only

CONTACT INFORMATION:
Main Office: (555) 234-5678
Surgery Scheduling: (555) 234-5679
Physical Therapy: (555) 234-5680
Emergency Line: (555) 234-5681

POST-OPERATIVE CARE:
- Pain management team available 24/7
- Home care instructions provided before discharge
- Follow-up appointment scheduled before leaving
- Physical therapy referrals coordinated`
  },
  derm: {
    name: "Dermatology",
    guidance: `MEDICATION APPLICATION ORDER:
- Always apply medications from most watery to least watery consistency
- Allow each product to absorb before applying the next (wait 2-5 minutes)
- General order: cleanser → toner → serum → moisturizer → sunscreen

`,
    treatments: {
      acne_treatment: {
        label: "Acne Treatment",
        content: `Post-Visit Instructions - Acne Treatment

MEDICATION APPLICATION:
- Cleanse face gently with mild, non-comedogenic cleanser
- Apply prescribed topical medication to affected areas once or twice daily as directed
- Start with small amount to assess tolerance
- Use thin layer - more is not better

SKINCARE ROUTINE:
- Use oil-free, non-comedogenic products only
- Apply SPF 30+ sunscreen daily (oil-free formula)
- Avoid heavy moisturizers that can clog pores
- Do not pick or squeeze lesions

WHAT TO EXPECT:
- May see initial worsening ("purging") in first 2-4 weeks - this is normal
- Improvement typically seen at 6-8 weeks
- Full results may take 3-4 months
- Mild redness, dryness, or peeling is common initially

AVOID:
- Harsh scrubs or exfoliants
- Oil-based cosmetics and hair products
- Touching or picking at skin
- Excessive sun exposure

FOLLOW-UP:
- Return in 6-8 weeks for progress evaluation`
      },
      psoriasis_management: {
        label: "Psoriasis Management",
        content: `Post-Visit Instructions - Psoriasis Management

MEDICATION APPLICATION:
- Apply prescribed topical medications to affected areas as directed
- For scalp applications, part hair to expose scalp
- Gently massage medication into plaques
- Do not apply to unaffected skin

BATHING:
- Take lukewarm (not hot) baths or showers
- Add colloidal oatmeal or bath oil to help soothe skin
- Pat skin dry gently - do not rub
- Apply medications or moisturizer within 3 minutes of bathing

MOISTURIZING:
- Use thick, fragrance-free moisturizers several times daily
- Apply immediately after bathing while skin is still damp
- Pay special attention to affected areas

LIFESTYLE MODIFICATIONS:
- Avoid triggers (stress, smoking, alcohol)
- Maintain healthy weight
- Get adequate sleep
- Consider stress-reduction techniques

FOLLOW-UP:
- Return in 4-6 weeks to assess treatment response
- Report any worsening or new symptoms`
      },
      skin_biopsy: {
        label: "Skin Biopsy Post-Care",
        content: `Post-Procedure Instructions - Skin Biopsy

WOUND CARE:
- Keep bandage clean and dry for 24 hours
- After 24 hours, may gently wash with soap and water
- Pat dry and apply antibiotic ointment
- Cover with clean bandage

ACTIVITY RESTRICTIONS:
- Avoid strenuous activity that may stretch or stress the site
- No swimming or soaking for 48 hours
- Avoid direct sun exposure to biopsy site

PAIN MANAGEMENT:
- Over-the-counter pain relievers (acetaminophen or ibuprofen) as needed
- Ice pack for 10-15 minutes if swelling occurs

SUTURE REMOVAL:
- Face/neck: 5-7 days
- Trunk/arms: 10-14 days
- Legs: 14 days

WATCH FOR:
- Increasing redness, warmth, or swelling
- Pus or drainage
- Fever
- Excessive bleeding

RESULTS:
- Biopsy results typically available in 7-10 days
- We will contact you to discuss findings`
      }
    },
    clinicInfo: `Dermatology Clinic Information

ABOUT OUR PRACTICE:
We are a full-service dermatology clinic specializing in medical, surgical, and cosmetic dermatology. Our board-certified dermatologists provide comprehensive skin care for patients of all ages.

SERVICES:
- Acne treatment and management
- Skin cancer screening and treatment
- Eczema and psoriasis care
- Mole removal and biopsies
- Cosmetic procedures (Botox, fillers, laser treatments)

OFFICE HOURS:
Monday - Friday: 8:00 AM - 5:00 PM
Saturday: 9:00 AM - 1:00 PM (by appointment)

CONTACT:
Phone: (555) 123-4567
After-hours emergencies: (555) 123-4568
Email: info@dermclinic.com

PRESCRIPTION REFILLS:
Request through patient portal or call 48 hours in advance`
  },
  bariatric: {
    name: "Bariatric Surgery",
    guidance: `POST-BARIATRIC SURGERY NUTRITION GUIDELINES:
- Follow the staged diet progression: clear liquids → full liquids → pureed → soft foods → regular diet
- Eat slowly and chew thoroughly (20-30 times per bite)
- Stop eating when you feel satisfied, not full
- Protein first, then vegetables, then carbohydrates
- Stay hydrated - sip fluids throughout the day (avoid drinking with meals)

`,
    treatments: {
      gastric_bypass: {
        label: "Gastric Bypass Post-Op",
        content: `Post-Operative Instructions - Gastric Bypass

DIET PROGRESSION:
Week 1-2: Clear liquids only
Week 3-4: Full liquids (protein shakes, yogurt)
Week 5-6: Pureed foods
Week 7-8: Soft foods
Week 9+: Regular diet as tolerated

PROTEIN REQUIREMENTS:
- Target 60-80 grams protein daily
- Prioritize protein at every meal
- Use protein supplements as needed

HYDRATION:
- Drink 64+ ounces of water daily
- Sip slowly throughout the day
- Avoid carbonated beverages
- No drinking 30 minutes before or after meals

VITAMINS & SUPPLEMENTS:
- Multivitamin with iron daily
- Calcium citrate (1200-1500mg daily in divided doses)
- Vitamin B12 supplement
- Vitamin D as prescribed

ACTIVITY:
- Walk frequently starting day of surgery
- No heavy lifting (>10 lbs) for 6 weeks
- Gradually increase activity as tolerated

FOLLOW-UP:
- 2 weeks: wound check
- 6 weeks: diet advancement
- 3, 6, 12 months: nutritional labs and progress checks`
      },
      gastric_sleeve: {
        label: "Gastric Sleeve Post-Op",
        content: `Post-Operative Instructions - Gastric Sleeve

DIET PROGRESSION:
Week 1-2: Clear liquids
Week 3-4: Full liquids and protein shakes
Week 5-6: Pureed foods
Week 7-8: Soft proteins and vegetables
Week 9+: Regular diet as tolerated

PORTION CONTROL:
- Meals should be 2-4 ounces per sitting
- Use small plates and utensils
- Eat over 20-30 minutes
- Stop when satisfied, not full

PROTEIN GOALS:
- Aim for 60-80 grams protein daily
- Protein first at every meal
- Consider protein shakes if struggling to meet goals

HYDRATION:
- 64+ ounces of water daily
- No straws (can cause gas)
- Avoid caffeine for first month
- Separate drinking from eating by 30 minutes

MEDICATIONS:
- Pain medication as prescribed
- Acid reducer for 3-6 months
- All medications in liquid or crushed form initially

ACTIVITY & EXERCISE:
- Walk 5-10 minutes several times daily
- No lifting >20 lbs for 4-6 weeks
- Begin exercise program at 6 weeks

FOLLOW-UP SCHEDULE:
- 2 weeks, 6 weeks, 3 months, 6 months, 12 months, then annually`
      },
      bariatric_nutrition: {
        label: "Bariatric Nutrition Guidelines",
        content: `Long-Term Nutrition Guidelines - Bariatric Surgery

EATING HABITS:
- Small, frequent meals (5-6 per day)
- Protein first, then non-starchy vegetables, then complex carbs
- Chew thoroughly, eat slowly
- Stop eating when satisfied
- Avoid grazing between meals

FOODS TO EMPHASIZE:
- Lean proteins (chicken, fish, eggs, Greek yogurt)
- Non-starchy vegetables
- Small amounts of fruit
- Whole grains in moderation
- Low-fat dairy

FOODS TO AVOID:
- High-sugar foods (dumping syndrome risk)
- Fried and fatty foods
- Tough, dry meats
- Bread and pasta (can cause blockage)
- Carbonated beverages

SUPPLEMENTATION (LIFELONG):
- Complete multivitamin with minerals
- Calcium citrate with Vitamin D
- Vitamin B12
- Iron (especially for menstruating women)
- Regular lab work to monitor levels

HYDRATION:
- 64+ ounces non-caffeinated, sugar-free fluids daily
- Sip throughout the day
- Wait 30 minutes after meals to drink

RED FLAGS - CALL IMMEDIATELY:
- Persistent vomiting
- Inability to keep down liquids
- Severe abdominal pain
- Fever >101°F
- Signs of dehydration`
      }
    },
    clinicInfo: `Bariatric Surgery Center Information

ABOUT OUR PROGRAM:
We are a comprehensive bariatric surgery center offering surgical and non-surgical weight loss solutions. Our multidisciplinary team includes surgeons, dietitians, psychologists, and exercise physiologists.

SERVICES:
- Gastric bypass surgery
- Gastric sleeve surgery
- Revisional bariatric surgery
- Non-surgical weight loss programs
- Nutritional counseling
- Support groups

PROGRAM HOURS:
Monday - Friday: 7:00 AM - 5:00 PM
Saturday: Support groups only

CONTACT:
Main Office: (555) 345-6789
Nutritionist: (555) 345-6790
Support Groups: (555) 345-6791
24/7 Nurse Line: (555) 345-6792

REQUIRED FOLLOW-UP:
- Nutritionist visits at 2 weeks, 6 weeks, 3 months, 6 months, 12 months
- Surgeon visits at 2 weeks, 6 months, 12 months, then annually
- Lab work at 3, 6, 12 months, then annually
- Monthly support group attendance encouraged`
  }
};

const QUICK_QUESTIONS = [
  "What do I need to do today?",
  "What should I be avoiding?",
  "What should I do if I feel pain?",
];

const Main = () => {
  const [clinicType, setClinicType] = useState<ClinicType>("ortho");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [baseInfo, setBaseInfo] = useState("");
  const [surgeryDate, setSurgeryDate] = useState<Date>(() => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return twoWeeksAgo;
  });
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("medicalData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setClinicType((data.clinicType as ClinicType) || "ortho");
      setTreatmentPlan(data.treatmentPlan || "");
      setBaseInfo(data.baseInfo || "");
      if (data.surgeryDate) {
        setSurgeryDate(new Date(data.surgeryDate));
      }
    }

    // Use environment variable as default, or fall back to saved key
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const savedKey = localStorage.getItem("geminiApiKey");

    if (envApiKey) {
      setApiKey(envApiKey);
    } else if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("medicalData", JSON.stringify({
      clinicType,
      treatmentPlan,
      baseInfo,
      surgeryDate: surgeryDate.toISOString(),
      timestamp: new Date().toISOString()
    }));
    toast.success("Treatment plan saved successfully");
  };

  const handleClinicTypeChange = (value: string) => {
    const newClinicType = value as ClinicType;
    setClinicType(newClinicType);
    setTreatmentPlan("");
    setBaseInfo(CLINIC_DATA[newClinicType].clinicInfo);
  };

  const handleTreatmentSelect = (value: string) => {
    const treatment = CLINIC_DATA[clinicType].treatments[value];
    if (treatment) {
      setTreatmentPlan(CLINIC_DATA[clinicType].guidance + treatment.content);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem("geminiApiKey", value);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    if (!apiKey) {
      toast.error("Please enter your Gemini API key first");
      return;
    }

    const userMessage = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const today = new Date();
      const systemPrompt = `This is a test demo website. You are taking a doctor's treatment plan and basic information about what the clinic does, and the patient is asking you a question. Take the information about the treatment plan and if the answer to the question is in there, answer it. If not, tell the patient you are going to ask the doc for more information.

Surgery Date: ${format(surgeryDate, "MMMM d, yyyy")}
Today's Date: ${format(today, "MMMM d, yyyy")}
Days Since Surgery: ${Math.floor((today.getTime() - surgeryDate.getTime()) / (1000 * 60 * 60 * 24))}

Treatment Plan:
${treatmentPlan || "No treatment plan provided yet."}

Clinic Information:
${baseInfo || "No clinic information provided yet."}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt + "\n\nUser question: " + messageText }
                ]
              }
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request.";

      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please check your API key.";
      toast.error(errorMessage);
      console.error("Full error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            MediCare Portal
          </h1>
          <p className="text-muted-foreground">Streamlined healthcare communication</p>
          <p className="text-sm text-muted-foreground mt-2">
            This is a demo only. Do not put any PII (Personally Identifiable Information) in this interface.
          </p>
        </div>

        <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="doctor" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Doctor
            </TabsTrigger>
            <TabsTrigger value="patient" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctor" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-semibold mb-2 block">
                    Clinic Type
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select the type of clinic
                  </p>
                  <Select value={clinicType} onValueChange={handleClinicTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ortho">Orthopedic</SelectItem>
                      <SelectItem value="derm">Dermatology</SelectItem>
                      <SelectItem value="bariatric">Bariatric Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-lg font-semibold mb-2 block">
                    Surgery/Visit Date
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">
                    When did the surgery or visit occur?
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !surgeryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {surgeryDate ? format(surgeryDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={surgeryDate}
                        onSelect={(date) => date && setSurgeryDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-semibold mb-2 block">
                    Treatment Plan
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter the specific treatment plan for this patient
                  </p>
                  <Select onValueChange={handleTreatmentSelect}>
                    <SelectTrigger className="mb-3">
                      <SelectValue placeholder="Load example treatment plan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CLINIC_DATA[clinicType].treatments).map(([key, treatment]) => (
                        <SelectItem key={key} value={key}>
                          {treatment.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    placeholder="Example: Take medication twice daily with food. Avoid strenuous activity for 2 weeks. Follow up in 10 days..."
                    className="min-h-[400px] resize-y"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-semibold mb-2 block">
                    Base Clinic Information
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">
                    General information about your clinic and standard procedures
                  </p>
                  <Textarea
                    value={baseInfo}
                    onChange={(e) => setBaseInfo(e.target.value)}
                    placeholder="Example: Our clinic specializes in sports medicine. We're open Mon-Fri 9am-5pm. Emergency contact: 555-0123..."
                    className="min-h-[300px] resize-y"
                  />
                </div>
              </div>
            </Card>

            <Button onClick={handleSave} size="lg" className="w-full md:w-auto md:ml-auto flex">
              <Save className="mr-2 h-4 w-4" />
              Save Treatment Plan
            </Button>
          </TabsContent>

          <TabsContent value="patient" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Ask About Your Treatment</h2>
                </div>
                <div className="text-sm text-muted-foreground">
                  Today: {format(new Date(), "MMM d, yyyy")}
                </div>
              </div>

              <div className="space-y-4 mb-4">
                <p className="text-sm text-muted-foreground">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_QUESTIONS.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendMessage(question)}
                      disabled={isLoading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4 bg-background/50">
                {messages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Ask a question to get started
                  </p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.role === "user" ? (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          ) : (
                            <div className="text-sm prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-0">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <p className="text-sm">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 border rounded-md bg-background"
                  disabled={isLoading}
                />
                <Button onClick={() => sendMessage(inputMessage)} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Main;
