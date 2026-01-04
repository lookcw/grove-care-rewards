import { useState } from 'react';
import { CheckCircle2, FileText, Printer, UserCheck, Pill, Send } from 'lucide-react';
import { NewPatientsTable } from './NewPatientsTable';
import { NewPatientModal, NewPatientFormData } from './NewPatientModal';
import { MedicationModal, MedicationFormData } from './MedicationModal';
import { FMLAFormModal, FMLAFormData } from './FMLAFormModal';

type TabType = 'scheduler' | 'priorAuth';

interface Patient {
  id: string;
  name: string;
  mrn: string;
  surgeryDate: string;
  items: {
    schedulingOrtho: boolean;
    schedulingFacility: boolean;
    consent: boolean;
    preAdmission: boolean;
    surgeryScheduled: boolean;
    insuranceCard: boolean;
    demographics: boolean;
    mriScan: boolean;
    ptEvidence: boolean;
    icdCodes: boolean;
  };
  problems?: string[];
  mriFacility?: {
    name: string;
    phone: string;
  };
  ptFacility?: {
    name: string;
    phone: string;
  };
  needsSchedulingForm?: boolean;
  needsMedication?: boolean;
  needsFMLAForm?: boolean;
}

const itemLabels: Record<string, string> = {
  schedulingOrtho: 'Scheduling form from ortho clinic',
  schedulingFacility: 'Scheduling form to facility',
  consent: 'Consent form',
  surgeryScheduled: 'Surgery date scheduled',
  insuranceCard: 'Insurance card',
  demographics: 'Demographics',
  mriScan: 'Radiology report',
  ptEvidence: 'Evidence of PT',
  icdCodes: 'ICD 10 codes'
};

// Items to skip when showing missing items
const skipMissingItems = ['preAdmission'];

