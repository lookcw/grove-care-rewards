import { X, Phone, Mail } from 'lucide-react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  requestType: 'mriScan' | 'ptEvidence';
  facilityInfo?: {
    name: string;
    phone: string;
  };
  onRequestFromPatient: () => void;
  onCallFacility: () => void;
}

export function RequestModal({
  isOpen,
  onClose,
  patientName,
  requestType,
  facilityInfo,
  onRequestFromPatient,
  onCallFacility
}: RequestModalProps) {
  if (!isOpen) return null;

  const itemName = requestType === 'mriScan' ? 'MRI' : 'PT';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">Request {itemName}</h2>
            <p className="text-gray-600 text-sm mt-1">{patientName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {facilityInfo ? (
            // If we have facility info, show call option
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 mb-2">Facility on file:</p>
                <p className="text-blue-800">{facilityInfo.name}</p>
                <div className="flex items-center gap-2 mt-3 text-blue-700">
                  <Phone className="w-4 h-4" />
                  <span>{facilityInfo.phone}</span>
                </div>
              </div>

              <button
                onClick={onCallFacility}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Facility to Request {itemName}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={onRequestFromPatient}
                className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Ask Patient for Different Facility
              </button>
            </div>
          ) : (
            // If we don't have facility info, ask patient first
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-900">
                  No {itemName} facility information on file for this patient.
                </p>
              </div>

              <button
                onClick={onRequestFromPatient}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Ask Patient for {itemName} Facility Information
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
