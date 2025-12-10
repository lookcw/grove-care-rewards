import { useState } from 'react';
import { FileText, Send, CheckCircle2 } from 'lucide-react';
import { NewPatientModal, NewPatientFormData } from './NewPatientModal';

interface NewPatient {
  id: string;
  name: string;
  surgeryDate: string;
  formCompleted?: boolean;
  sentToCenter?: boolean;
  actionType?: 'fillForm' | 'sendToCenter';
}

export function NewPatientsTable() {
  const [newPatients, setNewPatients] = useState<NewPatient[]>([
    {
      id: 'new-1',
      name: 'Jennifer Williams',
      surgeryDate: '2025-02-05',
      actionType: 'fillForm'
    },
    {
      id: 'new-2',
      name: 'Christopher Davis',
      surgeryDate: '2025-02-08',
      actionType: 'sendToCenter'
    },
    {
      id: 'new-3',
      name: 'Amanda Brown',
      surgeryDate: '2025-02-12',
      actionType: 'fillForm'
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

    // Mark form as completed
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

  const currentPatient = newPatients.find(p => p.id === modalState.patientId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-gray-900 mb-2">New Patients</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-700">Patient</th>
                <th className="text-left px-6 py-4 text-gray-700">Surgery Date</th>
                <th className="text-center px-6 py-4 text-gray-700">Action</th>
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
                    <div className="flex justify-center gap-2">
                      {patient.actionType === 'sendToCenter' ? (
                        <button
                          onClick={() => handleSendToCenter(patient.id)}
                          disabled={patient.sentToCenter}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            patient.sentToCenter
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <Send className="w-4 h-4" />
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
                          <Send className="w-4 h-4" />
                          {patient.sentToCenter ? 'Sent to Surgery Center' : 'Send to Surgery Center'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
