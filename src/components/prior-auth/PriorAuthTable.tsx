import { useState } from 'react';
import { Send, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { RequestModal } from './RequestModal';
import { NewPatientsTable } from './NewPatientsTable';

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
}

const itemLabels = {
  schedulingOrtho: 'Scheduling form from ortho clinic',
  schedulingFacility: 'Scheduling form to facility',
  consent: 'Consent form',
  preAdmission: 'Pre-admission testing form',
  surgeryScheduled: 'Surgery date scheduled',
  insuranceCard: 'Insurance card',
  demographics: 'Demographics',
  mriScan: 'MRI scan',
  ptEvidence: 'Evidence of PT',
  icdCodes: 'ICD 10 codes'
};

export function PriorAuthTable() {
  const [patients, setPatients] = useState<Patient[]>([
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
      problems: ['Instrumentation may not be approved by insurance', 'Prior authorization expired']
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
      problems: []
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
        name: 'Regional MRI Center',
        phone: '(555) 456-7890'
      },
      ptFacility: {
        name: 'Elite Physical Therapy',
        phone: '(555) 567-8901'
      }
    }
  ]);

  const [requestedItems, setRequestedItems] = useState<{ [patientId: string]: Set<string> }>({});
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    patientId: string | null;
    requestType: 'mriScan' | 'ptEvidence' | null;
  }>({
    isOpen: false,
    patientId: null,
    requestType: null
  });

  const getMissingItems = (items: Patient['items']) => {
    const missing: string[] = [];
    (Object.keys(items) as Array<keyof Patient['items']>).forEach(key => {
      if (!items[key]) {
        missing.push(itemLabels[key]);
      }
    });
    return missing;
  };

  const handleRequest = (patientId: string, itemType: 'mriScan' | 'ptEvidence', patientName: string) => {
    setModalState({
      isOpen: true,
      patientId,
      requestType: itemType
    });
  };

  const handleRequestFromPatient = () => {
    if (modalState.patientId && modalState.requestType) {
      const patient = patients.find(p => p.id === modalState.patientId);
      const itemName = modalState.requestType === 'mriScan' ? 'MRI facility' : 'PT facility';

      setRequestedItems(prev => ({
        ...prev,
        [modalState.patientId!]: new Set([...(prev[modalState.patientId!] || []), modalState.requestType!])
      }));

      setModalState({ isOpen: false, patientId: null, requestType: null });
      alert(`Request sent to ${patient?.name} for ${itemName} information`);
    }
  };

  const handleCallFacility = () => {
    if (modalState.patientId && modalState.requestType) {
      const patient = patients.find(p => p.id === modalState.patientId);
      const facility = modalState.requestType === 'mriScan' ? patient?.mriFacility : patient?.ptFacility;
      const itemName = modalState.requestType === 'mriScan' ? 'MRI' : 'PT evidence';

      setRequestedItems(prev => ({
        ...prev,
        [modalState.patientId!]: new Set([...(prev[modalState.patientId!] || []), modalState.requestType!])
      }));

      setModalState({ isOpen: false, patientId: null, requestType: null });
      alert(`Calling ${facility?.name} at ${facility?.phone} to request ${itemName} for ${patient?.name}`);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, patientId: null, requestType: null });
  };

  const isRequested = (patientId: string, itemType: string) => {
    return requestedItems[patientId]?.has(itemType) || false;
  };

  const getCompletionCount = (items: Patient['items']) => {
    const completed = Object.values(items).filter(Boolean).length;
    return { completed, total: 10 };
  };

  const currentPatient = patients.find(p => p.id === modalState.patientId);
  const currentFacilityInfo = modalState.requestType === 'mriScan'
    ? currentPatient?.mriFacility
    : currentPatient?.ptFacility;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Prior Authorization Tracker</h1>
      </div>

      {/* New Patients Section */}
      <div className="mb-8">
        <NewPatientsTable />
      </div>

      {/* Existing Patients Section */}
      <div className="mb-4">
        <h2 className="text-gray-900 mb-2">In Progress Authorizations</h2>
        <p className="text-gray-600 text-sm">Patients with pending documentation</p>
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
                        {isMriMissing && (
                          <button
                            onClick={() => handleRequest(patient.id, 'mriScan', patient.name)}
                            disabled={isRequested(patient.id, 'mriScan')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                              isRequested(patient.id, 'mriScan')
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                            {isRequested(patient.id, 'mriScan') ? 'MRI Requested' : 'Request MRI'}
                          </button>
                        )}
                        {isPtMissing && (
                          <button
                            onClick={() => handleRequest(patient.id, 'ptEvidence', patient.name)}
                            disabled={isRequested(patient.id, 'ptEvidence')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                              isRequested(patient.id, 'ptEvidence')
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                            {isRequested(patient.id, 'ptEvidence') ? 'PT Requested' : 'Request PT'}
                          </button>
                        )}
                        {!isMriMissing && !isPtMissing && (
                          <span className="text-gray-400 text-sm">No actions needed</span>
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

      {/* Request Modal */}
      <RequestModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        patientName={currentPatient?.name || ''}
        requestType={modalState.requestType || 'mriScan'}
        facilityInfo={currentFacilityInfo}
        onRequestFromPatient={handleRequestFromPatient}
        onCallFacility={handleCallFacility}
      />
    </div>
  );
}
