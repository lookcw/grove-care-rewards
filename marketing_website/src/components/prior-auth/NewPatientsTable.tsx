import { useState } from 'react';
import { FileText, Phone, CheckCircle2, Printer, Calendar, List, Clock } from 'lucide-react';
import { PostingFormModal, PostingFormData } from './PostingFormModal';
import { PatientDetailsModal } from './PatientDetailsModal';
import { SurgeryCalendar } from './SurgeryCalendar';

interface PatientEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  status: 'completed' | 'pending' | 'in_progress';
}

interface FollowUp {
  id: string;
  expectedDate: string;
  actualDate?: string;
  type: 'Post-Op 2 Week' | 'Post-Op 6 Week' | 'Post-Op 3 Month' | 'Post-Op 6 Month' | 'Post-Op 1 Year';
  completed: boolean;
}

interface NewPatient {
  id: string;
  name: string;
  dob: string;
  mrn: string;
  phone: string;
  email: string;
  insurance: string;
  referringPhysician: string;
  surgeryDate: string;
  surgeryTime?: string;
  procedure?: string;
  missing: 'Surgery Schedule Form Missing' | 'Surgery Not Scheduled' | 'Missing Clearance' | null;
  lastAction: 'Synced Forms to ECW' | 'Called Radiology facility' | 'None' | 'Pre-op form sent';
  formCompleted?: boolean;
  sentToCenter?: boolean;
  calledForClearance?: boolean;
  preOpSent?: boolean;
  actionType?: 'fillForm' | 'sendToCenter' | 'callForClearance';
  events: PatientEvent[];
  followUps?: FollowUp[];
}

// Helper to check if surgery date has passed
const isPastDate = (dateStr: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate < today;
};

