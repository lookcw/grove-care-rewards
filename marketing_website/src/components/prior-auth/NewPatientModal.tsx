import { useState } from 'react';
import { X } from 'lucide-react';
import { MultiSelect } from './MultiSelect';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onSubmit: (data: NewPatientFormData) => void;
}

export interface NewPatientFormData {
  instrumentation: string[];
  surgeryTypes: string[];
  requirements: string[];
  surgeryCenter: 'Jefferson' | 'Atlantic' | '';
  cptCodes: string[];
}

const instrumentationOptions = [
  'Medtronic',
  'Stryker',
  'DePuy Synthes',
  'Zimmer Biomet',
  'NuVasive',
  'Globus Medical',
  'K2M',
  'Alphatec Spine'
];

const surgeryTypeOptions = [
  'ACDF (Anterior Cervical Discectomy and Fusion)',
  'PCDF (Posterior Cervical Discectomy and Fusion)',
  'PCD (Posterior Cervical Decompression)',
  'ALIF (Anterior Lumbar Interbody Fusion)',
  'PLIF (Posterior Lumbar Interbody Fusion)',
  'TLIF (Transforaminal Lumbar Interbody Fusion)',
  'Laminectomy',
  'Microdiscectomy',
  'Spinal Fusion',
  'Kyphoplasty',
  'Vertebroplasty'
];

const requirementOptions = [
  'Blood (Type & Cross)',
  'C-arm (Fluoroscopy)',
  'Neuromonitoring',
  'Cell Saver',
  'Bone Graft',
  'BMP (Bone Morphogenetic Protein)',
  'Navigation System',
  'Microscope',
  'ICU Bed',
  'Post-op Brace'
];

const cptCodeOptions = [
  '22551 - Arthrodesis, anterior interbody, cervical below C2',
  '22552 - Arthrodesis, anterior interbody, cervical below C2, each additional',
  '22554 - Arthrodesis, anterior interbody, cervical',
  '22558 - Arthrodesis, anterior interbody technique, lumbar',
  '22612 - Arthrodesis, posterior, lumbar',
  '22630 - Arthrodesis, posterior interbody technique, lumbar',
  '22633 - Arthrodesis, combined posterior/anterior, lumbar',
  '22845 - Anterior instrumentation, 2-3 vertebral segments',
  '22846 - Anterior instrumentation, 4-7 vertebral segments',
  '22853 - Insertion of interbody biomechanical device',
  '22854 - Insertion of interbody biomechanical device, each additional',
  '63030 - Laminotomy (hemilaminectomy), lumbar',
  '63047 - Laminectomy with foraminotomy, lumbar',
  '63050 - Laminoplasty, cervical'
];

const surgeryDefaults: Record<string, {
  instrumentation: string[];
  requirements: string[];
  cptCodes: string[];
}> = {
  'ACDF (Anterior Cervical Discectomy and Fusion)': {
    instrumentation: ['Medtronic'],
    requirements: ['C-arm (Fluoroscopy)', 'Neuromonitoring', 'Post-op Brace'],
    cptCodes: ['22551 - Arthrodesis, anterior interbody, cervical below C2', '22845 - Anterior instrumentation, 2-3 vertebral segments']
  },
  'PCDF (Posterior Cervical Discectomy and Fusion)': {
    instrumentation: ['Medtronic'],
    requirements: ['C-arm (Fluoroscopy)', 'Neuromonitoring', 'Cell Saver'],
    cptCodes: ['22554 - Arthrodesis, anterior interbody, cervical', '22612 - Arthrodesis, posterior, lumbar']
  },
  'PCD (Posterior Cervical Decompression)': {
    instrumentation: [],
    requirements: ['C-arm (Fluoroscopy)', 'Neuromonitoring'],
    cptCodes: ['63050 - Laminoplasty, cervical']
  },
  'ALIF (Anterior Lumbar Interbody Fusion)': {
    instrumentation: ['Medtronic'],
    requirements: ['C-arm (Fluoroscopy)', 'Neuromonitoring', 'Cell Saver', 'Bone Graft'],
    cptCodes: ['22558 - Arthrodesis, anterior interbody technique, lumbar', '22853 - Insertion of interbody biomechanical device']
  },
  'PLIF (Posterior Lumbar Interbody Fusion)': {
    instrumentation: ['Medtronic'],
    requirements: ['C-arm (Fluoroscopy)', 'Neuromonitoring', 'Cell Saver', 'Bone Graft'],
    cptCodes: ['22630 - Arthrodesis, posterior interbody technique, lumbar', '22853 - Insertion of interbody biomechanical device']
  },
  'TLIF (Transforaminal Lumbar Interbody Fusion)': {
    instrumentation: ['Medtronic'],
    requirements: ['C-arm (Fluoroscopy)', 'Neuromonitoring', 'Cell Saver', 'Bone Graft'],
    cptCodes: ['22630 - Arthrodesis, posterior interbody technique, lumbar', '22853 - Insertion of interbody biomechanical device']
  },
  'Laminectomy': {
    instrumentation: [],
    requirements: ['C-arm (Fluoroscopy)', 'Neuromonitoring'],
    cptCodes: ['63047 - Laminectomy with foraminotomy, lumbar']
  },
  'Microdiscectomy': {
    instrumentation: [],
    requirements: ['C-arm (Fluoroscopy)', 'Microscope'],
    cptCodes: ['63030 - Laminotomy (hemilaminectomy), lumbar']
  },
  'Spinal Fusion': {
    instrumentation: ['Medtronic'],
    requirements: ['C-arm (Fluoroscopy)', 'Neuromonitoring', 'Cell Saver', 'Bone Graft'],
    cptCodes: ['22612 - Arthrodesis, posterior, lumbar', '22853 - Insertion of interbody biomechanical device']
  },
  'Kyphoplasty': {
    instrumentation: ['Medtronic'],
    requirements: ['C-arm (Fluoroscopy)'],
    cptCodes: ['22853 - Insertion of interbody biomechanical device']
  },
  'Vertebroplasty': {
    instrumentation: [],
    requirements: ['C-arm (Fluoroscopy)'],
    cptCodes: ['22853 - Insertion of interbody biomechanical device']
  }
};

