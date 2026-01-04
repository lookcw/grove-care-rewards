import { X, CheckCircle2, Clock, Circle } from 'lucide-react';

interface PatientEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  status: 'completed' | 'pending' | 'in_progress';
}

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    name: string;
    dob: string;
    mrn: string;
    phone: string;
    email: string;
    insurance: string;
    referringPhysician: string;
    surgeryDate?: string;
    surgeryTime?: string;
    procedure?: string;
    events: PatientEvent[];
  } | null;
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function PatientDetailsModal({ isOpen, onClose, patient }: PatientDetailsModalProps) {
  if (!isOpen || !patient) return null;

  const getStatusIcon = (status: PatientEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusColor = (status: PatientEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-600';
      case 'in_progress':
        return 'border-blue-600';
      case 'pending':
        return 'border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
            <p className="text-gray-600 text-sm mt-1">MRN: {patient.mrn}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Patient Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Date of Birth</label>
              <p className="text-gray-900">{formatDate(patient.dob)}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Phone</label>
              <p className="text-gray-900">{patient.phone}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-900">{patient.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Insurance</label>
              <p className="text-gray-900">{patient.insurance}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-500">Referring Physician</label>
              <p className="text-gray-900">{patient.referringPhysician}</p>
            </div>
            {patient.procedure && (
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Procedure</label>
                <p className="text-gray-900">{patient.procedure}</p>
              </div>
            )}
            {patient.surgeryDate && (
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Surgery Date</label>
                <p className="text-gray-900">
                  {formatDate(patient.surgeryDate)}
                  {patient.surgeryTime && ` @ ${patient.surgeryTime}`}
                </p>
              </div>
            )}
          </div>

          {/* Things Left To Do / In Progress */}
          {(() => {
            const pendingEvents = patient.events.filter(e => e.status === 'pending' || e.status === 'in_progress');
            const completedEvents = patient.events.filter(e => e.status === 'completed');

            return (
              <>
                {pendingEvents.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      Things Left To Do ({pendingEvents.length})
                    </h3>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
                      {pendingEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-3">
                          {event.status === 'in_progress' ? (
                            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-medium ${event.status === 'in_progress' ? 'text-blue-700' : 'text-orange-700'}`}>
                                {event.title}
                              </span>
                              <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Things Completed */}
                {completedEvents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Things Completed ({completedEvents.length})
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                      {completedEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-green-800">{event.title}</span>
                              <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