// Helper to get days until surgery
const getDaysUntil = (dateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export function NewPatientsTable() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [patientNotes, setPatientNotes] = useState<{ [patientId: string]: string }>({});
  const [newPatients, setNewPatients] = useState<NewPatient[]>([
    // Past patients with follow-ups
    {
      id: 'past-1',
      name: 'William Turner',
      dob: '1962-04-20',
      mrn: 'MRN-001990',
      phone: '(555) 111-2222',
      email: 'william.turner@email.com',
      insurance: 'Aetna',
      referringPhysician: 'Dr. Sarah Chen',
      surgeryDate: '2025-10-15',
      surgeryTime: '09:00',
      procedure: 'Total Hip Replacement',
      missing: null,
      lastAction: 'None',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-10-15', title: 'Surgery Completed', description: 'Total Hip Replacement @ Holy Cross Hospital', status: 'completed' },
      ],
      followUps: [
        { id: 'f1', expectedDate: '2025-10-29', actualDate: '2025-10-29', type: 'Post-Op 2 Week', completed: true },
        { id: 'f2', expectedDate: '2025-11-26', actualDate: '2025-11-28', type: 'Post-Op 6 Week', completed: true },
        { id: 'f3', expectedDate: '2026-01-15', type: 'Post-Op 3 Month', completed: false },
      ]
    },
    {
      id: 'past-2',
      name: 'Barbara Martinez',
      dob: '1970-08-12',
      mrn: 'MRN-001991',
      phone: '(555) 222-3333',
      email: 'barbara.martinez@email.com',
      insurance: 'United Healthcare',
      referringPhysician: 'Dr. Michael Lee',
      surgeryDate: '2025-11-05',
      surgeryTime: '07:30',
      procedure: 'Rotator Cuff Repair',
      missing: null,
      lastAction: 'None',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-11-05', title: 'Surgery Completed', description: 'Rotator Cuff Repair @ Sentara', status: 'completed' },
      ],
      followUps: [
        { id: 'f1', expectedDate: '2025-11-19', actualDate: '2025-11-19', type: 'Post-Op 2 Week', completed: true },
        { id: 'f2', expectedDate: '2025-12-17', type: 'Post-Op 6 Week', completed: false },
      ]
    },
    {
      id: 'past-3',
      name: 'Thomas Anderson',
      dob: '1955-01-30',
      mrn: 'MRN-001992',
      phone: '(555) 333-4444',
      email: 'thomas.anderson@email.com',
      insurance: 'Medicare',
      referringPhysician: 'Dr. Emily Rodriguez',
      surgeryDate: '2025-09-20',
      surgeryTime: '08:00',
      procedure: 'Spinal Fusion - Cervical',
      missing: null,
      lastAction: 'None',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-09-20', title: 'Surgery Completed', description: 'Spinal Fusion @ Holy Cross Hospital', status: 'completed' },
      ],
      followUps: [
        { id: 'f1', expectedDate: '2025-10-04', actualDate: '2025-10-04', type: 'Post-Op 2 Week', completed: true },
        { id: 'f2', expectedDate: '2025-11-01', actualDate: '2025-11-03', type: 'Post-Op 6 Week', completed: true },
        { id: 'f3', expectedDate: '2025-12-20', actualDate: '2025-12-22', type: 'Post-Op 3 Month', completed: true },
      ]
    },
    {
      id: 'past-4',
      name: 'Linda Chen',
      dob: '1968-06-15',
      mrn: 'MRN-001993',
      phone: '(555) 444-5555',
      email: 'linda.chen@email.com',
      insurance: 'Cigna',
      referringPhysician: 'Dr. David Kim',
      surgeryDate: '2025-11-20',
      surgeryTime: '10:00',
      procedure: 'ACL Reconstruction',
      missing: null,
      lastAction: 'None',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-11-20', title: 'Surgery Completed', description: 'ACL Reconstruction @ MASC', status: 'completed' },
      ],
      followUps: [
        { id: 'f1', expectedDate: '2025-12-04', type: 'Post-Op 2 Week', completed: false },
        { id: 'f2', expectedDate: '2026-01-01', type: 'Post-Op 6 Week', completed: false },
      ]
    },
    {
      id: 'past-5',
      name: 'George Williams',
      dob: '1960-11-08',
      mrn: 'MRN-001994',
      phone: '(555) 555-6666',
      email: 'george.williams@email.com',
      insurance: 'Humana',
      referringPhysician: 'Dr. Lisa Wang',
      surgeryDate: '2025-12-01',
      surgeryTime: '07:00',
      procedure: 'Total Knee Replacement',
      missing: null,
      lastAction: 'None',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-12-01', title: 'Surgery Completed', description: 'Total Knee Replacement @ Holy Cross Hospital', status: 'completed' },
      ],
      followUps: [
        { id: 'f1', expectedDate: '2025-12-15', actualDate: '2025-12-15', type: 'Post-Op 2 Week', completed: true },
        { id: 'f2', expectedDate: '2026-01-12', type: 'Post-Op 6 Week', completed: false },
      ]
    },
    // Upcoming patients
    {
      id: 'new-1',
      name: 'Margaret Smith',
      dob: '1958-03-15',
      mrn: 'MRN-002001',
      phone: '(555) 123-4567',
      email: 'margaret.smith@email.com',
      insurance: 'Blue Cross Blue Shield',
      referringPhysician: 'Dr. James Wilson',
      surgeryDate: '2026-01-10',
      surgeryTime: '08:00',
      procedure: 'Total Knee Replacement',
      missing: null,
      lastAction: 'Synced Forms to ECW',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-09-01', title: 'Referred by Dr. Wilson', description: 'Patient referred for knee pain evaluation', status: 'completed' },
        { id: 'e2', date: '2025-09-15', title: 'First Appointment', description: 'Initial consultation with Dr. Roberts', status: 'completed' },
        { id: 'e3', date: '2025-09-20', title: 'MRI Completed', description: 'MRI shows advanced osteoarthritis', status: 'completed' },
        { id: 'e4', date: '2025-10-01', title: 'Surgery Scheduled', description: 'Total knee replacement scheduled for Jan 10', status: 'completed' },
        { id: 'e5', date: '2025-10-05', title: 'Prior Auth Sent', description: 'Submitted to Blue Cross Blue Shield', status: 'completed' },
        { id: 'e6', date: '2025-10-10', title: 'Prior Auth Approved', description: 'Authorization #PA-2025-12345', status: 'completed' },
        { id: 'e7', date: '2025-12-15', title: 'Medical Clearance Sent', description: 'Sent to PCP Dr. Johnson', status: 'completed' },
        { id: 'e8', date: '2025-12-18', title: 'Medical Clearance Approved', description: 'Cleared for surgery', status: 'completed' },
        { id: 'e9', date: '2026-01-03', title: 'Pre-Op Form Sent', status: 'in_progress' },
        { id: 'e10', date: '2026-01-10', title: 'Surgery', description: 'Total Knee Replacement @ Holy Cross Hospital', status: 'pending' },
      ]
    },
    {
      id: 'new-2',
      name: 'Christopher Davis',
      dob: '1965-07-22',
      mrn: 'MRN-002002',
      phone: '(555) 234-5678',
      email: 'chris.davis@email.com',
      insurance: 'Aetna',
      referringPhysician: 'Dr. Sarah Chen',
      surgeryDate: '2026-01-15',
      procedure: 'Total Hip Replacement',
      missing: 'Surgery Not Scheduled',
      lastAction: 'Called Radiology facility',
      actionType: 'sendToCenter',
      events: [
        { id: 'e1', date: '2025-08-15', title: 'Referred by Dr. Chen', description: 'Patient referred for hip pain', status: 'completed' },
        { id: 'e2', date: '2025-08-25', title: 'First Appointment', description: 'Initial consultation', status: 'completed' },
        { id: 'e3', date: '2025-09-05', title: 'X-Ray Completed', description: 'Severe hip arthritis confirmed', status: 'completed' },
        { id: 'e4', date: '2025-09-20', title: 'Prior Auth Sent', description: 'Submitted to Aetna', status: 'completed' },
        { id: 'e5', date: '2025-10-01', title: 'Prior Auth Approved', status: 'completed' },
        { id: 'e6', date: '2025-12-15', title: 'Scheduling Form Sent', status: 'in_progress' },
        { id: 'e7', date: '2026-01-15', title: 'Surgery', description: 'Pending scheduling confirmation', status: 'pending' },
      ]
    },
    {
      id: 'new-3',
      name: 'Amanda Brown',
      dob: '1972-11-08',
      mrn: 'MRN-002003',
      phone: '(555) 345-6789',
      email: 'amanda.brown@email.com',
      insurance: 'United Healthcare',
      referringPhysician: 'Dr. Michael Lee',
      surgeryDate: '2026-01-03',
      surgeryTime: '10:30',
      procedure: 'ACL Reconstruction',
      missing: null,
      lastAction: 'None',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-07-20', title: 'Referred by Dr. Lee', description: 'Sports injury - ACL tear', status: 'completed' },
        { id: 'e2', date: '2025-07-28', title: 'First Appointment', status: 'completed' },
        { id: 'e3', date: '2025-08-05', title: 'MRI Completed', description: 'Complete ACL tear confirmed', status: 'completed' },
        { id: 'e4', date: '2025-08-15', title: 'Surgery Scheduled', status: 'completed' },
        { id: 'e5', date: '2025-08-20', title: 'Prior Auth Sent', status: 'completed' },
        { id: 'e6', date: '2025-08-28', title: 'Prior Auth Approved', status: 'completed' },
        { id: 'e7', date: '2025-11-15', title: 'Medical Clearance Sent', status: 'completed' },
        { id: 'e8', date: '2025-11-22', title: 'Medical Clearance Approved', status: 'completed' },
        { id: 'e9', date: '2025-12-27', title: 'Pre-Op Form Sent', status: 'completed' },
        { id: 'e10', date: '2026-01-03', title: 'Surgery', description: 'ACL Reconstruction @ MASC', status: 'pending' },
      ]
    },
    {
      id: 'new-4',
      name: 'Robert Wilson',
      dob: '1955-02-14',
      mrn: 'MRN-002004',
      phone: '(555) 456-7890',
      email: 'robert.wilson@email.com',
      insurance: 'Medicare',
      referringPhysician: 'Dr. Emily Rodriguez',
      surgeryDate: '2026-01-08',
      procedure: 'Spinal Fusion - Lumbar',
      missing: 'Missing Clearance',
      lastAction: 'Synced Forms to ECW',
      actionType: 'callForClearance',
      events: [
        { id: 'e1', date: '2025-06-10', title: 'Referred by Dr. Rodriguez', description: 'Chronic back pain, failed conservative treatment', status: 'completed' },
        { id: 'e2', date: '2025-06-25', title: 'First Appointment', status: 'completed' },
        { id: 'e3', date: '2025-07-05', title: 'MRI Completed', description: 'Degenerative disc disease L4-L5', status: 'completed' },
        { id: 'e4', date: '2025-07-20', title: 'Physical Therapy Started', description: '6-week PT program', status: 'completed' },
        { id: 'e5', date: '2025-09-01', title: 'PT Completed', description: 'Conservative treatment unsuccessful', status: 'completed' },
        { id: 'e6', date: '2025-09-15', title: 'Surgery Scheduled', status: 'completed' },
        { id: 'e7', date: '2025-09-20', title: 'Prior Auth Sent', status: 'completed' },
        { id: 'e8', date: '2025-10-05', title: 'Prior Auth Approved', status: 'completed' },
        { id: 'e9', date: '2025-12-20', title: 'Medical Clearance Sent', description: 'Cardiology clearance required', status: 'in_progress' },
        { id: 'e10', date: '2026-01-08', title: 'Surgery', description: 'Pending clearance', status: 'pending' },
      ]
    },
    {
      id: 'new-5',
      name: 'Patricia Johnson',
      dob: '1968-05-30',
      mrn: 'MRN-002005',
      phone: '(555) 567-8901',
      email: 'patricia.j@email.com',
      insurance: 'Cigna',
      referringPhysician: 'Dr. David Kim',
      surgeryDate: '2026-01-20',
      surgeryTime: '14:00',
      procedure: 'Rotator Cuff Repair',
      missing: null,
      lastAction: 'Pre-op form sent',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-08-01', title: 'Referred by Dr. Kim', status: 'completed' },
        { id: 'e2', date: '2025-08-10', title: 'First Appointment', status: 'completed' },
        { id: 'e3', date: '2025-08-20', title: 'MRI Completed', description: 'Full-thickness rotator cuff tear', status: 'completed' },
        { id: 'e4', date: '2025-09-05', title: 'Surgery Scheduled', status: 'completed' },
        { id: 'e5', date: '2025-09-10', title: 'Prior Auth Sent', status: 'completed' },
        { id: 'e6', date: '2025-09-25', title: 'Prior Auth Approved', status: 'completed' },
        { id: 'e7', date: '2025-12-10', title: 'Medical Clearance Sent', status: 'completed' },
        { id: 'e8', date: '2025-12-15', title: 'Medical Clearance Approved', status: 'completed' },
        { id: 'e9', date: '2026-01-13', title: 'Pre-Op Form Sent', status: 'pending' },
        { id: 'e10', date: '2026-01-20', title: 'Surgery', description: 'Rotator Cuff Repair @ Sentara', status: 'pending' },
      ]
    },
    {
      id: 'new-6',
      name: 'James Miller',
      dob: '1960-09-12',
      mrn: 'MRN-002006',
      phone: '(555) 678-9012',
      email: 'james.miller@email.com',
      insurance: 'Humana',
      referringPhysician: 'Dr. Lisa Wang',
      surgeryDate: '2026-01-25',
      surgeryTime: '07:30',
      procedure: 'Total Knee Replacement',
      missing: null,
      lastAction: 'None',
      actionType: undefined,
      events: [
        { id: 'e1', date: '2025-07-15', title: 'Referred by Dr. Wang', status: 'completed' },
        { id: 'e2', date: '2025-07-25', title: 'First Appointment', status: 'completed' },
        { id: 'e3', date: '2025-08-05', title: 'X-Ray Completed', status: 'completed' },
        { id: 'e4', date: '2025-08-20', title: 'Surgery Scheduled', status: 'completed' },
        { id: 'e5', date: '2025-08-25', title: 'Prior Auth Sent', status: 'completed' },
        { id: 'e6', date: '2025-09-10', title: 'Prior Auth Approved', status: 'completed' },
        { id: 'e7', date: '2025-12-01', title: 'Medical Clearance Sent', status: 'completed' },
        { id: 'e8', date: '2025-12-08', title: 'Medical Clearance Approved', status: 'completed' },
        { id: 'e9', date: '2025-12-20', title: 'Scheduling Form Sent', status: 'completed' },
        { id: 'e10', date: '2026-01-18', title: 'Pre-Op Form Due', status: 'pending' },
        { id: 'e11', date: '2026-01-25', title: 'Surgery', description: 'Total Knee Replacement @ Holy Cross Hospital', status: 'pending' },
      ]
    }
  ]);

  const [postingModalState, setPostingModalState] = useState<{
    isOpen: boolean;
    patientId: string | null;
  }>({
    isOpen: false,
    patientId: null
  });

  const [detailsModalState, setDetailsModalState] = useState<{
    isOpen: boolean;
    patientId: string | null;
  }>({
    isOpen: false,
    patientId: null
  });

  const handleOpenPostingForm = (patientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPostingModalState({ isOpen: true, patientId });
  };

  const handleClosePostingModal = () => {
    setPostingModalState({ isOpen: false, patientId: null });
  };

  const handlePostingFormSubmit = (data: PostingFormData) => {
    const patient = newPatients.find(p => p.id === postingModalState.patientId);

    setNewPatients(prev => prev.map(p =>
      p.id === postingModalState.patientId
        ? {
            ...p,
            formCompleted: true,
            sentToCenter: true,
            surgeryDate: data.surgeryDate,
            surgeryTime: data.surgeryTime,
            missing: null
          }
        : p
    ));

    alert(`Posting form sent to ${data.surgeryCenter} for ${patient?.name}\n\nProcedure: ${data.procedure}\nICD-10: ${data.icd10Code}\nDate: ${data.surgeryDate}\nTime: ${data.surgeryTime}\nLaterality: ${data.laterality}`);
    handleClosePostingModal();
  };

  const handleCallForClearance = (patientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const patient = newPatients.find(p => p.id === patientId);
    setNewPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, calledForClearance: true } : p
    ));
    alert(`Called facility for medical clearance for ${patient?.name}`);
  };

  const handleSendPreOpForm = (patientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const patient = newPatients.find(p => p.id === patientId);
    setNewPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, preOpSent: true, lastAction: 'Pre-op form sent' } : p
    ));
    alert(`Pre-op form sent to ${patient?.name}`);
  };

  const handleCallSurgicalCenters = () => {
    alert('Calling surgical centers to get available dates...');
  };

  const handleOpenPatientDetails = (patientId: string) => {
    setDetailsModalState({ isOpen: true, patientId });
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalState({ isOpen: false, patientId: null });
  };

  const currentPatient = newPatients.find(p => p.id === postingModalState.patientId);
  const detailsPatient = newPatients.find(p => p.id === detailsModalState.patientId);

  // Get next action for a patient
  const getNextAction = (patient: NewPatient): { text: string; type: 'preop' | 'none' } => {
    const daysUntil = getDaysUntil(patient.surgeryDate);
    const isPast = isPastDate(patient.surgeryDate);

    // For upcoming surgeries within 7 days - need pre-op form
    if (!isPast && daysUntil <= 7 && daysUntil > 0 && !patient.preOpSent) {
      return { text: `Send pre-op form (${daysUntil} day${daysUntil === 1 ? '' : 's'} until surgery)`, type: 'preop' };
    }

    return { text: '-', type: 'none' };
  };

  return (
    <div className="space-y-4">
      {/* View Toggle and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar View
          </button>
        </div>
        <button
          onClick={handleCallSurgicalCenters}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call Surgical Centers to Get Available Dates
        </button>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <SurgeryCalendar
          patients={newPatients.map(p => ({
            id: p.id,
            name: p.name,
            surgeryDate: p.surgeryDate,
            surgeryTime: p.surgeryTime,
            procedure: p.procedure
          }))}
          followUps={newPatients.flatMap(p =>
            (p.followUps || []).map(f => ({
              id: f.id,
              patientId: p.id,
              patientName: p.name,
              procedure: p.procedure,
              expectedDate: f.expectedDate,
              actualDate: f.actualDate,
              type: f.type,
              completed: f.completed
            }))
          )}
          onPatientClick={handleOpenPatientDetails}
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-700">Patient</th>
                  <th className="text-left px-6 py-4 text-gray-700">Surgery Date</th>
                  <th className="text-left px-6 py-4 text-gray-700">Procedure</th>
                  <th className="text-left px-6 py-4 text-gray-700">Missing</th>
                  <th className="text-center px-6 py-4 text-gray-700">Action</th>
                  <th className="text-left px-6 py-4 text-gray-700">Next Actions</th>
                  <th className="text-left px-6 py-4 text-gray-700">Last Action</th>
                  <th className="text-left px-6 py-4 text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {newPatients.map((patient) => {
                  const nextAction = getNextAction(patient);
                  const isPast = isPastDate(patient.surgeryDate);

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => handleOpenPatientDetails(patient.id)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-gray-900 font-medium">{patient.name}</div>
                          {patient.formCompleted && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{patient.mrn}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600">
                          {patient.surgeryDate}
                          {patient.surgeryTime && (
                            <span className="text-gray-400 ml-2">@ {patient.surgeryTime}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600">{patient.procedure || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {patient.missing ? (
                          <span className="text-red-600">{patient.missing}</span>
                        ) : (
                          <span className="text-green-600">All good</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {!patient.actionType ? (
                            <span className="text-gray-400">No action needed</span>
                          ) : patient.actionType === 'callForClearance' ? (
                            <button
                              onClick={(e) => handleCallForClearance(patient.id, e)}
                              disabled={patient.calledForClearance}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                patient.calledForClearance
                                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              <Phone className="w-4 h-4" />
                              {patient.calledForClearance ? 'Called' : 'Call patient to get available times'}
                            </button>
                          ) : patient.actionType === 'sendToCenter' ? (
                            <button
                              onClick={(e) => handleOpenPostingForm(patient.id, e)}
                              disabled={patient.sentToCenter}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                patient.sentToCenter
                                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              <Printer className="w-4 h-4" />
                              {patient.sentToCenter ? 'Posting Form Sent' : 'Send Posting Form'}
                            </button>
                          ) : (
                            <span className="text-gray-400">No action needed</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {nextAction.type === 'preop' && !patient.preOpSent ? (
                            <button
                              onClick={(e) => handleSendPreOpForm(patient.id, e)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                            >
                              <Clock className="w-4 h-4" />
                              Send Pre-Op Form
                            </button>
                          ) : nextAction.type === 'preop' && patient.preOpSent ? (
                            <span className="text-green-600 text-sm flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              Pre-op sent
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400">{patient.lastAction}</span>
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={patientNotes[patient.id] || ''}
                          onChange={(e) => {
                            e.stopPropagation();
                            setPatientNotes(prev => ({
                              ...prev,
                              [patient.id]: e.target.value
                            }));
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Add notes..."
                          className="w-full min-w-[150px] border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[60px]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Posting Form Modal */}
      <PostingFormModal
        isOpen={postingModalState.isOpen}
        onClose={handleClosePostingModal}
        patientName={currentPatient?.name || ''}
        onSubmit={handlePostingFormSubmit}
      />

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={detailsModalState.isOpen}
        onClose={handleCloseDetailsModal}
        patient={detailsPatient ? {
          name: detailsPatient.name,
          dob: detailsPatient.dob,
          mrn: detailsPatient.mrn,
          phone: detailsPatient.phone,
          email: detailsPatient.email,
          insurance: detailsPatient.insurance,
          referringPhysician: detailsPatient.referringPhysician,
          surgeryDate: detailsPatient.surgeryDate,
          surgeryTime: detailsPatient.surgeryTime,
          procedure: detailsPatient.procedure,
          events: detailsPatient.events
        } : null}
      />
    </div>
  );
}
