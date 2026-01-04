import { useState, useEffect, useRef } from 'react';
import { X, FileText, ChevronDown, Check } from 'lucide-react';

interface PostingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  onSubmit: (data: PostingFormData) => void;
}

export interface PostingFormData {
  procedure: string;
  icd10Code: string;
  surgeryCenter: 'Holy Cross Hospital' | 'MASC' | 'Sentara' | '';
  surgeryDate: string;
  surgeryTime: string;
  cptCodes: string[];
  laterality: 'Left' | 'Right' | 'Bilateral' | 'N/A' | '';
  estimatedDuration: string;
  anesthesiaType: string;
  specialEquipment: string[];
  implants: string[];
}

interface ProcedureDefaults {
  icd10Code: string;
  cptCodes: string[];
  estimatedDuration: string;
  anesthesiaType: string;
  specialEquipment: string[];
  implants: string[];
  hasLaterality: boolean;
}

const procedureOptions = [
  'Total Hip Replacement',
  'Total Knee Replacement',
  'Partial Knee Replacement',
  'Hip Resurfacing',
  'ACL Reconstruction',
  'Rotator Cuff Repair',
  'Shoulder Replacement',
  'Total Shoulder Arthroplasty',
  'Reverse Shoulder Arthroplasty',
  'Spinal Fusion - Cervical',
  'Spinal Fusion - Lumbar',
  'Laminectomy',
  'Discectomy',
  'Carpal Tunnel Release',
  'Trigger Finger Release',
  'Bunionectomy',
  'Ankle Fusion',
  'Achilles Tendon Repair',
  'Meniscectomy',
  'Hip Arthroscopy',
  'Knee Arthroscopy',
  'Shoulder Arthroscopy',
];