export function NewPatientModal({ isOpen, onClose, patientName, onSubmit }: NewPatientModalProps) {
  const [formData, setFormData] = useState<NewPatientFormData>({
    instrumentation: [],
    surgeryTypes: [],
    requirements: [],
    surgeryCenter: '',
    cptCodes: []
  });

  const handleSurgeryTypeChange = (selected: string[]) => {
    // Get defaults from all selected surgery types
    const defaults = selected.reduce((acc, surgeryType) => {
      const surgeryDefault = surgeryDefaults[surgeryType];
      if (surgeryDefault) {
        acc.instrumentation = [...new Set([...acc.instrumentation, ...surgeryDefault.instrumentation])];
        acc.requirements = [...new Set([...acc.requirements, ...surgeryDefault.requirements])];
        acc.cptCodes = [...new Set([...acc.cptCodes, ...surgeryDefault.cptCodes])];
      }
      return acc;
    }, { instrumentation: [] as string[], requirements: [] as string[], cptCodes: [] as string[] });

    setFormData({
      ...formData,
      surgeryTypes: selected,
      instrumentation: defaults.instrumentation,
      requirements: defaults.requirements,
      cptCodes: defaults.cptCodes
    });
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.surgeryCenter) {
      alert('Please select a surgery center');
      return;
    }
    onSubmit(formData);
    setFormData({
      instrumentation: [],
      surgeryTypes: [],
      requirements: [],
      surgeryCenter: '',
      cptCodes: []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">New Patient Authorization</h2>
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
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Surgery Types - First field, auto-fills others */}
          <MultiSelect
            label="Surgery Type"
            options={surgeryTypeOptions}
            selected={formData.surgeryTypes}
            onChange={handleSurgeryTypeChange}
            placeholder="Select surgery types"
          />

          {/* Instrumentation */}
          <MultiSelect
            label="Instrumentation"
            options={instrumentationOptions}
            selected={formData.instrumentation}
            onChange={(selected) => setFormData({ ...formData, instrumentation: selected })}
            placeholder="Select instrumentation vendors"
          />

          {/* Requirements */}
          <MultiSelect
            label="Requirements"
            options={requirementOptions}
            selected={formData.requirements}
            onChange={(selected) => setFormData({ ...formData, requirements: selected })}
            placeholder="Select required equipment/services"
          />

          {/* Surgery Center */}
          <div className="space-y-2">
            <label className="block text-gray-700">Surgery Center *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="surgeryCenter"
                  value="Jefferson"
                  checked={formData.surgeryCenter === 'Jefferson'}
                  onChange={(e) => setFormData({ ...formData, surgeryCenter: e.target.value as 'Jefferson' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Jefferson</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="surgeryCenter"
                  value="Atlantic"
                  checked={formData.surgeryCenter === 'Atlantic'}
                  onChange={(e) => setFormData({ ...formData, surgeryCenter: e.target.value as 'Atlantic' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Atlantic</span>
              </label>
            </div>
          </div>

          {/* CPT Codes */}
          <MultiSelect
            label="CPT Codes"
            options={cptCodeOptions}
            selected={formData.cptCodes}
            onChange={(selected) => setFormData({ ...formData, cptCodes: selected })}
            placeholder="Select CPT codes"
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Authorization
          </button>
        </div>
      </div>
    </div>
  );
}