export function PriorAuthTable() {
  const [activeTab, setActiveTab] = useState<TabType>('priorAuth');
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '0',
      name: 'Jennifer Williams',
      mrn: 'MRN-001240',
      surgeryDate: '2025-02-05',
      items: {
        schedulingOrtho: true,
        schedulingFacility: true,
        consent: true,
        preAdmission: true,
        surgeryScheduled: true,
        insuranceCard: true,
        demographics: true,
        mriScan: true,
        ptEvidence: true,
        icdCodes: true
      },
      problems: ['FMLA Form Required'],
      needsFMLAForm: true
    },
    {
      id: '1',
      name: 'Sarah Johnson',
      mrn: 'MRN-001234',
      surgeryDate: '2025-01-15',
      items: {
        schedulingOrtho: true,
        schedulingFacility: true,
        consent: true,
        preAdmission: true,
        surgeryScheduled: true,
        insuranceCard: true,
        demographics: true,
        mriScan: false,
        ptEvidence: true,
        icdCodes: true
      },
      problems: [],
      mriFacility: {
        name: 'Advanced Imaging Center',
        phone: '(555) 123-4567'
      }
    },
    {
      id: '2',
      name: 'Michael Chen',
      mrn: 'MRN-001235',
      surgeryDate: '2025-01-18',
      items: {
        schedulingOrtho: true,
        schedulingFacility: true,
        consent: true,
        preAdmission: false,
        surgeryScheduled: true,
        insuranceCard: true,
        demographics: true,
        mriScan: true,
        ptEvidence: false,
        icdCodes: true
      },
      problems: ['Missing documentation for instrumentation'],
      ptFacility: {
        name: 'Recovery Physical Therapy',
        phone: '(555) 234-5678'
      }
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      mrn: 'MRN-001236',
      surgeryDate: '2025-01-22',
      items: {
        schedulingOrtho: true,
        schedulingFacility: false,
        consent: false,
        preAdmission: false,
        surgeryScheduled: true,
        insuranceCard: true,
        demographics: true,
        mriScan: false,
        ptEvidence: false,
        icdCodes: false
      },
      problems: ['Missing MRI report', 'Missing MRI review appointment', 'Prior authorization expired']
      // No facility info
    },
    {
      id: '4',
      name: 'David Thompson',
      mrn: 'MRN-001237',
      surgeryDate: '2025-01-25',
      items: {
        schedulingOrtho: true,
        schedulingFacility: true,
        consent: true,
        preAdmission: true,
        surgeryScheduled: true,
        insuranceCard: false,
        demographics: true,
        mriScan: true,
        ptEvidence: true,
        icdCodes: true
      },
      problems: [],
      needsMedication: true
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      mrn: 'MRN-001238',
      surgeryDate: '2025-01-28',
      items: {
        schedulingOrtho: false,
        schedulingFacility: false,
        consent: true,
        preAdmission: false,
        surgeryScheduled: true,
        insuranceCard: true,
        demographics: true,
        mriScan: false,
        ptEvidence: true,
        icdCodes: true
      },
      problems: ['Missing documentation for instrumentation'],
      mriFacility: {
        name: 'City Medical Imaging',
        phone: '(555) 345-6789'
      }
    },
    {
      id: '6',
      name: 'Robert Martinez',
      mrn: 'MRN-001239',
      surgeryDate: '2025-02-01',
      items: {
        schedulingOrtho: true,
        schedulingFacility: true,
        consent: true,
        preAdmission: true,
        surgeryScheduled: true,
        insuranceCard: true,
        demographics: true,
        mriScan: true,
        ptEvidence: true,
        icdCodes: true
      },
      problems: [],
      mriFacility: {
        name: 'Regional Radiology Center',
        phone: '(555) 456-7890'
      },
      ptFacility: {
        name: 'Elite Physical Therapy',
        phone: '(555) 567-8901'
      }
    }
  ]);

  const [requestedItems, setRequestedItems] = useState<{ [patientId: string]: Set<string> }>({});
  const [schedulingFormCompleted, setSchedulingFormCompleted] = useState<{ [patientId: string]: boolean }>({});
  const [approvedPatients, setApprovedPatients] = useState<{ [patientId: string]: boolean }>({});
  const [schedulingFormSent, setSchedulingFormSent] = useState<{ [patientId: string]: boolean }>({});
  const [medicationPrescribed, setMedicationPrescribed] = useState<{ [patientId: string]: string[] }>({});
  const [medicationSent, setMedicationSent] = useState<{ [patientId: string]: boolean }>({});
  const [fmlaFormCompleted, setFmlaFormCompleted] = useState<{ [patientId: string]: boolean }>({});
  const [fmlaModalState, setFmlaModalState] = useState<{
    isOpen: boolean;
    patientId: string | null;
  }>({
    isOpen: false,
    patientId: null
  });
  const [medicationModalState, setMedicationModalState] = useState<{
    isOpen: boolean;
    patientId: string | null;
  }>({
    isOpen: false,
    patientId: null
  });
  const [schedulingModalState, setSchedulingModalState] = useState<{
    isOpen: boolean;
    patientId: string | null;
  }>({
    isOpen: false,
    patientId: null
  });

  const getMissingItems = (items: Patient['items']) => {
    const missing: string[] = [];
    (Object.keys(items) as Array<keyof Patient['items']>).forEach(key => {
      if (!items[key] && !skipMissingItems.includes(key) && itemLabels[key]) {
        missing.push(itemLabels[key]);
      }
    });
    return missing;
  };

  const handleSendMriReferral = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setRequestedItems(prev => ({
      ...prev,
      [patientId]: new Set([...(prev[patientId] || []), 'mriScan'])
    }));
    alert(`MRI referral sent to ${patient?.name}`);
  };

  const handleSendPtReferral = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setRequestedItems(prev => ({
      ...prev,
      [patientId]: new Set([...(prev[patientId] || []), 'ptEvidence'])
    }));
    alert(`PT referral sent to ${patient?.name}`);
  };

  const handleOpenSchedulingForm = (patientId: string) => {
    setSchedulingModalState({ isOpen: true, patientId });
  };

  const handleCloseSchedulingModal = () => {
    setSchedulingModalState({ isOpen: false, patientId: null });
  };

  const handleSchedulingFormSubmit = (data: NewPatientFormData) => {
    const patient = patients.find(p => p.id === schedulingModalState.patientId);
    console.log('Scheduling form submitted for:', patient?.name, data);

    setSchedulingFormCompleted(prev => ({
      ...prev,
      [schedulingModalState.patientId!]: true
    }));

    alert(`Scheduling form completed for ${patient?.name}\n\nInstrumentation: ${data.instrumentation.join(', ')}\nSurgery Types: ${data.surgeryTypes.join(', ')}\nCenter: ${data.surgeryCenter}`);
    handleCloseSchedulingModal();
  };

  const handleSendSchedulingForm = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSchedulingFormSent(prev => ({
      ...prev,
      [patientId]: true
    }));
    alert(`Scheduling form faxed to surgery center for ${patient?.name}`);
  };

  const handleApprovePatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setApprovedPatients(prev => ({
      ...prev,
      [patientId]: true
    }));
    alert(`Patient ${patient?.name} approved`);
  };

  const handleOpenMedicationModal = (patientId: string) => {
    setMedicationModalState({ isOpen: true, patientId });
  };

  const handleCloseMedicationModal = () => {
    setMedicationModalState({ isOpen: false, patientId: null });
  };

  const handleMedicationSubmit = (data: MedicationFormData) => {
    const patient = patients.find(p => p.id === medicationModalState.patientId);
    setMedicationPrescribed(prev => ({
      ...prev,
      [medicationModalState.patientId!]: data.medications
    }));
    alert(`Medications prescribed for ${patient?.name}:\n\n${data.medications.join('\n')}`);
    handleCloseMedicationModal();
  };

  const handleSendMedicationToPatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setMedicationSent(prev => ({
      ...prev,
      [patientId]: true
    }));
    alert(`Prescription sent to ${patient?.name}`);
  };

  const handleOpenFMLAModal = (patientId: string) => {
    setFmlaModalState({ isOpen: true, patientId });
  };

  const handleCloseFMLAModal = () => {
    setFmlaModalState({ isOpen: false, patientId: null });
  };

  const handleFMLAFormSubmit = (data: FMLAFormData) => {
    const patient = patients.find(p => p.id === fmlaModalState.patientId);
    setFmlaFormCompleted(prev => ({
      ...prev,
      [fmlaModalState.patientId!]: true
    }));
    alert(`FMLA Form completed and sent for ${patient?.name}\n\nProcedure: ${data.procedure}\nDiagnosis: ${data.diagnosis}\nICD-10: ${data.icd10Code}\nSurgery Date: ${data.surgeryDate}\nExpected Recovery: ${data.expectedRecoveryWeeks} weeks`);
    handleCloseFMLAModal();
  };

  const isRequested = (patientId: string, itemType: string) => {
    return requestedItems[patientId]?.has(itemType) || false;
  };

  const getCompletionCount = (items: Patient['items']) => {
    const completed = Object.values(items).filter(Boolean).length;
    return { completed, total: 10 };
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Tab Navigation with Logo */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('priorAuth')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'priorAuth'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Documentation Dashboard
          </button>
          <button
            onClick={() => setActiveTab('scheduler')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'scheduler'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Surgery Scheduler
          </button>
        </div>
        <div className="text-xl font-bold text-blue-800">Avante Orthopedics</div>
      </div>

      {/* Surgery Scheduler Tab */}
      {activeTab === 'scheduler' && (
        <div>
          <div className="mb-4">
            <h1 className="text-gray-900 mb-2">Surgery Scheduler Dashboard</h1>
          </div>
          <NewPatientsTable />
        </div>
      )}

      {/* Prior Auth Dashboard Tab */}
      {activeTab === 'priorAuth' && (
        <div>
          <div className="mb-4">
            <h1 className="text-gray-900 mb-2">Documentation Dashboard</h1>
          </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-700">Patient</th>
                <th className="text-left px-6 py-4 text-gray-700">Surgery Date</th>
                <th className="text-left px-6 py-4 text-gray-700">Missing Items</th>
                <th className="text-left px-6 py-4 text-gray-700">Problems</th>
                <th className="text-center px-6 py-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((patient) => {
                const missingItems = getMissingItems(patient.items);
                const { completed, total } = getCompletionCount(patient.items);
                const isComplete = missingItems.length === 0;
                const isMriMissing = !patient.items.mriScan;
                const isPtMissing = !patient.items.ptEvidence;
                const hasProblems = (patient.problems?.length || 0) > 0;
                const isReady = isComplete && !hasProblems;

                return (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{patient.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{patient.surgeryDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      {missingItems.length > 0 ? (
                        <div className="space-y-1">
                          {missingItems.map((item, idx) => (
                            <div key={idx} className="text-gray-700 text-sm">
                              • {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-600">All items complete</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {hasProblems ? (
                        <div className="space-y-1">
                          {patient.problems?.map((problem, idx) => (
                            <div key={idx} className="text-red-700 text-sm">
                              • {problem}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">No issues</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {patient.needsSchedulingForm && !schedulingFormCompleted[patient.id] && (
                          <button
                            onClick={() => handleOpenSchedulingForm(patient.id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <FileText className="w-4 h-4" />
                            Fill Out Scheduling Form
                          </button>
                        )}
                        {patient.needsSchedulingForm && schedulingFormCompleted[patient.id] && (
                          <button
                            onClick={() => handleSendSchedulingForm(patient.id)}
                            disabled={schedulingFormSent[patient.id]}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                              schedulingFormSent[patient.id]
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <Printer className="w-4 h-4" />
                            {schedulingFormSent[patient.id] ? 'Form Sent' : 'Send Scheduling Form'}
                          </button>
                        )}
                        {isMriMissing && (
                          <button
                            onClick={() => handleSendMriReferral(patient.id)}
                            disabled={isRequested(patient.id, 'mriScan')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                              isRequested(patient.id, 'mriScan')
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                            {isRequested(patient.id, 'mriScan') ? 'MRI Referral Sent' : 'Send MRI Referral to Patient'}
                          </button>
                        )}
                        {isPtMissing && (
                          <button
                            onClick={() => handleSendPtReferral(patient.id)}
                            disabled={isRequested(patient.id, 'ptEvidence')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                              isRequested(patient.id, 'ptEvidence')
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                            {isRequested(patient.id, 'ptEvidence') ? 'PT Referral Sent' : 'Send PT Referral to Patient'}
                          </button>
                        )}
                        {patient.needsMedication && !medicationPrescribed[patient.id] && (
                          <button
                            onClick={() => handleOpenMedicationModal(patient.id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors bg-purple-600 text-white hover:bg-purple-700"
                          >
                            <Pill className="w-4 h-4" />
                            Prescribe Medication
                          </button>
                        )}
                        {patient.needsMedication && medicationPrescribed[patient.id] && !medicationSent[patient.id] && (
                          <button
                            onClick={() => handleSendMedicationToPatient(patient.id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors bg-purple-600 text-white hover:bg-purple-700"
                          >
                            <Send className="w-4 h-4" />
                            Send to Patient
                          </button>
                        )}
                        {patient.needsMedication && medicationSent[patient.id] && (
                          <span className="text-purple-600 text-sm flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Prescription Sent
                          </span>
                        )}
                        {patient.needsFMLAForm && !fmlaFormCompleted[patient.id] && (
                          <button
                            onClick={() => handleOpenFMLAModal(patient.id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors bg-orange-600 text-white hover:bg-orange-700"
                          >
                            <FileText className="w-4 h-4" />
                            Fill Out & Send FMLA Form
                          </button>
                        )}
                        {patient.needsFMLAForm && fmlaFormCompleted[patient.id] && (
                          <span className="text-orange-600 text-sm flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            FMLA Form Sent
                          </span>
                        )}
                        {!isMriMissing && !isPtMissing && !patient.needsSchedulingForm && !patient.needsMedication && !patient.needsFMLAForm && !approvedPatients[patient.id] && (
                          <button
                            onClick={() => handleApprovePatient(patient.id)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors bg-green-600 text-white hover:bg-green-700"
                          >
                            <UserCheck className="w-4 h-4" />
                            Approve Patient
                          </button>
                        )}
                        {approvedPatients[patient.id] && (
                          <span className="text-green-600 text-sm flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Approved
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-gray-600 text-sm mb-1">Total Patients</div>
          <div className="text-gray-900">{patients.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-gray-600 text-sm mb-1">Ready</div>
          <div className="text-green-700">
            {patients.filter(p => getMissingItems(p.items).length === 0 && !p.problems?.length).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-gray-600 text-sm mb-1">Pending</div>
          <div className="text-yellow-700">
            {patients.filter(p => getMissingItems(p.items).length > 0 || (p.problems?.length || 0) > 0).length}
          </div>
        </div>
      </div>
        </div>
      )}

      {/* Scheduling Form Modal */}
      <NewPatientModal
        isOpen={schedulingModalState.isOpen}
        onClose={handleCloseSchedulingModal}
        patientName={patients.find(p => p.id === schedulingModalState.patientId)?.name || ''}
        onSubmit={handleSchedulingFormSubmit}
      />

      {/* Medication Modal */}
      <MedicationModal
        isOpen={medicationModalState.isOpen}
        onClose={handleCloseMedicationModal}
        patientName={patients.find(p => p.id === medicationModalState.patientId)?.name || ''}
        onSubmit={handleMedicationSubmit}
      />

      {/* FMLA Form Modal */}
      <FMLAFormModal
        isOpen={fmlaModalState.isOpen}
        onClose={handleCloseFMLAModal}
        patientName={patients.find(p => p.id === fmlaModalState.patientId)?.name || ''}
        surgeryDate={patients.find(p => p.id === fmlaModalState.patientId)?.surgeryDate || ''}
        onSubmit={handleFMLAFormSubmit}
      />
    </div>
  );
}