const procedureDefaults: Record<string, ProcedureDefaults> = {
  'Total Hip Replacement': {
    icd10Code: 'M16.11',
    cptCodes: ['27130 - Total hip arthroplasty'],
    estimatedDuration: '2 hours',
    anesthesiaType: 'General or Spinal',
    specialEquipment: ['Hip replacement implant system', 'C-arm fluoroscopy', 'Cell saver'],
    implants: ['Acetabular cup', 'Femoral stem', 'Femoral head', 'Polyethylene liner'],
    hasLaterality: true
  },
  'Total Knee Replacement': {
    icd10Code: 'M17.11',
    cptCodes: ['27447 - Total knee arthroplasty'],
    estimatedDuration: '2 hours',
    anesthesiaType: 'General or Spinal',
    specialEquipment: ['Knee replacement implant system', 'Tourniquet', 'C-arm fluoroscopy'],
    implants: ['Femoral component', 'Tibial baseplate', 'Tibial insert', 'Patellar component'],
    hasLaterality: true
  },
  'Partial Knee Replacement': {
    icd10Code: 'M17.11',
    cptCodes: ['27446 - Unicompartmental knee arthroplasty'],
    estimatedDuration: '1.5 hours',
    anesthesiaType: 'General or Spinal',
    specialEquipment: ['Unicompartmental knee system', 'Tourniquet'],
    implants: ['Unicondylar femoral component', 'Unicondylar tibial component', 'Polyethylene insert'],
    hasLaterality: true
  },
  'Hip Resurfacing': {
    icd10Code: 'M16.11',
    cptCodes: ['27125 - Hip hemiarthroplasty'],
    estimatedDuration: '2 hours',
    anesthesiaType: 'General or Spinal',
    specialEquipment: ['Hip resurfacing system', 'C-arm fluoroscopy'],
    implants: ['Femoral resurfacing cap', 'Acetabular cup'],
    hasLaterality: true
  },
  'ACL Reconstruction': {
    icd10Code: 'S83.511A',
    cptCodes: ['29888 - ACL reconstruction'],
    estimatedDuration: '1.5 hours',
    anesthesiaType: 'General',
    specialEquipment: ['Arthroscopy tower', 'ACL graft fixation system', 'Tourniquet'],
    implants: ['Interference screws', 'Cortical button', 'Graft (autograft/allograft)'],
    hasLaterality: true
  },
  'Rotator Cuff Repair': {
    icd10Code: 'M75.10',
    cptCodes: ['29827 - Arthroscopic rotator cuff repair'],
    estimatedDuration: '1.5 hours',
    anesthesiaType: 'General with nerve block',
    specialEquipment: ['Arthroscopy tower', 'Suture anchor system', 'Beach chair or lateral positioning'],
    implants: ['Suture anchors', 'Knotless anchors'],
    hasLaterality: true
  },
  'Shoulder Replacement': {
    icd10Code: 'M19.011',
    cptCodes: ['23472 - Total shoulder arthroplasty'],
    estimatedDuration: '2.5 hours',
    anesthesiaType: 'General with nerve block',
    specialEquipment: ['Shoulder replacement system', 'Beach chair positioning'],
    implants: ['Humeral stem', 'Humeral head', 'Glenoid component', 'Polyethylene glenoid'],
    hasLaterality: true
  },
  'Total Shoulder Arthroplasty': {
    icd10Code: 'M19.011',
    cptCodes: ['23472 - Total shoulder arthroplasty'],
    estimatedDuration: '2.5 hours',
    anesthesiaType: 'General with nerve block',
    specialEquipment: ['Anatomic shoulder system', 'Beach chair positioning'],
    implants: ['Humeral stem', 'Humeral head', 'Glenoid component', 'Polyethylene glenoid'],
    hasLaterality: true
  },
  'Reverse Shoulder Arthroplasty': {
    icd10Code: 'M75.10',
    cptCodes: ['23473 - Reverse total shoulder arthroplasty'],
    estimatedDuration: '2.5 hours',
    anesthesiaType: 'General with nerve block',
    specialEquipment: ['Reverse shoulder system', 'Beach chair positioning'],
    implants: ['Humeral stem', 'Humeral tray', 'Polyethylene insert', 'Glenosphere', 'Baseplate'],
    hasLaterality: true
  },
  'Spinal Fusion - Cervical': {
    icd10Code: 'M50.12',
    cptCodes: ['22551 - ACDF', '22845 - Anterior instrumentation'],
    estimatedDuration: '3 hours',
    anesthesiaType: 'General',
    specialEquipment: ['Cervical plating system', 'C-arm fluoroscopy', 'Neuromonitoring', 'Microscope'],
    implants: ['Cervical plate', 'Cervical screws', 'Interbody cage', 'Bone graft/substitute'],
    hasLaterality: false
  },
  'Spinal Fusion - Lumbar': {
    icd10Code: 'M51.16',
    cptCodes: ['22612 - Posterior lumbar fusion', '22630 - PLIF'],
    estimatedDuration: '4 hours',
    anesthesiaType: 'General',
    specialEquipment: ['Pedicle screw system', 'C-arm fluoroscopy', 'Neuromonitoring', 'Cell saver'],
    implants: ['Pedicle screws', 'Rods', 'Interbody cage', 'Bone graft/substitute', 'Cross-links'],
    hasLaterality: false
  },
  'Laminectomy': {
    icd10Code: 'M48.06',
    cptCodes: ['63047 - Laminectomy with decompression'],
    estimatedDuration: '2 hours',
    anesthesiaType: 'General',
    specialEquipment: ['C-arm fluoroscopy', 'Neuromonitoring', 'Microscope'],
    implants: [],
    hasLaterality: false
  },
  'Discectomy': {
    icd10Code: 'M51.16',
    cptCodes: ['63030 - Lumbar discectomy'],
    estimatedDuration: '1.5 hours',
    anesthesiaType: 'General',
    specialEquipment: ['C-arm fluoroscopy', 'Microscope'],
    implants: [],
    hasLaterality: false
  },
  'Carpal Tunnel Release': {
    icd10Code: 'G56.00',
    cptCodes: ['64721 - Carpal tunnel release'],
    estimatedDuration: '30 minutes',
    anesthesiaType: 'Local with sedation',
    specialEquipment: ['Hand table', 'Loupe magnification'],
    implants: [],
    hasLaterality: true
  },
  'Trigger Finger Release': {
    icd10Code: 'M65.30',
    cptCodes: ['26055 - Trigger finger release'],
    estimatedDuration: '20 minutes',
    anesthesiaType: 'Local',
    specialEquipment: ['Hand table'],
    implants: [],
    hasLaterality: true
  },
  'Bunionectomy': {
    icd10Code: 'M20.10',
    cptCodes: ['28296 - Bunionectomy with osteotomy'],
    estimatedDuration: '1 hour',
    anesthesiaType: 'Ankle block or spinal',
    specialEquipment: ['Mini C-arm', 'Bunion fixation system'],
    implants: ['Bone screws', 'Locking plate'],
    hasLaterality: true
  },
  'Ankle Fusion': {
    icd10Code: 'M19.071',
    cptCodes: ['27870 - Ankle arthrodesis'],
    estimatedDuration: '2.5 hours',
    anesthesiaType: 'General or spinal',
    specialEquipment: ['C-arm fluoroscopy', 'Ankle fusion plating system'],
    implants: ['Fusion plate', 'Bone screws', 'Bone graft/substitute'],
    hasLaterality: true
  },
  'Achilles Tendon Repair': {
    icd10Code: 'S86.011A',
    cptCodes: ['27650 - Achilles tendon repair'],
    estimatedDuration: '1.5 hours',
    anesthesiaType: 'General or spinal',
    specialEquipment: ['Prone positioning', 'Suture anchor system'],
    implants: ['Suture anchors', 'Tendon repair sutures'],
    hasLaterality: true
  },
  'Meniscectomy': {
    icd10Code: 'S83.211A',
    cptCodes: ['29881 - Arthroscopic meniscectomy'],
    estimatedDuration: '45 minutes',
    anesthesiaType: 'General or spinal',
    specialEquipment: ['Arthroscopy tower', 'Tourniquet'],
    implants: [],
    hasLaterality: true
  },
  'Hip Arthroscopy': {
    icd10Code: 'M25.551',
    cptCodes: ['29861 - Hip arthroscopy with labral repair'],
    estimatedDuration: '2 hours',
    anesthesiaType: 'General',
    specialEquipment: ['Hip arthroscopy tower', 'Traction table', 'C-arm fluoroscopy'],
    implants: ['Suture anchors', 'Knotless anchors'],
    hasLaterality: true
  },
  'Knee Arthroscopy': {
    icd10Code: 'M23.91',
    cptCodes: ['29880 - Knee arthroscopy with meniscectomy'],
    estimatedDuration: '1 hour',
    anesthesiaType: 'General or spinal',
    specialEquipment: ['Arthroscopy tower', 'Tourniquet'],
    implants: [],
    hasLaterality: true
  },
  'Shoulder Arthroscopy': {
    icd10Code: 'M75.40',
    cptCodes: ['29823 - Shoulder arthroscopy with debridement'],
    estimatedDuration: '1.5 hours',
    anesthesiaType: 'General with nerve block',
    specialEquipment: ['Arthroscopy tower', 'Beach chair or lateral positioning'],
    implants: ['Suture anchors'],
    hasLaterality: true
  },
};

