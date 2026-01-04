import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Save, Stethoscope, User, MessageSquare, Send, CalendarIcon, Clock, CheckCircle2, Circle, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

type ClinicType = "ortho" | "ent" | "";

interface Reminder {
  daysBeforeSurgery: number;
  message: string;
}

interface ChecklistItem {
  task: string;
  daysBeforeSurgery: number;
  crucial?: boolean; // if true, it's a crucial task; if false/undefined, it's optional
  constant?: boolean; // if true, it's an ongoing reminder (no due date)
}

interface PreOpProcedure {
  label: string;
  instructions: string;
  reminders: Reminder[];
  checklist: ChecklistItem[];
}

const PRE_OP_DATA = {
  ortho: {
    name: "Orthopedic Surgery",
    guidance: `GENERAL PRE-OPERATIVE GUIDANCE:
- Follow all pre-operative instructions carefully
- Arrange for someone to drive you home after surgery
- Plan for assistance at home for the first few days
- Make sure to attend your pre-operative appointment

IMPORTANT MEDICATION INSTRUCTIONS:
- Inform your surgeon of ALL medications you are taking
- Some medications may need to be stopped before surgery
- Do not stop any medications without consulting your surgeon first

`,
    procedures: {
      acl_reconstruction: {
        label: "ACL Reconstruction",
        instructions: `Pre-Operative Instructions - ACL Reconstruction

MEDICATIONS TO STOP:
- Stop taking anti-inflammatory medications (ibuprofen, aspirin, naproxen) 7 days before surgery
- Stop herbal supplements 7 days before surgery
- Continue all other medications unless instructed otherwise

PHYSICAL PREPARATION:
- Practice using crutches before surgery
- Strengthen your upper body and good leg
- Set up a recovery area at home on the first floor
- Stock up on ice packs

FASTING INSTRUCTIONS:
- No food after midnight the night before surgery
- No liquids after midnight the night before surgery
- No gum or mints on the day of surgery

WHAT TO BRING:
- Photo ID and insurance card
- List of current medications
- Loose, comfortable clothing
- Crutches (if you have them)

DAY OF SURGERY:
- Shower with antibacterial soap the morning of surgery
- Do not wear makeup, jewelry, or contact lenses
- Arrive 2 hours before scheduled surgery time`,
        reminders: [
          { daysBeforeSurgery: 21, message: "Hi! Time to schedule your pre-op appointment with your surgeon. You can schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. Looking forward to helping you through this journey! 📅" },
          { daysBeforeSurgery: 14, message: "Quick reminder to complete your pre-op testing (bloodwork, EKG, etc.). Schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. You're doing great! ✨" },
          { daysBeforeSurgery: 7, message: "Hey! Please stop taking anti-inflammatory meds and herbal supplements now. Your surgery is getting close - you've got this! 💪" },
          { daysBeforeSurgery: 3, message: "Just checking in! Make sure you've confirmed your ride home and have someone to help you out after surgery. We're here for you! 🚗" },
          { daysBeforeSurgery: 1, message: "Tomorrow's the big day! Remember to start fasting at midnight tonight - no food or liquids. You're almost there! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! Today's your surgery day! Shower with antibacterial soap and arrive 2 hours early. IMPORTANT: If you ate anything or did not follow any of the instructions, text 'ATE' immediately. You've got this! 🎯" }
        ],
        checklist: [
          { task: "Attend pre-operative appointment with surgeon", daysBeforeSurgery: 21, crucial: true },
          { task: "Complete bloodwork and EKG testing", daysBeforeSurgery: 14, crucial: true },
          { task: "Arrange transportation home from surgery", daysBeforeSurgery: 3, crucial: true },
          { task: "Fill any prescribed post-op medications", daysBeforeSurgery: 2, crucial: true },
          { task: "Pack bag with ID, insurance card, and comfortable clothes", daysBeforeSurgery: 1, crucial: true },
          { task: "No alcohol or smoking until after surgery", daysBeforeSurgery: 0, constant: true },
          { task: "Stop anti-inflammatory medications", daysBeforeSurgery: 7, constant: true },
          { task: "Stop all herbal supplements", daysBeforeSurgery: 7, constant: true },
          { task: "Begin fasting at midnight (no food or liquids)", daysBeforeSurgery: 1, constant: true }
        ]
      },
      rotator_cuff: {
        label: "Rotator Cuff Repair",
        instructions: `Pre-Operative Instructions - Rotator Cuff Repair

MEDICATIONS:
- Stop aspirin and anti-inflammatory medications 7 days before surgery
- Stop blood thinners as directed by your surgeon
- Continue blood pressure and heart medications with a small sip of water on surgery day

PHYSICAL PREPARATION:
- Practice sleeping in a semi-reclined position (use a recliner or pillows)
- Practice dressing with one arm
- Set up your home for one-handed activities
- Arrange help for daily activities for first 2-3 weeks

PRE-OP TESTING:
- Complete all required lab work and medical clearance
- Cardiac clearance if over 50 or with heart conditions
- Bring all test results to pre-op appointment

FASTING GUIDELINES:
- No solid food after midnight before surgery
- Clear liquids only until 2 hours before surgery
- No liquids within 2 hours of surgery time

PREPARE YOUR HOME:
- Button-front shirts (no pullover shirts)
- Stock refrigerator with easy-to-prepare meals
- Move frequently used items to counter height
- Set up sleeping area with extra pillows

DAY OF SURGERY:
- Shower with antibacterial soap
- Wear loose, button-front shirt
- No deodorant on surgical side
- Arrive 90 minutes before scheduled time`,
        reminders: [
          { daysBeforeSurgery: 21, message: "Hello! Time to schedule your pre-op physical and get medical clearance. You can schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. We're here to support you every step of the way! 💙" },
          { daysBeforeSurgery: 14, message: "Friendly reminder to complete your lab work and cardiac testing. Schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. You're making great progress! 🏥" },
          { daysBeforeSurgery: 7, message: "Hi there! Please stop taking aspirin and anti-inflammatory meds starting today. Your recovery journey is about to begin! 💊" },
          { daysBeforeSurgery: 5, message: "Time to grab some button-front shirts and set up your recovery space at home. Making things comfy will help so much! 👕" },
          { daysBeforeSurgery: 3, message: "Just a quick check - do you have your ride and someone to help you after surgery? Almost there! 🤝" },
          { daysBeforeSurgery: 1, message: "Big day tomorrow! Remember to start fasting at midnight tonight. Rest up - you're going to do great! 🌟" },
          { daysBeforeSurgery: 0, message: "Good morning, it's surgery day! Shower with antibacterial soap and wear a button-front shirt. IMPORTANT: If you ate anything or did not follow any of the instructions, text 'ATE' immediately. You've prepared so well! 🎯" }
        ],
        checklist: [
          { task: "Schedule pre-op physical and get medical clearance", daysBeforeSurgery: 21, crucial: true },
          { task: "Complete lab work (CBC, metabolic panel, coagulation studies)", daysBeforeSurgery: 14, crucial: true },
          { task: "Get cardiac clearance if over 50 years old", daysBeforeSurgery: 14, crucial: true },
          { task: "Arrange for help with daily activities for 2-3 weeks", daysBeforeSurgery: 3, crucial: true },
          { task: "Fill post-operative prescriptions", daysBeforeSurgery: 2, crucial: true },
          { task: "Stop aspirin and anti-inflammatory medications", daysBeforeSurgery: 7, constant: true },
          { task: "Begin fasting at midnight (no food or liquids)", daysBeforeSurgery: 1, constant: true },
          { task: "Purchase button-front shirts", daysBeforeSurgery: 7, crucial: false }
        ]
      },
      total_knee: {
        label: "Total Knee Replacement",
        instructions: `Pre-Operative Instructions - Total Knee Replacement

MEDICAL PREPARATION:
- Complete all pre-operative testing (bloodwork, EKG, chest X-ray)
- Dental clearance required - no active infections
- Stop blood thinners as directed by surgeon (typically 5-7 days before)
- Continue all other medications unless told otherwise

HOME PREPARATION:
- Remove trip hazards (loose rugs, electrical cords)
- Install grab bars in bathroom
- Raise toilet seat height (use elevated seat)
- Move bedroom to first floor if possible
- Arrange for walker or crutches

MEDICATIONS TO STOP:
- Anti-inflammatory drugs 7 days before surgery
- Herbal supplements 7 days before surgery
- Blood thinners as directed (typically 5-7 days)

LIFESTYLE:
- Stop smoking at least 4 weeks before surgery
- Lose weight if recommended by surgeon
- Strengthen upper body for walker/crutch use
- Practice exercises shown by physical therapist

FASTING:
- No food after midnight before surgery
- No liquids after midnight before surgery
- Exception: Small sip of water with essential medications only

SURGERY DAY:
- Shower with antibacterial soap (Hibiclens)
- Do not shave surgical site
- Wear loose, comfortable clothing
- Bring walker or crutches
- Arrive 2 hours before scheduled surgery`,
        reminders: [
          { daysBeforeSurgery: 21, message: "Hi! Please complete your dental clearance and pre-op testing at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. Taking care of these steps early makes everything smoother! 😊" },
          { daysBeforeSurgery: 14, message: "Reminder to complete your lab work, EKG, and chest X-ray. Schedule testing at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. You're halfway there - keep up the great work! 🎯" },
          { daysBeforeSurgery: 10, message: "Time to make your home recovery-ready! Install those grab bars and clear any trip hazards. Safety first! 🏠" },
          { daysBeforeSurgery: 7, message: "Please stop anti-inflammatory meds and herbal supplements starting today. Your new knee is just around the corner! 🌟" },
          { daysBeforeSurgery: 3, message: "Quick check-in: Is your transportation and help lined up for the first 2 weeks? You're doing amazing! 🚗" },
          { daysBeforeSurgery: 1, message: "Tomorrow's the day! Start fasting at midnight tonight. Get some good rest - you're so ready for this! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! It's surgery day! Shower with Hibiclens, grab your walker, and arrive 2 hours early. IMPORTANT: If you ate anything or did not follow any of the instructions, text 'ATE' immediately. You've got this! 🎉" }
        ],
        checklist: [
          { task: "Complete dental exam and clearance", daysBeforeSurgery: 21, crucial: true },
          { task: "Complete bloodwork, EKG, and chest X-ray", daysBeforeSurgery: 14, crucial: true },
          { task: "Obtain walker or crutches", daysBeforeSurgery: 5, crucial: true },
          { task: "Arrange for 24/7 assistance for first 3 days", daysBeforeSurgery: 3, crucial: true },
          { task: "Fill post-operative prescriptions", daysBeforeSurgery: 2, crucial: true },
          { task: "Stop anti-inflammatory medications", daysBeforeSurgery: 7, constant: true },
          { task: "Stop herbal supplements", daysBeforeSurgery: 7, constant: true },
          { task: "Begin fasting at midnight (no food or liquids)", daysBeforeSurgery: 1, constant: true },
          { task: "Install grab bars in bathroom", daysBeforeSurgery: 14, crucial: false }
        ]
      }
    },
    clinicInfo: `Orthopedic Surgery Center Information

ABOUT OUR FACILITY:
We are a state-of-the-art ambulatory surgery center specializing in orthopedic procedures. Our team includes board-certified orthopedic surgeons, anesthesiologists, and specialized surgical staff.

PRE-OPERATIVE SERVICES:
- Pre-operative education classes
- Physical therapy consultation
- Medical clearance coordination
- Home safety assessments

FACILITY HOURS:
Monday - Friday: 6:00 AM - 6:00 PM
Pre-op appointments: 8:00 AM - 4:00 PM

CONTACT INFORMATION:
Main Office: (555) 234-5678
Surgery Scheduling: (555) 234-5679
Pre-Op Nurse Line: (555) 234-5680

PRE-OPERATIVE REQUIREMENTS:
- Medical clearance from primary care physician
- All required lab work and testing completed
- Transportation arranged
- Post-operative care assistance confirmed`
  },
  ent: {
    name: "Pediatric ENT Surgery",
    guidance: `GENERAL PRE-OPERATIVE GUIDANCE FOR YOUR CHILD:
- Follow all pre-operative instructions carefully
- Plan to stay with your child during recovery
- Keep your child calm and reassured about the procedure
- Make sure to attend your child's pre-operative appointment

IMPORTANT MEDICATION INSTRUCTIONS:
- Inform your surgeon of ALL medications your child is taking
- Some medications may need to be stopped before surgery
- Do not stop any medications without consulting your surgeon first

`,
    procedures: {
      tonsillectomy: {
        label: "Tonsillectomy",
        instructions: `Pre-Operative Instructions - Tonsillectomy (Pediatric)

MEDICATIONS TO STOP:
- Stop giving ibuprofen, aspirin, or naproxen 7 days before surgery
- Stop herbal supplements 7 days before surgery
- Continue all other medications unless instructed otherwise

BEFORE SURGERY:
- Your child should be healthy - no fever, cough, or runny nose
- Notify us immediately if your child becomes sick before surgery
- Complete any required pre-op bloodwork

FASTING INSTRUCTIONS:
- No food after midnight the night before surgery
- No liquids after midnight the night before surgery
- No gum or candy on the day of surgery

WHAT TO BRING:
- Your child's insurance card and photo ID for parent
- List of current medications
- Comfort item (stuffed animal, blanket)
- Loose, comfortable clothing for your child

DAY OF SURGERY:
- Give your child a bath or shower the morning of surgery
- Arrive 2 hours before scheduled surgery time
- One parent may accompany child to pre-op area`,
        reminders: [
          { daysBeforeSurgery: 14, message: "Hi! Time to complete any pre-op bloodwork for your child. You can schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. We're here to support you and your little one! 💙" },
          { daysBeforeSurgery: 7, message: "Please stop giving your child ibuprofen, aspirin, and herbal supplements starting today. Surgery is getting close! 💊" },
          { daysBeforeSurgery: 3, message: "Stock up on soft foods and popsicles for after surgery - your child will need them for recovery! 🍦" },
          { daysBeforeSurgery: 1, message: "Tomorrow's surgery day! Remember, no food or drinks after midnight tonight. Bring your child's favorite comfort item! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! Surgery day is here! Give your child a bath and arrive 2 hours early. IMPORTANT: If your child ate or drank anything, text 'ATE' immediately. You've got this! 🎯" }
        ],
        checklist: [
          { task: "Complete pre-op bloodwork", daysBeforeSurgery: 14, crucial: true },
          { task: "Fill post-operative pain medication prescription", daysBeforeSurgery: 2, crucial: true },
          { task: "Pack bag with comfort item, insurance card, and loose clothes", daysBeforeSurgery: 1, crucial: true },
          { task: "Stop ibuprofen, aspirin, and herbal supplements", daysBeforeSurgery: 7, constant: true },
          { task: "Begin fasting at midnight (no food or liquids)", daysBeforeSurgery: 1, constant: true },
          { task: "Stock up on soft foods, popsicles, and ice cream", daysBeforeSurgery: 3, crucial: false }
        ]
      },
      ear_tubes: {
        label: "Ear Tube Placement",
        instructions: `Pre-Operative Instructions - Ear Tube Placement (Pediatric)

MEDICATIONS TO STOP:
- Stop giving ibuprofen or aspirin 5 days before surgery
- Continue all other medications unless instructed otherwise
- Tell us about any ear drops your child is currently using

BEFORE SURGERY:
- Your child should be healthy - no fever, cough, or active ear infection
- Notify us immediately if your child becomes sick
- This is typically a very quick procedure (10-15 minutes)

FASTING INSTRUCTIONS:
- No food after midnight the night before surgery
- No liquids after midnight the night before surgery
- No gum or candy on the day of surgery

WHAT TO BRING:
- Your child's insurance card and photo ID for parent
- List of current medications
- Comfort item (stuffed animal, blanket)
- Car seat for ride home

DAY OF SURGERY:
- Give your child a bath the morning of surgery
- Arrive 1.5 hours before scheduled surgery time
- Your child will go home the same day`,
        reminders: [
          { daysBeforeSurgery: 7, message: "Hi! Your child's ear tube surgery is in one week. Please stop ibuprofen and aspirin starting in 2 days. Let us know if your child gets sick! 💙" },
          { daysBeforeSurgery: 5, message: "Please stop giving your child ibuprofen or aspirin starting today. Almost there! 💊" },
          { daysBeforeSurgery: 1, message: "Tomorrow's the day! No food or drinks after midnight. Bring your child's favorite comfort item - this will be quick! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! Surgery day! Give your child a bath and arrive 1.5 hours early. IMPORTANT: If your child ate or drank anything, text 'ATE' immediately. This will be over before you know it! 🎯" }
        ],
        checklist: [
          { task: "Confirm your child is healthy (no fever, cough, or ear infection)", daysBeforeSurgery: 7, crucial: true },
          { task: "Fill any prescribed ear drops for after surgery", daysBeforeSurgery: 2, crucial: true },
          { task: "Pack bag with comfort item and car seat ready", daysBeforeSurgery: 1, crucial: true },
          { task: "Stop ibuprofen and aspirin", daysBeforeSurgery: 5, constant: true },
          { task: "Begin fasting at midnight (no food or liquids)", daysBeforeSurgery: 1, constant: true }
        ]
      },
      adenoidectomy: {
        label: "Adenoidectomy",
        instructions: `Pre-Operative Instructions - Adenoidectomy (Pediatric)

MEDICATIONS TO STOP:
- Stop giving ibuprofen, aspirin, or naproxen 7 days before surgery
- Stop herbal supplements 7 days before surgery
- Continue all other medications unless instructed otherwise

BEFORE SURGERY:
- Your child should be healthy - no fever, cough, or runny nose
- Notify us immediately if your child becomes sick before surgery
- Complete any required pre-op testing

FASTING INSTRUCTIONS:
- No food after midnight the night before surgery
- No liquids after midnight the night before surgery
- No gum or candy on the day of surgery

WHAT TO BRING:
- Your child's insurance card and photo ID for parent
- List of current medications
- Comfort item (stuffed animal, blanket)
- Loose, comfortable clothing

DAY OF SURGERY:
- Give your child a bath or shower the morning of surgery
- Arrive 2 hours before scheduled surgery time
- One parent may accompany child to pre-op area`,
        reminders: [
          { daysBeforeSurgery: 14, message: "Hi! Time to complete any pre-op testing for your child. Schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. We're excited to help your little one breathe easier! 💙" },
          { daysBeforeSurgery: 7, message: "Please stop giving your child ibuprofen, aspirin, and herbal supplements starting today. One week to go! 💊" },
          { daysBeforeSurgery: 3, message: "Stock up on soft foods for after surgery - your child may have a sore throat for a few days. 🍦" },
          { daysBeforeSurgery: 1, message: "Tomorrow's surgery day! No food or drinks after midnight. Bring your child's favorite comfort item! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! Surgery day! Give your child a bath and arrive 2 hours early. IMPORTANT: If your child ate or drank anything, text 'ATE' immediately. You've prepared so well! 🎯" }
        ],
        checklist: [
          { task: "Complete bloodwork & EKG", daysBeforeSurgery: 14, crucial: true },
          { task: "Fill post-operative pain medication prescription", daysBeforeSurgery: 2, crucial: true },
          { task: "Pack bag with comfort item, insurance card, and loose clothes", daysBeforeSurgery: 1, crucial: true },
          { task: "Stop ibuprofen, aspirin, and herbal supplements", daysBeforeSurgery: 7, constant: true },
          { task: "Begin fasting at midnight (no food or liquids)", daysBeforeSurgery: 1, constant: true },
          { task: "Stock up on soft foods and cool drinks", daysBeforeSurgery: 3, crucial: false }
        ]
      }
    },
    clinicInfo: `Pediatric ENT Surgery Center Information

ABOUT OUR FACILITY:
We specialize in pediatric ear, nose, and throat procedures in a child-friendly environment. Our team is experienced in caring for children of all ages.

SERVICES:
- Tonsillectomy and adenoidectomy
- Ear tube placement
- Pediatric sinus procedures
- Hearing evaluations

FACILITY HOURS:
Monday - Friday: 7:00 AM - 5:00 PM
Surgery days: Monday - Thursday

CONTACT INFORMATION:
Main Office: (555) 456-7890
Surgery Scheduling: (555) 456-7891
Pre-Op Nurse Line: (555) 456-7892

WHAT TO EXPECT:
- Child-friendly waiting areas with toys and activities
- Parent can stay with child until anesthesia
- Recovery room designed for families
- Most procedures are same-day discharge`
  }
};

