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
  created_by_user_id: string
  name: string
  type: string | null
  phone: string | null
  email: string | null
  website: string | null
  address_id: string | null
  address: Address | null
  datetime_created: string
  datetime_updated: string
}

export default function MyInstitution() {
  const { token } = useAuth()

  const [institution, setInstitution] = useState<Institution | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    phone: '',
    email: '',
    website: '',
    address: {
      street_address_1: '',
      street_address_2: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'USA'
    }
  })

  // Fetch institution on mount
  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(`${API_URL}/my-institution`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.status === 404) {
          // User hasn't created institution yet
          setInstitution(null)
          setEditing(true) // Show form immediately
        } else if (response.ok) {
          const data = await response.json()
          setInstitution(data)
          // Populate form with existing data
          setFormData({
            name: data.name || '',
            type: data.type || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            address: {
              street_address_1: data.address?.street_address_1 || '',
              street_address_2: data.address?.street_address_2 || '',
              city: data.address?.city || '',
              state: data.address?.state || '',
              zip_code: data.address?.zip_code || '',
              country: data.address?.country || 'USA'
            }
          })
        } else {
          const errorData = await response.json()
          setError(errorData.detail || 'Failed to load institution')
        }
      } catch (err) {
        setError('Failed to load institution')
      } finally {
        setLoading(false)
      }
    }

    fetchInstitution()
  }, [token])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const method = institution ? 'PUT' : 'POST'
      const payload: any = {
        name: formData.name,
        type: formData.type || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null
      }

      // Include address if any field is filled
      if (formData.address.street_address_1 || formData.address.city || formData.address.state || formData.address.zip_code) {
        payload.address = {
          street_address_1: formData.address.street_address_1,
          street_address_2: formData.address.street_address_2 || null,
          city: formData.address.city,
          state: formData.address.state,
          zip_code: formData.address.zip_code,
          country: formData.address.country
        }
      }

      const response = await fetch(`${API_URL}/my-institution`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to save institution')
      }

      const data = await response.json()
      setInstitution(data)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = () => {
    // Populate form with current institution data
    if (institution) {
      setFormData({
        name: institution.name || '',
        type: institution.type || '',
        phone: institution.phone || '',
        email: institution.email || '',
        website: institution.website || '',
        address: {
          street_address_1: institution.address?.street_address_1 || '',
          street_address_2: institution.address?.street_address_2 || '',
          city: institution.address?.city || '',
          state: institution.address?.state || '',
          zip_code: institution.address?.zip_code || '',
          country: institution.address?.country || 'USA'
        }
      })
    }
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setError(null)
  }

  if (loading) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>My Institution Profile</h1>
        <p>Loading...</p>
      </div>
    )
  }

  // Empty state (no institution yet)
  if (!institution && !editing) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <h1>My Institution Profile</h1>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            You haven't set up your institution profile yet.
          </p>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            This information represents your affiliated organization and is required to create referrals.
          </p>
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: '12px 24px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Create Institution Profile
          </button>
        </div>
      </div>
    )
  }

  // View mode (institution exists and not editing)
  if (institution && !editing) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1>My Institution Profile</h1>
          <button
            onClick={handleEdit}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Edit
          </button>
        </div>

        {success && (
          <div style={{
            padding: '12px',
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            marginBottom: '20px',
            color: '#155724'
          }}>
            Institution updated successfully!
          </div>
        )}

        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>
                Name
              </label>
              <p style={{ margin: 0, fontSize: '16px' }}>{institution.name}</p>
            </div>

            {institution.type && (
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>
                  Type
                </label>
                <p style={{ margin: 0, fontSize: '16px' }}>{institution.type}</p>
              </div>
            )}

            {institution.phone && (
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>
                  Phone
                </label>
                <p style={{ margin: 0, fontSize: '16px' }}>{institution.phone}</p>
              </div>
            )}

            {institution.email && (
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>
                  Email
                </label>
                <p style={{ margin: 0, fontSize: '16px' }}>{institution.email}</p>
              </div>
            )}

            {institution.website && (
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>
                  Website
                </label>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  <a href={institution.website} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                    {institution.website}
                  </a>
                </p>
              </div>
            )}

            {institution.address && (
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>
                  Address
                </label>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  {institution.address.street_address_1}
                  {institution.address.street_address_2 && <><br />{institution.address.street_address_2}</>}
                  <br />
                  {institution.address.city}, {institution.address.state} {institution.address.zip_code}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Edit/Create form
  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px'
    }}>
      <h1>{institution ? 'Edit' : 'Create'} Institution Profile</h1>

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

      {success && (
        <div style={{
          padding: '12px',
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          marginBottom: '20px',
          color: '#155724'
        }}>
          Institution saved successfully!
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Basic Information */}
            <h3 style={{ margin: 0, marginTop: '10px' }}>Basic Information</h3>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Institution Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                Type
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g., Hospital, Clinic, Private Practice"
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
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Address Section */}
            <div style={{
              borderTop: '1px solid #dee2e6',
              paddingTop: '20px'
            }}>
              <h3 style={{ margin: 0, marginBottom: '15px' }}>Address</h3>

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
                          address: { ...formData.address, state: e.target.value.toUpperCase() }
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
              {institution && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    padding: '10px 20px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  background: saving ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {saving ? 'Saving...' : institution ? 'Save Changes' : 'Create Institution'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
