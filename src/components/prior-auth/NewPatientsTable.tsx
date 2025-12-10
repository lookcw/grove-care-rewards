import { useState } from 'react';
import { FileText, Phone, CheckCircle2, Printer } from 'lucide-react';
import { NewPatientModal, NewPatientFormData } from './NewPatientModal';

interface NewPatient {
  id: string;
  name: string;
  surgeryDate: string;
  missing: 'Surgery Schedule Form Missing' | 'Surgery Not Scheduled' | null;
  medicalClearance: 'Missing' | 'Received' | null;
  lastAction: 'Upload scheduling form to ECW' | 'Called MRI facility' | 'None';
  formCompleted?: boolean;
  sentToCenter?: boolean;
  calledForClearance?: boolean;
  actionType?: 'fillForm' | 'sendToCenter' | 'callForClearance';
}

export function NewPatientsTable() {
  const [newPatients, setNewPatients] = useState<NewPatient[]>([
    {
      id: 'new-1',
      name: 'Jennifer Williams',
      surgeryDate: '2025-02-05',
      missing: 'Surgery Schedule Form Missing',
      medicalClearance: 'Missing',
      lastAction: 'Upload scheduling form to ECW',
      actionType: 'fillForm'
    },
    {
      id: 'new-2',
      name: 'Christopher Davis',
      surgeryDate: '2025-02-08',
      missing: 'Surgery Not Scheduled',
      medicalClearance: 'Missing',
      lastAction: 'Called MRI facility',
      actionType: 'callForClearance'
    },
    {
      id: 'new-3',
      name: 'Amanda Brown',
      surgeryDate: '2025-02-12',
      missing: null,
      medicalClearance: 'Received',
      lastAction: 'None',
      actionType: undefined
    }
  ]);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    patientId: string | null;
  }>({
    isOpen: false,
    patientId: null
  });

  const handleOpenForm = (patientId: string) => {
    setModalState({ isOpen: true, patientId });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, patientId: null });
  };

  const handleSubmit = (data: NewPatientFormData) => {
    const patient = newPatients.find(p => p.id === modalState.patientId);
    console.log('Authorization submitted for:', patient?.name, data);

    setNewPatients(prev => prev.map(p =>
      p.id === modalState.patientId ? { ...p, formCompleted: true } : p
    ));

    alert(`Scheduling form completed for ${patient?.name}\n\nInstrumentation: ${data.instrumentation.join(', ')}\nSurgery Types: ${data.surgeryTypes.join(', ')}\nCenter: ${data.surgeryCenter}`);
    handleCloseModal();
  };

  const handleSendToCenter = (patientId: string) => {
    const patient = newPatients.find(p => p.id === patientId);
    setNewPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, sentToCenter: true } : p
    ));
    alert(`Scheduling form sent to surgery center for ${patient?.name}`);
  };

  const handleCallForClearance = (patientId: string) => {
    const patient = newPatients.find(p => p.id === patientId);
    setNewPatients(prev => prev.map(p =>
      p.id === patientId ? { ...p, calledForClearance: true } : p
    ));
    alert(`Called facility for medical clearance for ${patient?.name}`);
  };

  const currentPatient = newPatients.find(p => p.id === modalState.patientId);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-gray-700">Patient</th>
              <th className="text-left px-6 py-4 text-gray-700">Surgery Date</th>
              <th className="text-left px-6 py-4 text-gray-700">Missing</th>
              <th className="text-left px-6 py-4 text-gray-700">Medical Clearance</th>
              <th className="text-center px-6 py-4 text-gray-700">Action</th>
              <th className="text-left px-6 py-4 text-gray-700">Last Action Taken</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {newPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-900">{patient.name}</div>
                    {patient.formCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600">{patient.surgeryDate}</div>
                </td>
                <td className="px-6 py-4">
                  {patient.missing ? (
                    <span className="text-red-600">{patient.missing}</span>
                  ) : (
                    <span className="text-green-600">All good</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {patient.medicalClearance === 'Missing' ? (
                    <span className="text-red-600">Missing</span>
                  ) : patient.medicalClearance === 'Received' ? (
                    <span className="text-green-600">Received</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {!patient.actionType ? (
                      <span className="text-gray-400">No action needed</span>
                    ) : patient.actionType === 'callForClearance' ? (
                      <button
                        onClick={() => handleCallForClearance(patient.id)}
                        disabled={patient.calledForClearance}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          patient.calledForClearance
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <Printer className="w-4 h-4" />
                        {patient.calledForClearance ? 'Scheduled' : 'Schedule Surgery'}
                      </button>
                    ) : patient.actionType === 'sendToCenter' ? (
                      <button
                        onClick={() => handleSendToCenter(patient.id)}
                        disabled={patient.sentToCenter}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          patient.sentToCenter
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        {patient.sentToCenter ? 'Sent to Surgery Center' : 'Schedule with Surgery Center'}
                      </button>
                    ) : !patient.formCompleted ? (
                      <button
                        onClick={() => handleOpenForm(patient.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Fill Out Scheduling Form
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendToCenter(patient.id)}
                        disabled={patient.sentToCenter}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          patient.sentToCenter
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        {patient.sentToCenter ? 'Sent to Surgery Center' : 'Send to Surgery Center'}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-400">{patient.lastAction}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewPatientModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        patientName={currentPatient?.name || ''}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