export function PostingFormModal({ isOpen, onClose, patientName, onSubmit }: PostingFormModalProps) {
  const [formData, setFormData] = useState<PostingFormData>({
    procedure: '',
    icd10Code: '',
    surgeryCenter: '',
    surgeryDate: '',
    surgeryTime: '',
    cptCodes: [],
    laterality: '',
    estimatedDuration: '',
    anesthesiaType: '',
    specialEquipment: [],
    implants: []
  });
  const [availableImplants, setAvailableImplants] = useState<string[]>([]);
  const [implantSearch, setImplantSearch] = useState('');
  const [implantDropdownOpen, setImplantDropdownOpen] = useState(false);
  const implantDropdownRef = useRef<HTMLDivElement>(null);

  const [showLaterality, setShowLaterality] = useState(false);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (implantDropdownRef.current && !implantDropdownRef.current.contains(event.target as Node)) {
        setImplantDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProcedureChange = (procedure: string) => {
    const defaults = procedureDefaults[procedure];
    if (defaults) {
      setFormData({
        ...formData,
        procedure,
        icd10Code: defaults.icd10Code,
        cptCodes: defaults.cptCodes,
        estimatedDuration: defaults.estimatedDuration,
        anesthesiaType: defaults.anesthesiaType,
        specialEquipment: defaults.specialEquipment,
        implants: [...defaults.implants],
        laterality: defaults.hasLaterality ? '' : 'N/A'
      });
      setAvailableImplants(defaults.implants);
      setShowLaterality(defaults.hasLaterality);
    } else {
      setFormData({
        ...formData,
        procedure,
        icd10Code: '',
        cptCodes: [],
        estimatedDuration: '',
        anesthesiaType: '',
        specialEquipment: [],
        implants: [],
        laterality: ''
      });
      setAvailableImplants([]);
      setShowLaterality(false);
    }
    setImplantSearch('');
  };

  const handleImplantToggle = (implant: string) => {
    setFormData(prev => ({
      ...prev,
      implants: prev.implants.includes(implant)
        ? prev.implants.filter(i => i !== implant)
        : [...prev.implants, implant]
    }));
  };

  const handleRemoveImplant = (implant: string) => {
    setFormData(prev => ({
      ...prev,
      implants: prev.implants.filter(i => i !== implant)
    }));
  };

  const filteredImplants = availableImplants.filter(implant =>
    implant.toLowerCase().includes(implantSearch.toLowerCase())
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.procedure) {
      alert('Please select a procedure');
      return;
    }
    if (!formData.surgeryCenter) {
      alert('Please select a surgery center');
      return;
    }
    if (!formData.surgeryDate) {
      alert('Please select a surgery date');
      return;
    }
    if (!formData.surgeryTime) {
      alert('Please select a surgery time');
      return;
    }
    if (showLaterality && !formData.laterality) {
      alert('Please select laterality');
      return;
    }
    onSubmit(formData);
    setFormData({
      procedure: '',
      icd10Code: '',
      surgeryCenter: '',
      surgeryDate: '',
      surgeryTime: '',
      cptCodes: [],
      laterality: '',
      estimatedDuration: '',
      anesthesiaType: '',
      specialEquipment: [],
      implants: []
    });
    setAvailableImplants([]);
    setImplantSearch('');
    setImplantDropdownOpen(false);
  };

  const handleClose = () => {
    setFormData({
      procedure: '',
      icd10Code: '',
      surgeryCenter: '',
      surgeryDate: '',
      surgeryTime: '',
      cptCodes: [],
      laterality: '',
      estimatedDuration: '',
      anesthesiaType: '',
      specialEquipment: [],
      implants: []
    });
    setAvailableImplants([]);
    setImplantSearch('');
    setImplantDropdownOpen(false);
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
              <h2 className="text-gray-900">Surgery Posting Form</h2>
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

          {/* Laterality - only show if procedure requires it */}
          {showLaterality && (
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Laterality *</label>
              <div className="flex gap-4">
                {['Left', 'Right', 'Bilateral'].map(side => (
                  <label key={side} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="laterality"
                      value={side}
                      checked={formData.laterality === side}
                      onChange={(e) => setFormData({ ...formData, laterality: e.target.value as 'Left' | 'Right' | 'Bilateral' })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{side}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ICD-10 Code */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">ICD-10 Code</label>
            <input
              type="text"
              value={formData.icd10Code}
              onChange={(e) => setFormData({ ...formData, icd10Code: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="ICD-10 Code"
            />
          </div>

          {/* CPT Codes */}
          {formData.cptCodes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">CPT Codes</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <ul className="text-sm text-gray-700 space-y-1">
                  {formData.cptCodes.map((code, idx) => (
                    <li key={idx}>• {code}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Surgery Center */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Surgery Center *</label>
            <div className="flex gap-4 flex-wrap">
              {['Holy Cross Hospital', 'MASC', 'Sentara'].map(center => (
                <label key={center} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="surgeryCenter"
                    value={center}
                    checked={formData.surgeryCenter === center}
                    onChange={(e) => setFormData({ ...formData, surgeryCenter: e.target.value as 'Holy Cross Hospital' | 'MASC' | 'Sentara' })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{center}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Surgery Date *</label>
              <input
                type="date"
                value={formData.surgeryDate}
                onChange={(e) => setFormData({ ...formData, surgeryDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Surgery Time *</label>
              <input
                type="time"
                value={formData.surgeryTime}
                onChange={(e) => setFormData({ ...formData, surgeryTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Estimated Duration and Anesthesia */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Estimated Duration</label>
              <input
                type="text"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="e.g., 2 hours"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Anesthesia Type</label>
              <input
                type="text"
                value={formData.anesthesiaType}
                onChange={(e) => setFormData({ ...formData, anesthesiaType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="e.g., General"
              />
            </div>
          </div>

          {/* Implants - Searchable Multi-select Dropdown */}
          {availableImplants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Implants</label>

              {/* Selected implants as tags */}
              {formData.implants.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.implants.map((implant) => (
                    <span
                      key={implant}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                    >
                      {implant}
                      <button
                        type="button"
                        onClick={() => handleRemoveImplant(implant)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Dropdown */}
              <div className="relative" ref={implantDropdownRef}>
                <div
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                  onClick={() => setImplantDropdownOpen(!implantDropdownOpen)}
                >
                  <input
                    type="text"
                    value={implantSearch}
                    onChange={(e) => {
                      setImplantSearch(e.target.value);
                      setImplantDropdownOpen(true);
                    }}
                    onFocus={() => setImplantDropdownOpen(true)}
                    placeholder="Search implants..."
                    className="flex-1 outline-none bg-transparent text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${implantDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {implantDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredImplants.length > 0 ? (
                      filteredImplants.map((implant) => {
                        const isSelected = formData.implants.includes(implant);
                        return (
                          <div
                            key={implant}
                            className={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                            onClick={() => handleImplantToggle(implant)}
                          >
                            <span className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                              {implant}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">No implants found</div>
                    )}
                  </div>
                )}
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
            Send Posting Form
          </button>
        </div>
      </div>
    </div>
  );
}
