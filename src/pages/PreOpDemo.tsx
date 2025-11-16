import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Save, Stethoscope, User, MessageSquare, Send, CalendarIcon, Clock, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

type ClinicType = "ortho" | "derm" | "bariatric" | "";

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
          { daysBeforeSurgery: 30, message: "Hi! Time to schedule your pre-op appointment with your surgeon. You can schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. Looking forward to helping you through this journey! 📅" },
          { daysBeforeSurgery: 14, message: "Quick reminder to complete your pre-op testing (bloodwork, EKG, etc.). Schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. You're doing great! ✨" },
          { daysBeforeSurgery: 7, message: "Hey! Please stop taking anti-inflammatory meds and herbal supplements now. Your surgery is getting close - you've got this! 💪" },
          { daysBeforeSurgery: 3, message: "Just checking in! Make sure you've confirmed your ride home and have someone to help you out after surgery. We're here for you! 🚗" },
          { daysBeforeSurgery: 1, message: "Tomorrow's the big day! Remember to start fasting at midnight tonight - no food or liquids. You're almost there! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! Today's your surgery day! Shower with antibacterial soap and arrive 2 hours early. IMPORTANT: If you ate anything or did not follow any of the instructions, text 'ATE' immediately. You've got this! 🎯" }
        ],
        checklist: [
          { task: "Attend pre-operative appointment with surgeon", daysBeforeSurgery: 30, crucial: true },
          { task: "Complete bloodwork and EKG testing", daysBeforeSurgery: 14, crucial: true },
          { task: "Stop anti-inflammatory medications (ibuprofen, aspirin, naproxen)", daysBeforeSurgery: 7, crucial: true },
          { task: "Stop all herbal supplements", daysBeforeSurgery: 7, crucial: true },
          { task: "Practice using crutches", daysBeforeSurgery: 7, crucial: false },
          { task: "Arrange transportation home from surgery", daysBeforeSurgery: 3, crucial: true },
          { task: "Set up recovery area at home", daysBeforeSurgery: 3, crucial: false },
          { task: "Fill any prescribed post-op medications", daysBeforeSurgery: 2, crucial: true },
          { task: "Pack bag with ID, insurance card, and comfortable clothes", daysBeforeSurgery: 1, crucial: true },
          { task: "Begin fasting at midnight (no food or liquids)", daysBeforeSurgery: 1, crucial: true },
          { task: "No alcohol consumption until after surgery", daysBeforeSurgery: 0, constant: true },
          { task: "Avoid smoking and nicotine products", daysBeforeSurgery: 0, constant: true },
          { task: "Keep your surgical knee elevated when resting", daysBeforeSurgery: 0, constant: true }
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
          { daysBeforeSurgery: 30, message: "Hello! Time to schedule your pre-op physical and get medical clearance. You can schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. We're here to support you every step of the way! 💙" },
          { daysBeforeSurgery: 14, message: "Friendly reminder to complete your lab work and cardiac testing. Schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. You're making great progress! 🏥" },
          { daysBeforeSurgery: 7, message: "Hi there! Please stop taking aspirin and anti-inflammatory meds starting today. Your recovery journey is about to begin! 💊" },
          { daysBeforeSurgery: 5, message: "Time to grab some button-front shirts and set up your recovery space at home. Making things comfy will help so much! 👕" },
          { daysBeforeSurgery: 3, message: "Just a quick check - do you have your ride and someone to help you after surgery? Almost there! 🤝" },
          { daysBeforeSurgery: 1, message: "Big day tomorrow! Remember to start fasting at midnight tonight. Rest up - you're going to do great! 🌟" },
          { daysBeforeSurgery: 0, message: "Good morning, it's surgery day! Shower with antibacterial soap and wear a button-front shirt. IMPORTANT: If you ate anything or did not follow any of the instructions, text 'ATE' immediately. You've prepared so well! 🎯" }
        ],
        checklist: [
          { task: "Schedule pre-op physical and get medical clearance", daysBeforeSurgery: 30, crucial: true },
          { task: "Complete lab work (CBC, metabolic panel, coagulation studies)", daysBeforeSurgery: 14, crucial: true },
          { task: "Get cardiac clearance if over 50 years old", daysBeforeSurgery: 14, crucial: true },
          { task: "Stop aspirin and anti-inflammatory medications", daysBeforeSurgery: 7, crucial: true },
          { task: "Purchase button-front shirts (3-4 shirts)", daysBeforeSurgery: 7, crucial: false },
          { task: "Practice sleeping in recliner or semi-reclined", daysBeforeSurgery: 7, crucial: false },
          { task: "Stock refrigerator with easy-to-prepare meals", daysBeforeSurgery: 3, crucial: false },
          { task: "Arrange for help with daily activities for 2-3 weeks", daysBeforeSurgery: 3, crucial: true },
          { task: "Fill post-operative prescriptions", daysBeforeSurgery: 2, crucial: true },
          { task: "Begin fasting at midnight", daysBeforeSurgery: 1, crucial: true }
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
          { daysBeforeSurgery: 60, message: "Hey! Let's get you strong for surgery! Time to start your pre-op physical therapy and exercises. You've got plenty of time to build up! 💪" },
          { daysBeforeSurgery: 30, message: "Hi! Please schedule your dental clearance and pre-op testing at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. Taking care of these steps early makes everything smoother! 😊" },
          { daysBeforeSurgery: 14, message: "Reminder to complete your lab work, EKG, and chest X-ray. Schedule testing at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. You're halfway there - keep up the great work! 🎯" },
          { daysBeforeSurgery: 10, message: "Time to make your home recovery-ready! Install those grab bars and clear any trip hazards. Safety first! 🏠" },
          { daysBeforeSurgery: 7, message: "Please stop anti-inflammatory meds and herbal supplements starting today. Your new knee is just around the corner! 🌟" },
          { daysBeforeSurgery: 3, message: "Quick check-in: Is your transportation and help lined up for the first 2 weeks? You're doing amazing! 🚗" },
          { daysBeforeSurgery: 1, message: "Tomorrow's the day! Start fasting at midnight tonight. Get some good rest - you're so ready for this! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! It's surgery day! Shower with Hibiclens, grab your walker, and arrive 2 hours early. IMPORTANT: If you ate anything or did not follow any of the instructions, text 'ATE' immediately. You've got this! 🎉" }
        ],
        checklist: [
          { task: "Complete dental exam and clearance", daysBeforeSurgery: 30, crucial: true },
          { task: "Install grab bars in bathroom", daysBeforeSurgery: 14, crucial: false },
          { task: "Get raised toilet seat", daysBeforeSurgery: 14, crucial: false },
          { task: "Complete bloodwork, EKG, and chest X-ray", daysBeforeSurgery: 14, crucial: true },
          { task: "Remove trip hazards from home (rugs, cords)", daysBeforeSurgery: 10, crucial: false },
          { task: "Stock up on ice packs and easy-to-prepare meals", daysBeforeSurgery: 7, crucial: false },
          { task: "Stop anti-inflammatory medications", daysBeforeSurgery: 7, crucial: true },
          { task: "Stop herbal supplements", daysBeforeSurgery: 7, crucial: true },
          { task: "Obtain walker or crutches", daysBeforeSurgery: 5, crucial: true },
          { task: "Arrange for 24/7 assistance for first 3 days", daysBeforeSurgery: 3, crucial: true },
          { task: "Fill post-operative prescriptions", daysBeforeSurgery: 2, crucial: true },
          { task: "Begin fasting at midnight", daysBeforeSurgery: 1, crucial: true }
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
  derm: {
    name: "Dermatology Surgery",
    guidance: `GENERAL SURGICAL PREPARATION:
- Inform us of all medications, especially blood thinners
- Arrange transportation if you will be sedated
- Eat a light meal before your procedure
- Wear comfortable, loose-fitting clothing

`,
    procedures: {
      mohs_surgery: {
        label: "Mohs Surgery",
        instructions: `Pre-Operative Instructions - Mohs Surgery

MEDICATIONS:
- Continue all regular medications unless told otherwise
- Stop aspirin and blood thinners 7 days before if approved by prescribing doctor
- Avoid alcohol 48 hours before surgery
- Do not take herbal supplements that thin blood (ginseng, ginkgo, garlic)

PREPARATION:
- Eat a normal breakfast or lunch before procedure
- Wear comfortable clothing (procedure may take several hours)
- Bring something to read or keep you occupied
- Plan for a full day at the clinic

WHAT TO EXPECT:
- Procedure is done in stages with waiting between stages
- Each stage takes about 1-2 hours
- Average Mohs surgery takes 2-4 hours total
- You may go home same day with bandage

ARRANGE:
- Transportation home (especially if anxious or sedated)
- Time off work for procedure and recovery (typically 1-3 days)
- Follow-up appointment for suture removal

DO NOT:
- Wear makeup or skincare products on treatment area
- Wear contact lenses (glasses are fine)
- Smoke or use nicotine 48 hours before
- Drink alcohol 48 hours before`,
        reminders: [
          { daysBeforeSurgery: 14, message: "Hi! Please schedule your Mohs procedure at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a> and check with your doctor about stopping blood thinners. Better to confirm now so you're all set! 📋" },
          { daysBeforeSurgery: 7, message: "If your doctor approved it, please stop aspirin and blood thinners now. You're doing great with your prep! 💊" },
          { daysBeforeSurgery: 3, message: "Time to arrange your ride and request time off work. The procedure can take a few hours, so bring something to read! 📚" },
          { daysBeforeSurgery: 2, message: "Reminder to stop smoking, alcohol, and blood-thinning supplements. Almost procedure day! 🌟" },
          { daysBeforeSurgery: 0, message: "Good morning! Eat a normal meal, wear comfy clothes, and bring something to read. IMPORTANT: If you did not follow any of the instructions, text 'ATE' immediately. We'll take good care of you today! 😊" }
        ],
        checklist: [
          { task: "Check with prescribing doctor about stopping blood thinners", daysBeforeSurgery: 14, crucial: true },
          { task: "Stop aspirin if approved", daysBeforeSurgery: 7, crucial: true },
          { task: "Stop blood-thinning supplements (ginkgo, ginseng, garlic)", daysBeforeSurgery: 7, crucial: true },
          { task: "Arrange transportation home", daysBeforeSurgery: 3, crucial: true },
          { task: "Request time off work (1-3 days)", daysBeforeSurgery: 3, crucial: false },
          { task: "Stop smoking and nicotine", daysBeforeSurgery: 2, crucial: true },
          { task: "Stop drinking alcohol", daysBeforeSurgery: 2, crucial: true },
          { task: "Pack bag with reading material, snacks, phone charger", daysBeforeSurgery: 1, crucial: false }
        ]
      },
      skin_cancer_excision: {
        label: "Skin Cancer Excision",
        instructions: `Pre-Operative Instructions - Skin Cancer Excision

MEDICATIONS:
- Continue all regular medications
- Stop blood thinners 5-7 days before only if approved by your doctor
- Inform us if you take medications for diabetes
- Avoid anti-inflammatory drugs 3 days before

BEFORE YOUR PROCEDURE:
- Shower normally the morning of procedure
- Do not apply makeup, lotion, or skincare to treatment area
- Wear comfortable, loose clothing
- Eat a light meal before arriving

WHAT TO BRING:
- Insurance card and photo ID
- List of current medications
- Someone to drive you home (if receiving sedation)

PLAN AHEAD:
- Take day off work
- Avoid strenuous activity for 24-48 hours after
- Keep wound care supplies at home (gauze, tape, antibiotic ointment)

IMPORTANT:
- Notify us if you develop a cold, infection, or fever before surgery
- Tell us about any allergies (especially to local anesthetics)
- Inform us if you have a pacemaker or metal implants`,
        reminders: [
          { daysBeforeSurgery: 7, message: "Hi there! Please schedule your procedure at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a> if you haven't already. If your doctor approved it, please stop blood thinners now. You're on track! 💙" },
          { daysBeforeSurgery: 3, message: "Time to stop anti-inflammatory meds like ibuprofen. Your procedure is coming up soon! 💊" },
          { daysBeforeSurgery: 1, message: "Tomorrow's the day! Make sure you have a ride if you're getting sedation, and take it easy. You've got this! 🚗" },
          { daysBeforeSurgery: 0, message: "Good morning! Eat a light meal, shower, and skip products on the surgical area. IMPORTANT: If you did not follow any of the instructions, text 'ATE' immediately. See you soon! 😊" }
        ],
        checklist: [
          { task: "Confirm with doctor about stopping blood thinners", daysBeforeSurgery: 7, crucial: true },
          { task: "Stop anti-inflammatory medications", daysBeforeSurgery: 3, crucial: true },
          { task: "Arrange transportation if receiving sedation", daysBeforeSurgery: 2, crucial: true },
          { task: "Request time off work", daysBeforeSurgery: 2, crucial: false },
          { task: "Purchase wound care supplies (gauze, tape, antibiotic ointment)", daysBeforeSurgery: 2, crucial: false },
          { task: "Plan light meals and rest for procedure day", daysBeforeSurgery: 1, crucial: false }
        ]
      }
    },
    clinicInfo: `Dermatology Surgery Center Information

ABOUT OUR PRACTICE:
Board-certified dermatologic surgeons specializing in skin cancer removal and reconstruction.

SERVICES:
- Mohs micrographic surgery
- Skin cancer excision
- Reconstructive procedures
- Same-day pathology results

OFFICE HOURS:
Monday - Friday: 7:00 AM - 4:00 PM
Mohs surgery: Monday - Thursday

CONTACT:
Phone: (555) 123-4567
Pre-Op Nurse: (555) 123-4568

WHAT TO EXPECT:
- Most procedures done under local anesthesia
- Same-day discharge
- Pathology results typically same day (Mohs) or within 7-10 days`
  },
  bariatric: {
    name: "Bariatric Surgery",
    guidance: `PRE-OPERATIVE BARIATRIC SURGERY REQUIREMENTS:
- Complete all required medical clearances
- Attend nutrition education classes
- Meet with psychologist for evaluation
- Demonstrate commitment to lifestyle changes
- Follow pre-operative diet as instructed

`,
    procedures: {
      gastric_bypass: {
        label: "Gastric Bypass Surgery",
        instructions: `Pre-Operative Instructions - Gastric Bypass

PRE-OP REQUIREMENTS (Complete 2-3 months before):
- Nutritionist consultations (minimum 3 visits)
- Psychological evaluation and clearance
- Medical clearance from primary care physician
- Sleep study if indicated
- Cardiac clearance if risk factors present
- Upper endoscopy

PRE-OP DIET (2 weeks before surgery):
- High-protein, low-carb diet
- Protein shakes 2-3 times per day
- Lean proteins and non-starchy vegetables
- No sugar, fried foods, or high-fat foods
- Goal: Reduce liver size for safer surgery

LIQUID DIET (2 days before surgery):
- Clear liquids only
- Protein shakes allowed
- Broth, sugar-free beverages
- No solid food

MEDICATIONS:
- Stop NSAIDs 7 days before
- Stop blood thinners as directed
- Continue blood pressure and diabetes medications
- Stop smoking 8 weeks before surgery

HOME PREPARATION:
- Stock protein shakes and clear liquids
- Prepare pureed food for after surgery
- Arrange help at home for first week
- Set up comfortable recovery area

FASTING:
- No food after midnight before surgery
- No liquids after midnight before surgery

SURGERY DAY:
- Shower with Hibiclens antibacterial soap
- Arrive 2 hours early
- Bring CPAP machine if you use one
- Wear comfortable, loose clothing`,
        reminders: [
          { daysBeforeSurgery: 90, message: "Welcome to your pre-op program! Time to start nutrition classes and evaluations. You can schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. This is an exciting journey - we're here for you! 🌟" },
          { daysBeforeSurgery: 60, message: "Hi! Please complete your psychological evaluation and medical clearances. Schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. You're making amazing progress on this journey! 💪" },
          { daysBeforeSurgery: 30, message: "Time to schedule your sleep study and upper endoscopy at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. These important steps help ensure your safety. You're doing great! 🏥" },
          { daysBeforeSurgery: 14, message: "Starting today: high-protein diet with 2-3 protein shakes daily! This helps prepare your body. You've got this! 🥤" },
          { daysBeforeSurgery: 7, message: "Please stop NSAIDs and double-check your medication plan with your surgeon. One week to go - so exciting! 💊" },
          { daysBeforeSurgery: 3, message: "Stock up time! Grab protein shakes, clear liquids, and pureed foods for after surgery. Almost there! 🛒" },
          { daysBeforeSurgery: 2, message: "Switching to liquid-only today - protein shakes, broth, and sugar-free drinks. You're doing amazing! 🥛" },
          { daysBeforeSurgery: 1, message: "Tomorrow's your big day! Start fasting at midnight tonight. Rest well - you've prepared so well for this! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! Surgery day is here! Shower with Hibiclens, bring your CPAP if needed, and arrive 2 hours early. IMPORTANT: If you ate anything or did not follow any of the instructions, text 'ATE' immediately. You've got this! 🎉" }
        ],
        checklist: [
          { task: "Complete nutritionist consultations (minimum 3 visits)", daysBeforeSurgery: 90, crucial: true },
          { task: "Complete psychological evaluation", daysBeforeSurgery: 60, crucial: true },
          { task: "Get medical clearance from primary care doctor", daysBeforeSurgery: 60, crucial: true },
          { task: "Complete sleep study", daysBeforeSurgery: 30, crucial: true },
          { task: "Complete upper endoscopy", daysBeforeSurgery: 30, crucial: true },
          { task: "Stop smoking (must be smoke-free)", daysBeforeSurgery: 56, crucial: true },
          { task: "Start high-protein, low-carb pre-op diet", daysBeforeSurgery: 14, crucial: true },
          { task: "Stop NSAIDs (ibuprofen, aspirin, naproxen)", daysBeforeSurgery: 7, crucial: true },
          { task: "Purchase protein shakes (2-3 weeks supply)", daysBeforeSurgery: 7, crucial: false },
          { task: "Stock clear liquids and sugar-free beverages", daysBeforeSurgery: 3, crucial: false },
          { task: "Arrange for help at home for first week", daysBeforeSurgery: 3, crucial: true },
          { task: "Begin liquid-only diet", daysBeforeSurgery: 2, crucial: true },
          { task: "Begin fasting at midnight", daysBeforeSurgery: 1, crucial: true }
        ]
      },
      gastric_sleeve: {
        label: "Gastric Sleeve Surgery",
        instructions: `Pre-Operative Instructions - Gastric Sleeve

PRE-OP PROGRAM (2-3 months before):
- Nutrition education sessions
- Psychological evaluation
- Medical evaluations and clearances
- Demonstrate 6-month supervised weight loss attempt
- Upper GI endoscopy

MEDICAL CLEARANCES REQUIRED:
- Primary care physician clearance
- Cardiology clearance (if risk factors)
- Sleep study (if symptoms of sleep apnea)
- Pulmonary clearance (if lung disease)

PRE-OP DIET (14 days before):
- Low-carb, high-protein diet (80-100g protein daily)
- Protein shakes as meal replacements
- Vegetables and lean proteins
- No sugar, pasta, bread, rice
- Goal: Shrink liver for safer surgery

LIQUID PHASE (3 days before):
- Protein shakes only
- Clear broth
- Sugar-free beverages
- No solid food

MEDICATIONS:
- Stop NSAIDs 10 days before
- Stop blood thinners as directed
- Stop birth control pills 1 month before
- Continue thyroid and blood pressure meds

LIFESTYLE:
- No smoking for 8 weeks before surgery
- No alcohol 48 hours before
- Regular exercise (walking 30 min/day)

PREPARE YOUR HOME:
- Buy protein shakes (3 weeks supply)
- Buy clear liquid supplies
- Small plates and utensils
- Arrange childcare/pet care
- Help for first 5-7 days

SURGERY DAY:
- Shower with antibacterial soap
- No food or liquids after midnight
- Bring CPAP if you use one
- Arrive 90 minutes early`,
        reminders: [
          { daysBeforeSurgery: 90, message: "Welcome! Time to begin your bariatric program and education classes. You can schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. This is the start of an amazing transformation! 🌟" },
          { daysBeforeSurgery: 60, message: "Hi! Let's get your psychological evaluation and medical clearances done. Schedule at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. You're taking such great steps for your health! 💙" },
          { daysBeforeSurgery: 30, message: "Time to schedule your upper endoscopy at <a href='https://yourclinic.com' target='_blank' rel='noopener noreferrer' style='color: #3b82f6; text-decoration: underline;'>yourclinic.com</a>. Also, reminder to stop birth control pills. You're doing so well! 🏥" },
          { daysBeforeSurgery: 14, message: "Starting your 2-week pre-op diet today - high protein, low carb, with protein shakes. You can do this! 💪" },
          { daysBeforeSurgery: 10, message: "Time to stop NSAIDs like ibuprofen and aspirin. Your surgery is getting close - exciting! 💊" },
          { daysBeforeSurgery: 7, message: "Stock up on protein shakes and get your home ready for recovery. One week to go! 🛒" },
          { daysBeforeSurgery: 3, message: "Switching to liquids-only - protein shakes, broth, and sugar-free drinks. You're almost there! 🥛" },
          { daysBeforeSurgery: 1, message: "Tomorrow's the big day! Begin fasting at midnight. Rest up - you've worked so hard for this! 🌙" },
          { daysBeforeSurgery: 0, message: "Good morning! Surgery day! Shower with antibacterial soap, bring your CPAP, and arrive 90 min early. IMPORTANT: If you ate anything or did not follow any of the instructions, text 'ATE' immediately. Let's do this! 🎉" }
        ],
        checklist: [
          { task: "Attend all required nutrition education classes", daysBeforeSurgery: 90, crucial: true },
          { task: "Complete psychological evaluation and get clearance", daysBeforeSurgery: 60, crucial: true },
          { task: "Get medical clearance from primary care physician", daysBeforeSurgery: 60, crucial: true },
          { task: "Complete sleep study if required", daysBeforeSurgery: 45, crucial: true },
          { task: "Complete upper GI endoscopy", daysBeforeSurgery: 30, crucial: true },
          { task: "Stop birth control pills", daysBeforeSurgery: 30, crucial: true },
          { task: "Stop smoking completely", daysBeforeSurgery: 56, crucial: true },
          { task: "Begin 2-week pre-op diet (high protein, low carb)", daysBeforeSurgery: 14, crucial: true },
          { task: "Stop NSAIDs", daysBeforeSurgery: 10, crucial: true },
          { task: "Purchase 3-week supply of protein shakes", daysBeforeSurgery: 7, crucial: false },
          { task: "Arrange help at home for first week", daysBeforeSurgery: 7, crucial: true },
          { task: "Begin liquid-only diet", daysBeforeSurgery: 3, crucial: true },
          { task: "Stop alcohol consumption", daysBeforeSurgery: 2, crucial: true },
          { task: "Begin fasting at midnight", daysBeforeSurgery: 1, crucial: true }
        ]
      }
    },
    clinicInfo: `Bariatric Surgery Center Information

ABOUT OUR PROGRAM:
Comprehensive bariatric surgery program with multidisciplinary team support for optimal outcomes.

TEAM:
- Board-certified bariatric surgeons
- Registered dietitians
- Clinical psychologists
- Exercise physiologists
- Nurse coordinators

PRE-OP PROGRAM:
- 2-3 month pre-operative preparation
- Required education classes
- Nutritional counseling
- Psychological support
- Medical optimization

CONTACT:
Main Office: (555) 345-6789
Program Coordinator: (555) 345-6790
Nutritionist: (555) 345-6791
24/7 Support Line: (555) 345-6792

REQUIREMENTS:
- Completion of all pre-op requirements
- Insurance authorization obtained
- Medical clearances on file
- Demonstrated commitment to lifestyle changes`
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
          <p className="text-muted-foreground">Prepare for your upcoming surgery</p>
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
                    Select the type of surgical clinic
                  </p>
                  <Select value={clinicType} onValueChange={handleClinicTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ortho">Orthopedic Surgery</SelectItem>
                      <SelectItem value="derm">Dermatology Surgery</SelectItem>
                      <SelectItem value="bariatric">Bariatric Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                    Select a procedure to load pre-operative instructions
                  </p>
                  <Select value={selectedProcedure} onValueChange={handleProcedureSelect} disabled={!clinicType}>
                    <SelectTrigger className="mb-3">
                      <SelectValue placeholder={clinicType ? "Load procedure instructions..." : "Select clinic type first..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {clinicType && PRE_OP_DATA[clinicType] && Object.entries(PRE_OP_DATA[clinicType].procedures).map(([key, procedure]) => (
                        <SelectItem key={key} value={key}>
                          {procedure.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            <Button onClick={handleSave} size="lg" className="w-full md:w-auto md:ml-auto flex">
              <Save className="mr-2 h-4 w-4" />
              Save Pre-Op Instructions
            </Button>
          </TabsContent>

          <TabsContent value="patient" className="space-y-6">
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
                          <p className="text-sm font-semibold text-black dark:text-white">Grove Health</p>
                          <p className="text-xs text-gray-500">Text Message</p>
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

            {/* Checklist Section */}
            <Card className="p-6 max-w-4xl mx-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Pre-Op Checklist</h2>
                <p className="text-sm text-muted-foreground">
                  This is the checklist the patient sees when they log into the app.
                </p>
              </div>

              {getCurrentProcedure() ? (
                <div className="space-y-6 h-[500px] overflow-y-auto">
                  {/* Constant Reminders Section - Now at the top */}
                  {getCurrentProcedure()!.checklist.filter(item => item.constant).length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Ongoing Reminders
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Follow these guidelines throughout your pre-op period (ongoing until surgery)
                      </p>
                      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                        <ul className="space-y-2 list-disc list-inside">
                          {getCurrentProcedure()!.checklist
                            .filter(item => item.constant)
                            .map((item, index) => {
                              const actualIndex = getCurrentProcedure()!.checklist.indexOf(item);

                              return (
                                <li key={actualIndex} className="text-sm font-medium">
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
                      <h3 className="text-lg font-semibold mb-3">
                        Things You Need to Do
                      </h3>
                      <div className="space-y-3">
                        {getCurrentProcedure()!.checklist
                          .filter(item => item.crucial)
                          .sort((a, b) => {
                            const dateA = getDateForReminder(a.daysBeforeSurgery);
                            const dateB = getDateForReminder(b.daysBeforeSurgery);
                            const now = new Date();
                            const aIsFuture = dateA > now;
                            const bIsFuture = dateB > now;

                            // Sort future items to bottom
                            if (aIsFuture && !bIsFuture) return 1;
                            if (!aIsFuture && bIsFuture) return -1;

                            // Within same category, sort by days before surgery descending
                            return b.daysBeforeSurgery - a.daysBeforeSurgery;
                          })
                          .map((item, index) => {
                            const dueDate = getDateForReminder(item.daysBeforeSurgery);
                            const actualIndex = getCurrentProcedure()!.checklist.indexOf(item);
                            const isChecked = checkedItems.has(actualIndex);
                            const isPastDue = dueDate < new Date();
                            const isFuture = dueDate > new Date();

                            return (
                              <div
                                key={actualIndex}
                                className={cn(
                                  "flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer hover:bg-accent/50",
                                  isChecked
                                    ? "bg-muted/50 border-muted"
                                    : isFuture
                                      ? "bg-muted/30 border-muted opacity-60"
                                      : isPastDue
                                        ? "border-destructive/50 bg-destructive/5"
                                        : "border-primary/30 bg-primary/5"
                                )}
                                onClick={() => toggleChecklistItem(actualIndex)}
                              >
                                <button
                                  className="mt-0.5 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleChecklistItem(actualIndex);
                                  }}
                                >
                                  {isChecked ? (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </button>

                                <div className="flex-1">
                                  <p className={cn(
                                    "text-sm font-medium",
                                    isChecked && "line-through text-muted-foreground"
                                  )}>
                                    {item.task}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={cn(
                                      "text-xs font-semibold",
                                      isPastDue && !isChecked ? "text-destructive" : "text-muted-foreground"
                                    )}>
                                      Due: {format(dueDate, "MMM d, yyyy")}
                                    </span>
                                    {isPastDue && !isChecked && (
                                      <span className="text-xs text-destructive font-bold">(Overdue!)</span>
                                    )}
                                  </div>
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
                      <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
                        Things That Would Be Good to Do
                      </h3>
                      <div className="space-y-3">
                        {getCurrentProcedure()!.checklist
                          .filter(item => !item.crucial && !item.constant)
                          .sort((a, b) => {
                            const dateA = getDateForReminder(a.daysBeforeSurgery);
                            const dateB = getDateForReminder(b.daysBeforeSurgery);
                            const now = new Date();
                            const aIsFuture = dateA > now;
                            const bIsFuture = dateB > now;

                            // Sort future items to bottom
                            if (aIsFuture && !bIsFuture) return 1;
                            if (!aIsFuture && bIsFuture) return -1;

                            // Within same category, sort by days before surgery descending
                            return b.daysBeforeSurgery - a.daysBeforeSurgery;
                          })
                          .map((item, index) => {
                            const dueDate = getDateForReminder(item.daysBeforeSurgery);
                            const actualIndex = getCurrentProcedure()!.checklist.indexOf(item);
                            const isChecked = checkedItems.has(actualIndex);
                            const isPastDue = dueDate < new Date();
                            const isFuture = dueDate > new Date();

                            return (
                              <div
                                key={actualIndex}
                                className={cn(
                                  "flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-accent/50",
                                  isChecked
                                    ? "bg-muted/50 border-muted"
                                    : isFuture
                                      ? "bg-muted/30 border-muted opacity-60"
                                      : ""
                                )}
                                onClick={() => toggleChecklistItem(actualIndex)}
                              >
                                <button
                                  className="mt-0.5 shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleChecklistItem(actualIndex);
                                  }}
                                >
                                  {isChecked ? (
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </button>

                                <div className="flex-1">
                                  <p className={cn(
                                    "text-sm",
                                    isChecked && "line-through text-muted-foreground"
                                  )}>
                                    {item.task}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      Due: {format(dueDate, "MMM d, yyyy")}
                                    </span>
                                    {isPastDue && !isChecked && (
                                      <span className="text-xs text-muted-foreground">(Past due)</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PreOpDemo;
