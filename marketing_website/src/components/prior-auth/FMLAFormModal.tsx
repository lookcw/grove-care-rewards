import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

interface FMLAFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  surgeryDate: string;
  onSubmit: (data: FMLAFormData) => void;
}

export interface FMLAFormData {
  procedure: string;
  diagnosis: string;
  icd10Code: string;
  dateOfDiagnosis: string;
  surgeryDate: string;
  regimenOfTreatment: string;
  expectedRecoveryWeeks: string;
  restrictions: string[];
}

interface ProcedureDefaults {
  diagnosis: string;
  icd10Code: string;
  regimenOfTreatment: string;
  expectedRecoveryWeeks: string;
  restrictions: string[];
}

const procedureOptions = [
  'Total Hip Replacement',
  'Total Knee Replacement',
  'Partial Knee Replacement',
  'Hip Resurfacing',
  'ACL Reconstruction',
  'Rotator Cuff Repair',
  'Shoulder Replacement',
  'Spinal Fusion',
  'Laminectomy',
  'Discectomy',
  'Carpal Tunnel Release',
  'Trigger Finger Release',
  'Bunionectomy',
  'Ankle Fusion',
  'Achilles Tendon Repair',
];

const procedureDefaults: Record<string, ProcedureDefaults> = {
  'Total Hip Replacement': {
    diagnosis: 'Osteoarthritis of hip',
    icd10Code: 'M16.11',
    regimenOfTreatment: 'Surgical hip replacement followed by inpatient rehabilitation, home physical therapy 3x/week for 6 weeks, then outpatient PT 2x/week for 6 weeks. Weight bearing as tolerated with walker/cane progression.',
    expectedRecoveryWeeks: '12',
    restrictions: ['No driving for 4-6 weeks', 'No bending past 90 degrees', 'No crossing legs', 'Use assistive devices for ambulation', 'No lifting over 10 lbs for 6 weeks']
  },
  'Total Knee Replacement': {
    diagnosis: 'Osteoarthritis of knee',
    icd10Code: 'M17.11',
    regimenOfTreatment: 'Surgical knee replacement followed by inpatient rehabilitation, home physical therapy 3x/week for 6 weeks, then outpatient PT 2x/week for 6 weeks. Weight bearing as tolerated with walker/cane progression.',
    expectedRecoveryWeeks: '12',
    restrictions: ['No driving for 4-6 weeks', 'Use assistive devices for ambulation', 'No kneeling or squatting', 'No lifting over 10 lbs for 6 weeks', 'Elevation and ice as needed']
  },
  'Partial Knee Replacement': {
    diagnosis: 'Unicompartmental osteoarthritis of knee',
    icd10Code: 'M17.11',
    regimenOfTreatment: 'Surgical partial knee replacement followed by physical therapy 2-3x/week for 4-6 weeks. Weight bearing as tolerated.',
    expectedRecoveryWeeks: '8',
    restrictions: ['No driving for 2-4 weeks', 'Use cane as needed', 'No high-impact activities for 8 weeks']
  },
  'Hip Resurfacing': {
    diagnosis: 'Osteoarthritis of hip',
    icd10Code: 'M16.11',
    regimenOfTreatment: 'Surgical hip resurfacing followed by physical therapy 2-3x/week for 6-8 weeks. Progressive weight bearing.',
    expectedRecoveryWeeks: '10',
    restrictions: ['No driving for 4-6 weeks', 'Limited hip flexion', 'Use assistive devices initially', 'No lifting over 15 lbs for 4 weeks']
  },
  'ACL Reconstruction': {
    diagnosis: 'Anterior cruciate ligament rupture',
    icd10Code: 'S83.511A',
    regimenOfTreatment: 'Surgical ACL reconstruction with graft, followed by aggressive physical therapy protocol 3x/week for 4-6 months. Brace wear required. Progressive return to activity.',
    expectedRecoveryWeeks: '24',
    restrictions: ['No driving for 2-4 weeks', 'Brace wear at all times initially', 'No pivoting or cutting movements', 'No sports for 6-9 months', 'Crutches for 2-4 weeks']
  },
  'Rotator Cuff Repair': {
    diagnosis: 'Rotator cuff tear',
    icd10Code: 'M75.10',
    regimenOfTreatment: 'Surgical rotator cuff repair followed by sling immobilization for 4-6 weeks, then progressive physical therapy 2-3x/week for 3-4 months.',
    expectedRecoveryWeeks: '16',
    restrictions: ['Sling wear for 4-6 weeks', 'No lifting with affected arm', 'No reaching overhead', 'No driving while in sling', 'Sleep in reclined position']
  },
  'Shoulder Replacement': {
    diagnosis: 'Osteoarthritis of shoulder',
    icd10Code: 'M19.011',
    regimenOfTreatment: 'Surgical shoulder replacement followed by sling immobilization, then progressive physical therapy 2-3x/week for 3-4 months.',
    expectedRecoveryWeeks: '16',
    restrictions: ['Sling wear for 4-6 weeks', 'No lifting over 5 lbs with affected arm for 12 weeks', 'No driving while in sling', 'No reaching behind back']
  },
  'Spinal Fusion': {
    diagnosis: 'Degenerative disc disease',
    icd10Code: 'M51.36',
    regimenOfTreatment: 'Surgical spinal fusion followed by limited activity, progressive walking program, physical therapy starting at 6 weeks post-op 2-3x/week for 8-12 weeks.',
    expectedRecoveryWeeks: '16',
    restrictions: ['No bending, lifting, or twisting (BLT precautions)', 'No lifting over 10 lbs for 12 weeks', 'No driving for 4-6 weeks', 'Brace wear as prescribed', 'Limited sitting initially']
  },
  'Laminectomy': {
    diagnosis: 'Lumbar spinal stenosis',
    icd10Code: 'M48.06',
    regimenOfTreatment: 'Surgical laminectomy followed by progressive walking program, physical therapy 2x/week for 4-6 weeks starting 2 weeks post-op.',
    expectedRecoveryWeeks: '8',
    restrictions: ['No bending or twisting for 4 weeks', 'No lifting over 10 lbs for 6 weeks', 'No driving for 2-3 weeks', 'Limit prolonged sitting']
  },
  'Discectomy': {
    diagnosis: 'Lumbar disc herniation',
    icd10Code: 'M51.16',
    regimenOfTreatment: 'Surgical discectomy followed by progressive activity, physical therapy 2x/week for 4-6 weeks.',
    expectedRecoveryWeeks: '6',
    restrictions: ['No bending or twisting for 2-4 weeks', 'No lifting over 10 lbs for 4 weeks', 'No driving for 1-2 weeks', 'Limit prolonged sitting']
  },
  'Carpal Tunnel Release': {
    diagnosis: 'Carpal tunnel syndrome',
    icd10Code: 'G56.00',
    regimenOfTreatment: 'Surgical carpal tunnel release followed by splint wear, hand therapy as needed, progressive grip strengthening.',
    expectedRecoveryWeeks: '4',
    restrictions: ['Splint wear for 1-2 weeks', 'No heavy gripping or lifting for 4 weeks', 'Keep incision dry', 'May return to light duty in 1-2 weeks']
  },
  'Trigger Finger Release': {
    diagnosis: 'Trigger finger',
    icd10Code: 'M65.30',
    regimenOfTreatment: 'Surgical trigger finger release followed by gentle range of motion exercises, progressive return to normal hand use.',
    expectedRecoveryWeeks: '2',
    restrictions: ['Keep bandage dry for 48 hours', 'No heavy gripping for 2 weeks', 'Gentle finger exercises']
  },
  'Bunionectomy': {
    diagnosis: 'Hallux valgus',
    icd10Code: 'M20.10',
    regimenOfTreatment: 'Surgical bunionectomy followed by protected weight bearing in surgical shoe, progressive transition to regular footwear, physical therapy as needed.',
    expectedRecoveryWeeks: '8',
    restrictions: ['Surgical shoe for 4-6 weeks', 'Limited weight bearing initially', 'Elevation when possible', 'No regular shoes for 6-8 weeks']
  },
  'Ankle Fusion': {
    diagnosis: 'Osteoarthritis of ankle',
    icd10Code: 'M19.071',
    regimenOfTreatment: 'Surgical ankle fusion followed by non-weight bearing for 6-8 weeks, then progressive weight bearing, physical therapy 2x/week for 6-8 weeks.',
    expectedRecoveryWeeks: '16',
    restrictions: ['Non-weight bearing for 6-8 weeks', 'Cast/boot wear', 'No driving for 8-10 weeks', 'Crutches or knee scooter required']
  },
  'Achilles Tendon Repair': {
    diagnosis: 'Achilles tendon rupture',
    icd10Code: 'S86.011A',
    regimenOfTreatment: 'Surgical Achilles repair followed by cast/boot immobilization, non-weight bearing progressing to weight bearing, physical therapy 2-3x/week for 3-4 months.',
    expectedRecoveryWeeks: '16',
    restrictions: ['Non-weight bearing for 4-6 weeks', 'Boot wear for 8-12 weeks', 'No driving for 8-10 weeks', 'No running or jumping for 6 months']
  },
};

