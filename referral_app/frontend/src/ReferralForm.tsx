import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// TypeScript interfaces
interface PatientFormData {
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email: string
}

interface ReferralFormData {
  patient_id?: string
  referral_target_type: 'provider' | 'provider_institution'
  provider_id?: string
  provider_institution_id?: string
  notes: string
  appointment_timeframe?: string
}

interface ReferralTargetOption {
  id: string
  label: string
  type: 'provider' | 'provider_institution'
}

interface PatientOption {
  id: string
  label: string
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email: string
}

export default function ReferralForm() {
  const navigate = useNavigate()
  const { token, user } = useAuth()

  // Patient mode toggle
  const [patientMode, setPatientMode] = useState<'new' | 'existing'>('new')

  // Form data
  const [formData, setFormData] = useState<ReferralFormData>({
    referral_target_type: 'provider',
    notes: ''
  })

  const [patientFormData, setPatientFormData] = useState<PatientFormData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    email: ''
  })

  // Dropdown data
  const [referralTargets, setReferralTargets] = useState<ReferralTargetOption[]>([])
  const [patients, setPatients] = useState<PatientOption[]>([])

  // UI state
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [completedReferral, setCompletedReferral] = useState<{
    patientName: string
    referralTo: string
  } | null>(null)

  // Autocomplete state for referral target
  const [searchText, setSearchText] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedTargetLabel, setSelectedTargetLabel] = useState('')

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [providersRes, institutionsRes, patientsRes] = await Promise.all([
          fetch('http://localhost:8000/providers'),
          fetch('http://localhost:8000/provider-institutions'),
          fetch('http://localhost:8000/patients')
        ])

        if (!providersRes.ok || !institutionsRes.ok || !patientsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const providers = await providersRes.json()
        const institutions = await institutionsRes.json()
        const patients = await patientsRes.json()

        // Transform providers into dropdown options
        const providerOptions: ReferralTargetOption[] = providers.map((p: any) => ({
          id: p.id,
          label: `Dr. ${p.full_name}${p.institution ? ` (${p.institution.name})` : ''}`,
          type: 'provider' as const
        }))

        // Transform institutions into dropdown options
        const institutionOptions: ReferralTargetOption[] = institutions.map((i: any) => ({
          id: i.id,
          label: i.name,
          type: 'provider_institution' as const
        }))

        // Combine and sort alphabetically
        const allTargets = [...providerOptions, ...institutionOptions]
          .sort((a, b) => a.label.localeCompare(b.label))

        setReferralTargets(allTargets)

        // Transform patients into dropdown options
        const patientOptions: PatientOption[] = patients.map((p: any) => ({
          id: p.id,
          label: `${p.first_name} ${p.last_name} (DOB: ${p.date_of_birth})`,
          first_name: p.first_name,
          last_name: p.last_name,
          date_of_birth: p.date_of_birth,
          phone: p.phone || '',
          email: p.email || ''
        }))

        setPatients(patientOptions)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load form data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle patient mode toggle
  const handlePatientModeToggle = (mode: 'new' | 'existing') => {
    setPatientMode(mode)

    if (mode === 'new') {
      // Clear selected patient
      setFormData(prev => ({ ...prev, patient_id: undefined }))
    } else {
      // Clear new patient form data
      setPatientFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        phone: '',
        email: ''
      })
    }
  }

  // Handle patient field changes (new patient mode)
  const handlePatientFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPatientFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle existing patient selection
  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, patient_id: e.target.value }))
  }

  // Filter referral targets based on search text
  const filteredTargets = referralTargets.filter(target =>
    target.label.toLowerCase().includes(searchText.toLowerCase())
  )

  // Handle referral target search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setShowDropdown(true)

    // Clear selection if user is typing
    if (selectedTargetLabel) {
      setSelectedTargetLabel('')
      setFormData(prev => ({
        ...prev,
        provider_id: undefined,
        provider_institution_id: undefined
      }))
    }
  }

  // Handle selecting a target from the dropdown
  const handleSelectTarget = (target: ReferralTargetOption) => {
    setSearchText(target.label)
    setSelectedTargetLabel(target.label)
    setShowDropdown(false)

    if (target.type === 'provider') {
      setFormData(prev => ({
        ...prev,
        referral_target_type: 'provider',
        provider_id: target.id,
        provider_institution_id: undefined
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        referral_target_type: 'provider_institution',
        provider_institution_id: target.id,
        provider_id: undefined
      }))
    }
  }

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }))
  }

  // Handle appointment timeframe change
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, appointment_timeframe: e.target.value }))
  }

  // Generate appointment timeframe options
  const generateTimeframeOptions = () => {
    const options = []
    // First 14 days
    for (let i = 1; i <= 14; i++) {
      options.push({ value: `day_${i}`, label: `Day ${i}` })
    }
    // Weeks 3-8
    for (let i = 3; i <= 8; i++) {
      options.push({ value: `week_${i}`, label: `Week ${i}` })
    }
    return options
  }

  // Generate message text/email preview
  const generateMessagePreview = () => {
    // Get patient first name
    let patientFirstName = 'Patient'
    if (patientMode === 'new' && patientFormData.first_name) {
      patientFirstName = patientFormData.first_name
    } else if (patientMode === 'existing' && formData.patient_id) {
      const selectedPatient = patients.find(p => p.id === formData.patient_id)
      if (selectedPatient) {
        patientFirstName = selectedPatient.first_name
      }
    }

    // Get provider/institution name
    const providerName = selectedTargetLabel || '[Provider/Institution]'

    // Get logged in user's last name
    const userLastName = user?.last_name || 'Doctor'

    return `Hi ${patientFirstName}, this is Dr. ${userLastName}'s team. We're messaging you to schedule your appointment with ${providerName}. Text back to this with some available times and we'll get you started.`
  }

  // Determine if we should show email or text
  const getContactMethod = () => {
    if (patientMode === 'new') {
      return patientFormData.phone ? 'text' : patientFormData.email ? 'email' : 'text'
    } else if (formData.patient_id) {
      const selectedPatient = patients.find(p => p.id === formData.patient_id)
      return selectedPatient?.phone ? 'text' : selectedPatient?.email ? 'email' : 'text'
    }
    return 'text'
  }

  // Reset form for new referral
  const handleCreateAnother = () => {
    setSuccess(false)
    setCompletedReferral(null)
    setError(null)
    setPatientMode('new')
    setFormData({
      referral_target_type: 'provider',
      notes: '',
      appointment_timeframe: undefined
    })
    setPatientFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      phone: '',
      email: ''
    })
    setSearchText('')
    setSelectedTargetLabel('')
  }

  // Form validation
  const validateForm = (): string | null => {
    // Validate patient selection
    if (patientMode === 'new') {
      if (!patientFormData.first_name || !patientFormData.last_name) {
        return 'Patient first and last name are required'
      }
      if (!patientFormData.date_of_birth) {
        return 'Patient date of birth is required'
      }
    } else {
      if (!formData.patient_id) {
        return 'Please select an existing patient'
      }
    }

    // Validate referral target
    if (!formData.provider_id && !formData.provider_institution_id) {
      return 'Please select a referral target (provider or institution)'
    }

    return null
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Pre-validation
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Construct request body
      const requestBody: any = {
        referral_target_type: formData.referral_target_type,
        notes: formData.notes || undefined,
        appointment_timeframe: formData.appointment_timeframe || undefined
      }

      // Add patient data
      if (patientMode === 'new') {
        requestBody.patient_data = {
          first_name: patientFormData.first_name,
          last_name: patientFormData.last_name,
          date_of_birth: patientFormData.date_of_birth,
          phone: patientFormData.phone || undefined,
          email: patientFormData.email || undefined
        }
      } else {
        requestBody.patient_id = formData.patient_id
      }

      // Add referral target
      if (formData.referral_target_type === 'provider') {
        requestBody.provider_id = formData.provider_id
      } else {
        requestBody.provider_institution_id = formData.provider_institution_id
      }

      const response = await fetch('http://localhost:8000/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create referral')
      }

      // Store completed referral details
      const patientName = patientMode === 'new'
        ? `${patientFormData.first_name} ${patientFormData.last_name}`
        : patients.find(p => p.id === formData.patient_id)?.label.split(' (')[0] || 'Patient'

      setCompletedReferral({
        patientName,
        referralTo: searchText || selectedTargetLabel
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
        <h1>Create Referral</h1>
        <p>Loading form data...</p>
      </div>
    )
  }

  // Show success screen if referral was created
  if (success && completedReferral) {
    return (
      <div className="container" style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
        <div style={{
          padding: '40px',
          background: '#d4edda',
          border: '2px solid #c3e6cb',
          borderRadius: '12px',
          marginTop: '60px'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>
            ✓
          </div>
          <h1 style={{ color: '#155724', marginBottom: '10px' }}>Referral Complete!</h1>
          <p style={{ fontSize: '18px', color: '#155724', marginBottom: '30px' }}>
            Your referral has been successfully created.
          </p>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#666' }}>Patient:</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#333' }}>
                {completedReferral.patientName}
              </p>
            </div>
            <div>
              <strong style={{ color: '#666' }}>Referred To:</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#333' }}>
                {completedReferral.referralTo}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={handleCreateAnother}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#218838'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#28a745'}
            >
              Create Another Referral
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#5a6268'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#6c757d'}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1>Create Referral</h1>
      <p className="subtitle">Create a new patient referral</p>

      {error && (
        <div className="error-message" style={{
          padding: '15px',
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Patient Information Section */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginTop: 0,
            marginBottom: '15px',
            color: '#333',
            paddingBottom: '10px',
            borderBottom: '1px solid #dee2e6'
          }}>
            Patient Information
          </h3>

          {/* Patient Mode Toggle */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
              Patient Selection
            </label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  checked={patientMode === 'new'}
                  onChange={() => handlePatientModeToggle('new')}
                  style={{ cursor: 'pointer' }}
                />
                <span>New Patient</span>
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  checked={patientMode === 'existing'}
                  onChange={() => handlePatientModeToggle('existing')}
                  style={{ cursor: 'pointer' }}
                />
                <span>Existing Patient</span>
              </label>
            </div>
          </div>
        {/* Conditional Patient Fields */}
        {patientMode === 'new' ? (
          <>
            <div>
              <label htmlFor="first_name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={patientFormData.first_name}
                onChange={handlePatientFieldChange}
                required
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
            </div>

            <div>
              <label htmlFor="last_name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Last Name *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={patientFormData.last_name}
                onChange={handlePatientFieldChange}
                required
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
            </div>

            <div>
              <label htmlFor="date_of_birth" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={patientFormData.date_of_birth}
                onChange={handlePatientFieldChange}
                required
                max={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
            </div>

            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={patientFormData.phone}
                onChange={handlePatientFieldChange}
                placeholder="(555) 123-4567"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={patientFormData.email}
                onChange={handlePatientFieldChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="patient" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Select Patient *
            </label>
            <select
              id="patient"
              value={formData.patient_id || ''}
              onChange={handlePatientChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            >
              <option value="">-- Select a patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
        )}
        </div>
        {/* End Patient Information Section */}

        {/* Referral Target Autocomplete */}
        <div style={{ position: 'relative' }}>
          <label htmlFor="referral_target" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Referral To *
          </label>
          <input
            type="text"
            id="referral_target"
            value={searchText}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => {
              // Delay hiding dropdown to allow click on option
              setTimeout(() => setShowDropdown(false), 200)
            }}
            placeholder="Type to search provider or institution..."
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />

          {/* Dropdown list */}
          {showDropdown && filteredTargets.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              maxHeight: '300px',
              overflowY: 'auto',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginTop: '2px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}>
              {filteredTargets.map(target => (
                <div
                  key={target.id}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelectTarget(target)
                  }}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  {target.label}
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {showDropdown && searchText && filteredTargets.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginTop: '2px',
              padding: '10px',
              color: '#666',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}>
              No matches found
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleNotesChange}
            rows={4}
            placeholder="Enter referral notes (optional)"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Appointment Timeframe */}
        <div>
          <label htmlFor="appointment_timeframe" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Suggested Appointment Timeframe
          </label>
          <select
            id="appointment_timeframe"
            value={formData.appointment_timeframe || ''}
            onChange={handleTimeframeChange}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          >
            <option value="">-- Select timeframe --</option>
            {generateTimeframeOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message Preview */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '15px'
        }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            {getContactMethod() === 'email' ? 'Email' : 'Text'} Message Preview
          </label>
          <div style={{
            background: 'white',
            padding: '12px',
            borderRadius: '5px',
            border: '1px solid #dee2e6',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#495057',
            fontStyle: 'italic'
          }}>
            {generateMessagePreview()}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: submitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {submitting ? 'Creating Referral...' : 'Create Referral'}
        </button>
      </form>
    </div>
  )
}
