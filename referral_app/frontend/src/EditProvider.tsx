import { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || '/api'

interface Address {
  street_address_1: string
  street_address_2: string | null
  city: string
  state: string
  zip_code: string
  country: string
}

interface Institution {
  id: string
  name: string
  website: string | null
}

interface NetworkItem {
  id: string
  provider_id?: string
  first_name?: string
  last_name?: string
  full_name?: string
  email?: string
  phone?: string
  address?: Address
  institution?: Institution
  global_provider?: boolean
  created_by_user_id?: string
}

interface EditProviderProps {
  provider: NetworkItem
  onSave: () => void
  onCancel: () => void
}

export default function EditProvider({ provider, onSave, onCancel }: EditProviderProps) {
  const { token } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [showAddress, setShowAddress] = useState(!!provider.address)

  const [formData, setFormData] = useState({
    first_name: provider.first_name || '',
    last_name: provider.last_name || '',
    email: provider.email || '',
    phone: provider.phone || '',
    institution_id: provider.institution?.id || '',
    address: {
      street_address_1: provider.address?.street_address_1 || '',
      street_address_2: provider.address?.street_address_2 || '',
      city: provider.address?.city || '',
      state: provider.address?.state || '',
      zip_code: provider.address?.zip_code || '',
      country: provider.address?.country || 'USA'
    }
  })

  // Fetch institutions for dropdown
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(`${API_URL}/provider-institutions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setInstitutions(data)
        }
      } catch (err) {
        console.error('Failed to fetch institutions:', err)
      }
    }
    fetchInstitutions()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        institution_id: formData.institution_id || null
      }

      // Only include address if user wants to add/edit it
      if (showAddress) {
        payload.address = {
          street_address_1: formData.address.street_address_1,
          street_address_2: formData.address.street_address_2 || null,
          city: formData.address.city,
          state: formData.address.state,
          zip_code: formData.address.zip_code,
          country: formData.address.country
        }
      }

      const response = await fetch(`${API_URL}/providers/${provider.provider_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update provider')
      }

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update provider')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Edit Provider</h2>
          {provider.global_provider && (
            <span style={{
              padding: '4px 12px',
              background: '#ffc107',
              color: '#000',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Will create custom copy
            </span>
          )}
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            marginBottom: '20px',
            color: '#721c24'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Institution
              </label>
              <select
                value={formData.institution_id}
                onChange={(e) => setFormData({ ...formData, institution_id: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              >
                <option value="">None</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Address Section */}
            <div style={{
              borderTop: '1px solid #dee2e6',
              paddingTop: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Address</h3>
                <button
                  type="button"
                  onClick={() => setShowAddress(!showAddress)}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: '#007bff',
                    border: '1px solid #007bff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {showAddress ? 'Hide Address' : 'Show Address'}
                </button>
              </div>

              {showAddress && (
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Street Address 1
                    </label>
                    <input
                      type="text"
                      value={formData.address.street_address_1}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street_address_1: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      Street Address 2
                    </label>
                    <input
                      type="text"
                      value={formData.address.street_address_2 || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street_address_2: e.target.value }
                      })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })}
                        maxLength={2}
                        placeholder="CA"
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          fontSize: '14px',
                          textTransform: 'uppercase'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={formData.address.zip_code}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, zip_code: e.target.value }
                        })}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-end',
              borderTop: '1px solid #dee2e6',
              paddingTop: '20px',
              marginTop: '10px'
            }}>
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