export function FMLAFormModal({ isOpen, onClose, patientName, surgeryDate, onSubmit }: FMLAFormModalProps) {
  const [formData, setFormData] = useState<FMLAFormData>({
    procedure: '',
    diagnosis: '',
    icd10Code: '',
    dateOfDiagnosis: '',
    surgeryDate: surgeryDate,
    regimenOfTreatment: '',
    expectedRecoveryWeeks: '',
    restrictions: []
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        surgeryDate: surgeryDate
      }));
    }
  }, [isOpen, surgeryDate]);

  const handleProcedureChange = (procedure: string) => {
    const defaults = procedureDefaults[procedure];
    if (defaults) {
      setFormData({
        ...formData,
        procedure,
        diagnosis: defaults.diagnosis,
        icd10Code: defaults.icd10Code,
        regimenOfTreatment: defaults.regimenOfTreatment,
        expectedRecoveryWeeks: defaults.expectedRecoveryWeeks,
        restrictions: defaults.restrictions
      });
    } else {
      setFormData({
        ...formData,
        procedure,
        diagnosis: '',
        icd10Code: '',
        regimenOfTreatment: '',
        expectedRecoveryWeeks: '',
        restrictions: []
      });
    }
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.procedure) {
      alert('Please select a procedure');
      return;
    }
    if (!formData.dateOfDiagnosis) {
      alert('Please enter the date of diagnosis');
      return;
    }
    onSubmit(formData);
    setFormData({
      procedure: '',
      diagnosis: '',
      icd10Code: '',
      dateOfDiagnosis: '',
      surgeryDate: surgeryDate,
      regimenOfTreatment: '',
      expectedRecoveryWeeks: '',
      restrictions: []
    });
  };

  const handleClose = () => {
    setFormData({
      procedure: '',
      diagnosis: '',
      icd10Code: '',
      dateOfDiagnosis: '',
      surgeryDate: surgeryDate,
      regimenOfTreatment: '',
      expectedRecoveryWeeks: '',
      restrictions: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-gray-900">FMLA Form</h2>
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
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Procedure Selection */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Procedure *</label>
            <select
              value={formData.procedure}
              onChange={(e) => handleProcedureChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a procedure...</option>
              {procedureOptions.map(proc => (
                <option key={proc} value={proc}>{proc}</option>
              ))}
            </select>
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Diagnosis</label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Diagnosis"
            />
          </div>

          {/* ICD-10 Code */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">ICD-10 Code</label>
            <input
              type="text"
              value={formData.icd10Code}
              onChange={(e) => setFormData({ ...formData, icd10Code: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ICD-10 Code"
            />
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Date of Diagnosis *</label>
              <input
                type="date"
                value={formData.dateOfDiagnosis}
                onChange={(e) => setFormData({ ...formData, dateOfDiagnosis: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Surgery Date</label>
              <input
                type="date"
                value={formData.surgeryDate}
                onChange={(e) => setFormData({ ...formData, surgeryDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Expected Recovery */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Expected Recovery (weeks)</label>
            <input
              type="text"
              value={formData.expectedRecoveryWeeks}
              onChange={(e) => setFormData({ ...formData, expectedRecoveryWeeks: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 12"
            />
          </div>

          {/* Regimen of Treatment */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Regimen of Treatment</label>
            <textarea
              value={formData.regimenOfTreatment}
              onChange={(e) => setFormData({ ...formData, regimenOfTreatment: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the treatment regimen..."
            />
          </div>

          {/* Restrictions */}
          {formData.restrictions.length > 0 && (
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Work/Activity Restrictions</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {formData.restrictions.map((restriction, idx) => (
                    <li key={idx} className="text-sm">{restriction}</li>
                  ))}
                </ul>
              </div>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete & Send FMLA Form
          </button>
        </div>
      </div>
    </div>
  );
}
