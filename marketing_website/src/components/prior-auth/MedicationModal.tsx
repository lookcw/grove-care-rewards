import { useState } from 'react';
import { X, Pill } from 'lucide-react';
import { MultiSelect } from './MultiSelect';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onSubmit: (data: MedicationFormData) => void;
}

export interface MedicationFormData {
  medications: string[];
}

const orthoMedicationOptions = [
  // NSAIDs
  'Celecoxib (Celebrex) 200mg',
  'Meloxicam (Mobic) 15mg',
  'Naproxen (Aleve) 500mg',
  'Ibuprofen 800mg',
  'Diclofenac (Voltaren) 75mg',
  'Ketorolac (Toradol) 10mg',
  // Pain Management
  'Tramadol 50mg',
  'Acetaminophen 500mg',
  'Acetaminophen 1000mg',
  'Hydrocodone/Acetaminophen 5/325mg',
  'Hydrocodone/Acetaminophen 10/325mg',
  'Oxycodone 5mg',
  'Oxycodone 10mg',
  'Oxycodone/Acetaminophen 5/325mg',
  // Muscle Relaxants
  'Cyclobenzaprine (Flexeril) 10mg',
  'Methocarbamol (Robaxin) 750mg',
  'Tizanidine (Zanaflex) 4mg',
  'Baclofen 10mg',
  'Carisoprodol (Soma) 350mg',
  // Nerve Pain
  'Gabapentin (Neurontin) 100mg',
  'Gabapentin (Neurontin) 300mg',
  'Gabapentin (Neurontin) 600mg',
  'Pregabalin (Lyrica) 75mg',
  'Pregabalin (Lyrica) 150mg',
  'Duloxetine (Cymbalta) 30mg',
  'Duloxetine (Cymbalta) 60mg',
  // Corticosteroids
  'Prednisone 10mg',
  'Prednisone 20mg',
  'Methylprednisolone 4mg (Medrol Dose Pack)',
  'Dexamethasone 4mg',
  // Bone Health
  'Alendronate (Fosamax) 70mg',
  'Calcium + Vitamin D 600mg/400IU',
  'Vitamin D3 2000IU',
  // Blood Thinners / DVT Prophylaxis
  'Enoxaparin (Lovenox) 40mg',
  'Aspirin 81mg',
  'Aspirin 325mg',
  'Rivaroxaban (Xarelto) 10mg',
  'Apixaban (Eliquis) 2.5mg',
  // Anti-nausea
  'Ondansetron (Zofran) 4mg',
  'Promethazine (Phenergan) 25mg',
  // Antibiotics (prophylactic)
  'Cefazolin 1g IV',
  'Cephalexin (Keflex) 500mg',
  'Clindamycin 300mg',
];

export function MedicationModal({ isOpen, onClose, patientName, onSubmit }: MedicationModalProps) {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedMedications.length === 0) {
      alert('Please select at least one medication');
      return;
    }
    onSubmit({ medications: selectedMedications });
    setSelectedMedications([]);
  };

  const handleClose = () => {
    setSelectedMedications([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Pill className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-gray-900">Prescribe Medication</h2>
              <p className="text-gray-600 text-sm mt-1">{patientName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <MultiSelect
            label="Medications"
            options={orthoMedicationOptions}
            selected={selectedMedications}
            onChange={setSelectedMedications}
            placeholder="Type to search medications..."
          />

          {selectedMedications.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Selected Medications ({selectedMedications.length})
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {selectedMedications.map((med, idx) => (
                  <li key={med}>{idx + 1}. {med}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Prescribe & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