const QUICK_QUESTIONS = [
  "What should I do this week to prepare?",
  "What medications do I need to stop?",
  "What should I bring to surgery?",
];

const PreOpDemo = () => {
  const [clinicType, setClinicType] = useState<ClinicType>("");
  const [selectedProcedure, setSelectedProcedure] = useState<string>("");
  const [preOpInstructions, setPreOpInstructions] = useState("");
  const [baseInfo, setBaseInfo] = useState("");
  const [surgeryDate, setSurgeryDate] = useState<Date>(() => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    return twoWeeksFromNow;
  });
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [showPatientView, setShowPatientView] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("preOpMedicalData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setClinicType((data.clinicType as ClinicType) || "");
      setSelectedProcedure(data.selectedProcedure || "");
      setPreOpInstructions(data.preOpInstructions || "");
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
    localStorage.setItem("preOpMedicalData", JSON.stringify({
      clinicType,
      selectedProcedure,
      preOpInstructions,
      baseInfo,
      surgeryDate: surgeryDate.toISOString(),
      timestamp: new Date().toISOString()
    }));
    toast.success("Pre-op instructions saved successfully");
  };

  const handleClinicTypeChange = (value: string) => {
    const newClinicType = value as ClinicType;
    setClinicType(newClinicType);
    setSelectedProcedure("");
    setPreOpInstructions("");
    if (newClinicType && PRE_OP_DATA[newClinicType]) {
      setBaseInfo(PRE_OP_DATA[newClinicType].clinicInfo);
    } else {
      setBaseInfo("");
    }
  };

  const handleProcedureSelect = (value: string) => {
    if (!clinicType) return;
    setSelectedProcedure(value);
    const procedure = PRE_OP_DATA[clinicType].procedures[value];
    if (procedure) {
      setPreOpInstructions(PRE_OP_DATA[clinicType].guidance + procedure.instructions);
    }
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
      const daysUntilSurgery = differenceInDays(surgeryDate, today);

      // Get checklist items if procedure is selected
      let checklistContext = "";
      if (clinicType && selectedProcedure && PRE_OP_DATA[clinicType]?.procedures[selectedProcedure]) {
        const procedure = PRE_OP_DATA[clinicType].procedures[selectedProcedure];
        checklistContext = "\n\nPre-Op Checklist:\n" +
          procedure.checklist.map(item => `- ${item.task} (${item.daysBeforeSurgery} days before surgery)`).join("\n");
      }

      const systemPrompt = `This is a test demo website for pre-operative care. You are helping a patient prepare for surgery. Use the pre-operative instructions and checklist to answer questions.

IMPORTANT: When answering questions, include a relevant quote from the pre-operative instructions showing where you found the information. Format it like this:
> "Quote from the instructions"

If the answer is not in the provided information, let the patient know you'll ask their care team for clarification.

Surgery Date: ${format(surgeryDate, "MMMM d, yyyy")}
Today's Date: ${format(today, "MMMM d, yyyy")}
Days Until Surgery: ${daysUntilSurgery} days

Pre-Operative Instructions:
${preOpInstructions || "No pre-op instructions provided yet."}
${checklistContext}

Clinic Information:
${baseInfo || "No clinic information provided yet."}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
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
                  { text: systemPrompt + "\n\nPatient question: " + messageText }
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

  const toggleChecklistItem = (index: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getCurrentProcedure = (): PreOpProcedure | null => {
    if (!clinicType || !selectedProcedure) return null;
    return PRE_OP_DATA[clinicType]?.procedures[selectedProcedure] || null;
  };

  const getDateForReminder = (daysBeforeSurgery: number) => {
    return addDays(surgeryDate, -daysBeforeSurgery);
  };

  const isReminderPast = (daysBeforeSurgery: number) => {
    const reminderDate = getDateForReminder(daysBeforeSurgery);
    return reminderDate < new Date();
  };

  const getDaysUntilSurgery = () => {
    return differenceInDays(surgeryDate, new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Grove Health Pre-Op Portal
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            This is a demo only. Do not put any PII (Personally Identifiable Information) in this interface.
          </p>
        </div>

        {!showPatientView ? (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-semibold mb-2 block">
                    Clinic Type
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select the type of surgical clinic
                  </p>
                  <Select value={clinicType} onValueChange={handleClinicTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ortho">Orthopedic Surgery</SelectItem>
                      <SelectItem value="ent">Pediatric ENT Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {clinicType && (
              <>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-lg font-semibold mb-2 block">
                        Sample Pre-Op Template
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select a procedure to load pre-operative instructions (Can make customizable per clinic, surgeon, & patient)
                      </p>
                      <Select value={selectedProcedure} onValueChange={handleProcedureSelect}>
                        <SelectTrigger className="mb-3">
                          <SelectValue placeholder="Select a procedure..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PRE_OP_DATA[clinicType] && Object.entries(PRE_OP_DATA[clinicType].procedures).map(([key, procedure]) => (
                            <SelectItem key={key} value={key}>
                              {procedure.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {selectedProcedure && (
                  <>
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-lg font-semibold mb-2 block">
                            Surgery Date
                          </label>
                          <p className="text-sm text-muted-foreground mb-3">
                            When is the surgery scheduled?
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
                            Pre-Operative Instructions
                          </label>
                          <p className="text-sm text-muted-foreground mb-3">
                            These instructions will be used by the AI chatbot to answer patient questions, create text reminders, and checklist items.
                          </p>
                          <Textarea
                            value={preOpInstructions}
                            onChange={(e) => setPreOpInstructions(e.target.value)}
                            placeholder="Pre-operative instructions will appear here..."
                            className="min-h-[400px] resize-y"
                          />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-lg font-semibold mb-2 block">
                            Clinic Information
                          </label>
                          <p className="text-sm text-muted-foreground mb-3">
                            General information about your surgical center
                          </p>
                          <Textarea
                            value={baseInfo}
                            onChange={(e) => setBaseInfo(e.target.value)}
                            placeholder="Clinic contact information, hours, and services..."
                            className="min-h-[300px] resize-y"
                          />
                        </div>
                      </div>
                    </Card>

                    <div className="flex justify-center">
                      <Button
                        onClick={() => setShowPatientView(true)}
                        size="lg"
                      >
                        <User className="mr-2 h-4 w-4" />
                        View Patient Experience
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              onClick={() => setShowPatientView(false)}
              variant="outline"
              size="sm"
              className="mb-4"
            >
              ← Back to Setup
            </Button>
            {/* Phone Messages Section */}
            <Card className="p-6 bg-gradient-to-b from-muted/30 to-background max-w-4xl mx-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Reminder Messages</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  These are the reminder messages that we send to the patient on your behalf.
                </p>
                <p className="text-sm text-muted-foreground">
                  {getDaysUntilSurgery()} days until your surgery
                </p>
              </div>

              {getCurrentProcedure() ? (
                <div className="flex justify-center">
                  {/* iPhone Frame */}
                  <div className="relative bg-black rounded-[60px] p-3 shadow-2xl" style={{ width: '375px' }}>
                    {/* iPhone Notch/Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-3xl z-10" />

                    {/* Screen */}
                    <div className="bg-white dark:bg-gray-900 rounded-[48px] overflow-hidden">
                      {/* Status Bar */}
                      <div className="bg-white dark:bg-gray-900 px-8 pt-4 pb-2 flex justify-between items-center text-xs font-semibold">
                        <span className="text-black dark:text-white">9:41</span>
                        <div className="flex items-center gap-1">
                          {/* Signal */}
                          <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="1" y="14" width="4" height="8" rx="1" />
                            <rect x="7" y="10" width="4" height="12" rx="1" />
                            <rect x="13" y="6" width="4" height="16" rx="1" />
                            <rect x="19" y="2" width="4" height="20" rx="1" />
                          </svg>
                          {/* WiFi */}
                          <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6.62-2.73l1.42 1.42C8.23 15.3 10.04 14.5 12 14.5s3.77.8 5.2 2.19l1.42-1.42C16.79 13.47 14.5 12.5 12 12.5s-4.79.97-6.62 2.77zm-4.24-4.24l1.42 1.41C5.08 10.11 8.38 8.5 12 8.5s6.92 1.61 9.44 3.94l1.42-1.41C19.68 7.89 16 6 12 6S4.32 7.89 1.14 11.03z"/>
                          </svg>
                          {/* Battery */}
                          <svg className="w-6 h-4 text-black dark:text-white" viewBox="0 0 28 14" fill="currentColor">
                            <rect x="0" y="0" width="25" height="14" rx="3" stroke="currentColor" strokeWidth="1" fill="none" />
                            <rect x="2" y="2" width="20" height="10" rx="1" />
                            <rect x="26" y="4" width="2" height="6" rx="1" />
                          </svg>
                        </div>
                      </div>

                      {/* Messages Header */}
                      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <HeartPulse className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-black dark:text-white">Grove Health</p>
                        </div>
                      </div>

                      {/* Messages Container */}
                      <div className="bg-white dark:bg-gray-900 h-[500px] overflow-y-auto p-4 space-y-3">
                        {getCurrentProcedure()!.reminders
                          .sort((a, b) => b.daysBeforeSurgery - a.daysBeforeSurgery)
                          .map((reminder, index) => {
                            const reminderDate = getDateForReminder(reminder.daysBeforeSurgery);

                            return (
                              <div key={index} className="flex flex-col items-start">
                                {/* Date stamp */}
                                <div className="text-xs text-gray-500 text-center w-full mb-2">
                                  {format(reminderDate, "EEEE, MMMM d")}
                                </div>

                                {/* iPhone-style message bubble */}
                                <div className="flex items-end gap-2 w-full">
                                  <div
                                    className="relative max-w-[85%] rounded-[25px] px-4 py-2.5 bg-[#e5e5ea] dark:bg-gray-600"
                                    style={{
                                      wordWrap: 'break-word',
                                    }}
                                  >
                                    {/* Message tail - using pseudo-element technique */}
                                    <div
                                      className="absolute bottom-0 left-[-7px] w-[20px] h-[25px] bg-[#e5e5ea] dark:bg-gray-600"
                                      style={{
                                        borderBottomRightRadius: '16px 14px',
                                      }}
                                    />
                                    <div
                                      className="absolute bottom-0 left-[-26px] w-[26px] h-[25px] bg-white dark:bg-gray-900"
                                      style={{
                                        borderBottomRightRadius: '10px',
                                      }}
                                    />

                                    <div className="mb-1">
                                      <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                                        {reminder.daysBeforeSurgery === 0
                                          ? "Surgery Day"
                                          : `${reminder.daysBeforeSurgery} days before`}
                                      </span>
                                    </div>
                                    <p
                                      className="text-[13px] leading-snug text-gray-900 dark:text-gray-100"
                                      dangerouslySetInnerHTML={{ __html: reminder.message }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* Home Indicator */}
                      <div className="bg-white dark:bg-gray-900 pb-2 pt-1">
                        <div className="mx-auto w-32 h-1 bg-black dark:bg-white rounded-full opacity-30" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a procedure on the Doctor tab to see your reminder messages</p>
                </div>
              )}
            </Card>

            {/* PCP Scheduling Section */}
            <Card className="p-6 bg-gradient-to-b from-muted/30 to-background max-w-4xl mx-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Appointment Scheduling</h2>
                <p className="text-sm text-muted-foreground">
                  We help patients schedule their PCP appointments via text message.
                </p>
              </div>

              <div className="flex justify-center">
                {/* iPhone Frame */}
                <div className="relative bg-black rounded-[60px] p-3 shadow-2xl" style={{ width: '375px' }}>
                  {/* iPhone Notch/Dynamic Island */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-3xl z-10" />

                  {/* Screen */}
                  <div className="bg-white dark:bg-gray-900 rounded-[48px] overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-white dark:bg-gray-900 px-8 pt-4 pb-2 flex justify-between items-center text-xs font-semibold">
                      <span className="text-black dark:text-white">9:41</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="1" y="14" width="4" height="8" rx="1" />
                          <rect x="7" y="10" width="4" height="12" rx="1" />
                          <rect x="13" y="6" width="4" height="16" rx="1" />
                          <rect x="19" y="2" width="4" height="20" rx="1" />
                        </svg>
                        <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6.62-2.73l1.42 1.42C8.23 15.3 10.04 14.5 12 14.5s3.77.8 5.2 2.19l1.42-1.42C16.79 13.47 14.5 12.5 12 12.5s-4.79.97-6.62 2.77zm-4.24-4.24l1.42 1.41C5.08 10.11 8.38 8.5 12 8.5s6.92 1.61 9.44 3.94l1.42-1.41C19.68 7.89 16 6 12 6S4.32 7.89 1.14 11.03z"/>
                        </svg>
                        <svg className="w-6 h-4 text-black dark:text-white" viewBox="0 0 28 14" fill="currentColor">
                          <rect x="0" y="0" width="25" height="14" rx="3" stroke="currentColor" strokeWidth="1" fill="none" />
                          <rect x="2" y="2" width="20" height="10" rx="1" />
                          <rect x="26" y="4" width="2" height="6" rx="1" />
                        </svg>
                      </div>
                    </div>

                    {/* Messages Header */}
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <HeartPulse className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-black dark:text-white">Grove Health</p>
                      </div>
                    </div>

                    {/* Messages Container */}
                    <div className="bg-white dark:bg-gray-900 h-[500px] overflow-y-auto p-4 space-y-3">
                      {/* Initial scheduling message */}
                      <div className="flex flex-col items-start">
                        <div className="text-xs text-gray-500 text-center w-full mb-2">
                          Today
                        </div>
                        <div className="flex items-end gap-2 w-full">
                          <div className="relative max-w-[85%] rounded-[25px] px-4 py-2.5 bg-[#e5e5ea] dark:bg-gray-600">
                            <div className="absolute bottom-0 left-[-7px] w-[20px] h-[25px] bg-[#e5e5ea] dark:bg-gray-600" style={{ borderBottomRightRadius: '16px 14px' }} />
                            <div className="absolute bottom-0 left-[-26px] w-[26px] h-[25px] bg-white dark:bg-gray-900" style={{ borderBottomRightRadius: '10px' }} />
                            <p className="text-[13px] leading-snug text-gray-900 dark:text-gray-100">
                              Hi! Time to schedule your child's pre-op appointment with your PCP. Here are available times:
                              <br /><br />
                              <strong>1.</strong> Mon, Dec 2 at 9:00 AM<br />
                              <strong>2.</strong> Tue, Dec 3 at 2:30 PM<br />
                              <strong>3.</strong> Wed, Dec 4 at 10:00 AM
                              <br /><br />
                              Reply with 1, 2, or 3 to book, or send your own preferred time and we'll schedule it for you! 📅
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* User reply */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-end gap-2 w-full justify-end">
                          <div className="relative max-w-[85%] rounded-[25px] px-4 py-2.5 bg-[#007AFF] text-white">
                            <div className="absolute bottom-0 right-[-7px] w-[20px] h-[25px] bg-[#007AFF]" style={{ borderBottomLeftRadius: '16px 14px' }} />
                            <div className="absolute bottom-0 right-[-26px] w-[26px] h-[25px] bg-white dark:bg-gray-900" style={{ borderBottomLeftRadius: '10px' }} />
                            <p className="text-[13px] leading-snug">
                              2
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Confirmation message */}
                      <div className="flex flex-col items-start">
                        <div className="flex items-end gap-2 w-full">
                          <div className="relative max-w-[85%] rounded-[25px] px-4 py-2.5 bg-[#e5e5ea] dark:bg-gray-600">
                            <div className="absolute bottom-0 left-[-7px] w-[20px] h-[25px] bg-[#e5e5ea] dark:bg-gray-600" style={{ borderBottomRightRadius: '16px 14px' }} />
                            <div className="absolute bottom-0 left-[-26px] w-[26px] h-[25px] bg-white dark:bg-gray-900" style={{ borderBottomRightRadius: '10px' }} />
                            <p className="text-[13px] leading-snug text-gray-900 dark:text-gray-100">
                              Perfect! You're all set for <strong>Tuesday, December 3 at 2:30 PM</strong> with Dr. Smith at Pediatric Care Associates.
                              <br /><br />
                              All you need to do is show up! We'll send you a reminder the day before. 🎉
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="bg-white dark:bg-gray-900 pb-2 pt-1">
                      <div className="mx-auto w-32 h-1 bg-black dark:bg-white rounded-full opacity-30" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Checklist Section */}
            <Card className="p-6 max-w-4xl mx-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Pre-Op Checklist</h2>
                <p className="text-sm text-muted-foreground">
                  This is the checklist the patient sees when they log into the app.
                </p>
              </div>

              {getCurrentProcedure() ? (
                <div className="flex justify-center">
                  {/* iPhone Frame */}
                  <div className="relative bg-black rounded-[60px] p-3 shadow-2xl" style={{ width: '375px' }}>
                    {/* iPhone Notch/Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-3xl z-10" />

                    {/* Screen */}
                    <div className="bg-white dark:bg-gray-900 rounded-[48px] overflow-hidden">
                      {/* Status Bar */}
                      <div className="bg-white dark:bg-gray-900 px-8 pt-4 pb-2 flex justify-between items-center text-xs font-semibold">
                        <span className="text-black dark:text-white">9:41</span>
                        <div className="flex items-center gap-1">
                          {/* Signal */}
                          <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="1" y="14" width="4" height="8" rx="1" />
                            <rect x="7" y="10" width="4" height="12" rx="1" />
                            <rect x="13" y="6" width="4" height="16" rx="1" />
                            <rect x="19" y="2" width="4" height="20" rx="1" />
                          </svg>
                          {/* WiFi */}
                          <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6.62-2.73l1.42 1.42C8.23 15.3 10.04 14.5 12 14.5s3.77.8 5.2 2.19l1.42-1.42C16.79 13.47 14.5 12.5 12 12.5s-4.79.97-6.62 2.77zm-4.24-4.24l1.42 1.41C5.08 10.11 8.38 8.5 12 8.5s6.92 1.61 9.44 3.94l1.42-1.41C19.68 7.89 16 6 12 6S4.32 7.89 1.14 11.03z"/>
                          </svg>
                          {/* Battery */}
                          <svg className="w-6 h-4 text-black dark:text-white" viewBox="0 0 28 14" fill="currentColor">
                            <rect x="0" y="0" width="25" height="14" rx="3" stroke="currentColor" strokeWidth="1" fill="none" />
                            <rect x="2" y="2" width="20" height="10" rx="1" />
                            <rect x="26" y="4" width="2" height="6" rx="1" />
                          </svg>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-black dark:text-white">Pre-Op Checklist</p>
                          <p className="text-xs text-gray-500">Grove Health</p>
                        </div>
                      </div>

                      {/* Checklist Container */}
                      <div className="bg-gray-50 dark:bg-gray-900 h-[500px] overflow-y-auto p-3 space-y-4">
                        {/* Active Ongoing Reminders Section */}
                        {getCurrentProcedure()!.checklist.filter(item => item.constant && getDateForReminder(item.daysBeforeSurgery) <= new Date()).length > 0 && (
                          <div>
                            <h3 className="text-xs font-semibold mb-2 text-gray-900 dark:text-white">
                              Ongoing Reminders
                            </h3>
                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                              <ul className="space-y-1.5">
                                {getCurrentProcedure()!.checklist
                                  .filter(item => item.constant && getDateForReminder(item.daysBeforeSurgery) <= new Date())
                                  .map((item) => {
                                    const actualIndex = getCurrentProcedure()!.checklist.indexOf(item);
                                    return (
                                      <li key={actualIndex} className="text-[11px] font-medium text-gray-800 dark:text-gray-200 flex items-start gap-1.5">
                                        <span className="text-blue-500 mt-0.5">•</span>
                                        {item.task}
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Crucial Tasks Section */}
                        {getCurrentProcedure()!.checklist.filter(item => item.crucial).length > 0 && (
                          <div>
                            <h3 className="text-xs font-semibold mb-2 text-gray-900 dark:text-white">
                              Things You Need to Do
                            </h3>
                            <div className="space-y-2">
                              {getCurrentProcedure()!.checklist
                                .filter(item => item.crucial)
                                .sort((a, b) => {
                                  const dateA = getDateForReminder(a.daysBeforeSurgery);
                                  const dateB = getDateForReminder(b.daysBeforeSurgery);
                                  const now = new Date();
                                  const aIsFuture = dateA > now;
                                  const bIsFuture = dateB > now;
                                  if (aIsFuture && !bIsFuture) return 1;
                                  if (!aIsFuture && bIsFuture) return -1;
                                  return b.daysBeforeSurgery - a.daysBeforeSurgery;
                                })
                                .map((item) => {
                                  const dueDate = getDateForReminder(item.daysBeforeSurgery);
                                  const actualIndex = getCurrentProcedure()!.checklist.indexOf(item);
                                  const isChecked = checkedItems.has(actualIndex);
                                  const isPastDue = dueDate < new Date();
                                  const isFuture = dueDate > new Date();
                                  const nextWeek = new Date();
                                  nextWeek.setDate(nextWeek.getDate() + 7);
                                  const isDueWithinWeek = dueDate <= nextWeek;

                                  return (
                                    <div
                                      key={actualIndex}
                                      className={cn(
                                        "flex items-start gap-2 p-2.5 rounded-xl transition-colors cursor-pointer",
                                        isChecked
                                          ? "bg-gray-100 dark:bg-gray-800"
                                          : isFuture && !isDueWithinWeek
                                            ? "bg-gray-100 dark:bg-gray-800 opacity-50"
                                            : isPastDue
                                              ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                                              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                      )}
                                      onClick={() => toggleChecklistItem(actualIndex)}
                                    >
                                      <button className="mt-0.5 shrink-0">
                                        {isChecked ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <Circle className="h-4 w-4 text-gray-400" />
                                        )}
                                      </button>
                                      <div className="flex-1 min-w-0">
                                        <p className={cn(
                                          "text-[11px] font-medium leading-tight",
                                          isChecked ? "line-through text-gray-400" : "text-gray-900 dark:text-white"
                                        )}>
                                          {item.task}
                                        </p>
                                        <span className={cn(
                                          "text-[9px] font-semibold",
                                          isPastDue && !isChecked ? "text-red-500" : "text-gray-500"
                                        )}>
                                          {format(dueDate, "MMM d")}
                                          {isPastDue && !isChecked && " • Overdue"}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}

                        {/* Optional Tasks Section */}
                        {getCurrentProcedure()!.checklist.filter(item => !item.crucial && !item.constant).length > 0 && (
                          <div>
                            <h3 className="text-xs font-semibold mb-2 text-gray-500">
                              Things That Would Be Good to Do
                            </h3>
                            <div className="space-y-2">
                              {getCurrentProcedure()!.checklist
                                .filter(item => !item.crucial && !item.constant)
                                .sort((a, b) => {
                                  const dateA = getDateForReminder(a.daysBeforeSurgery);
                                  const dateB = getDateForReminder(b.daysBeforeSurgery);
                                  const now = new Date();
                                  const aIsFuture = dateA > now;
                                  const bIsFuture = dateB > now;
                                  if (aIsFuture && !bIsFuture) return 1;
                                  if (!aIsFuture && bIsFuture) return -1;
                                  return b.daysBeforeSurgery - a.daysBeforeSurgery;
                                })
                                .map((item) => {
                                  const dueDate = getDateForReminder(item.daysBeforeSurgery);
                                  const actualIndex = getCurrentProcedure()!.checklist.indexOf(item);
                                  const isChecked = checkedItems.has(actualIndex);
                                  const isFuture = dueDate > new Date();
                                  const nextWeek = new Date();
                                  nextWeek.setDate(nextWeek.getDate() + 7);
                                  const isDueWithinWeek = dueDate <= nextWeek;

                                  return (
                                    <div
                                      key={actualIndex}
                                      className={cn(
                                        "flex items-start gap-2 p-2.5 rounded-xl transition-colors cursor-pointer",
                                        isChecked
                                          ? "bg-gray-100 dark:bg-gray-800"
                                          : isFuture && !isDueWithinWeek
                                            ? "bg-gray-100 dark:bg-gray-800 opacity-50"
                                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                      )}
                                      onClick={() => toggleChecklistItem(actualIndex)}
                                    >
                                      <button className="mt-0.5 shrink-0">
                                        {isChecked ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <Circle className="h-4 w-4 text-gray-400" />
                                        )}
                                      </button>
                                      <div className="flex-1 min-w-0">
                                        <p className={cn(
                                          "text-[11px] leading-tight",
                                          isChecked ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"
                                        )}>
                                          {item.task}
                                        </p>
                                        <span className="text-[9px] text-gray-500">
                                          {format(dueDate, "MMM d")}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}

                        {/* Future Reminders Section */}
                        {getCurrentProcedure()!.checklist.filter(item => item.constant && getDateForReminder(item.daysBeforeSurgery) > new Date()).length > 0 && (
                          <div>
                            <h3 className="text-xs font-semibold mb-2 text-gray-400">
                              Future Reminders
                            </h3>
                            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 opacity-60">
                              <ul className="space-y-2">
                                {getCurrentProcedure()!.checklist
                                  .filter(item => item.constant && getDateForReminder(item.daysBeforeSurgery) > new Date())
                                  .sort((a, b) => b.daysBeforeSurgery - a.daysBeforeSurgery)
                                  .map((item) => {
                                    const actualIndex = getCurrentProcedure()!.checklist.indexOf(item);
                                    const startDate = getDateForReminder(item.daysBeforeSurgery);
                                    return (
                                      <li key={actualIndex} className="text-[10px] text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-gray-600 dark:text-gray-300">{item.task}</span>
                                        <br />
                                        <span className="text-[9px]">
                                          Starts {format(startDate, "MMM d")} ({item.daysBeforeSurgery} days before surgery)
                                        </span>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Home Indicator */}
                      <div className="bg-gray-50 dark:bg-gray-900 pb-2 pt-1">
                        <div className="mx-auto w-32 h-1 bg-black dark:bg-white rounded-full opacity-30" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a procedure on the Doctor tab to see your checklist</p>
                </div>
              )}
            </Card>

            {/* Chatbot Section */}
            <Card className="p-6 max-w-4xl mx-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Ask Questions</h2>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Today: {format(new Date(), "MMM d, yyyy")}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is the space where patients can ask any questions about their surgery.
                </p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PreOpDemo;
