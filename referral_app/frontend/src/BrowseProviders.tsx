import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface BrowseProvider {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string | null
  in_network: boolean
  institution?: {
    id: string
    name: string
    website: string | null
  }
  address?: {
    street_address_1: string
    city: string
    state: string
    zip_code: string
  }
}

interface BrowseInstitution {
  id: string
  name: string
  type: string | null
  website: string | null
  phone: string | null
  email: string | null
  in_network: boolean
  address?: {
    street_address_1: string
    city: string
    state: string
    zip_code: string
  }
}

type BrowseMode = 'providers' | 'institutions'

export default function BrowseProviders() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<BrowseMode>('providers')
  const [providers, setProviders] = useState<BrowseProvider[]>([])
  const [institutions, setInstitutions] = useState<BrowseInstitution[]>([])
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingId, setAddingId] = useState<string | null>(null)

  // Fetch data when mode changes
  useEffect(() => {
    fetchData()
  }, [mode])

  const fetchData = async () => {
    setLoading(true)
    try {
      const endpoint = mode === 'providers'
        ? `${API_URL}/browse/providers${searchText ? `?search=${encodeURIComponent(searchText)}` : ''}`
        : `${API_URL}/browse/provider-institutions${searchText ? `?search=${encodeURIComponent(searchText)}` : ''}`

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()

      if (mode === 'providers') {
        setProviders(data)
      } else {
        setInstitutions(data)
      }

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData()
  }

  const handleAdd = async (targetType: 'provider' | 'provider_institution', targetId: string) => {
    setAddingId(targetId)
    try {
      const response = await fetch(`${API_URL}/network`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          target_type: targetType,
          [targetType === 'provider' ? 'provider_id' : 'provider_institution_id']: targetId
        })
      })

      if (response.status === 409) {
        alert('Already in your network')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to add to network')
      }

      // Update UI to show "In Network"
      if (mode === 'providers') {
        setProviders(prev => prev.map(p =>
          p.id === targetId ? { ...p, in_network: true } : p
        ))
      } else {
        setInstitutions(prev => prev.map(i =>
          i.id === targetId ? { ...i, in_network: true } : i
        ))
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add to network')
    } finally {
      setAddingId(null)
    }
  }

  const renderProviders = () => {
    if (providers.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No providers found
        </div>
      )
    }

    return (
      <div style={{ display: 'grid', gap: '15px' }}>
        {providers.map((provider) => (
          <div
            key={provider.id}
            style={{
              background: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{provider.full_name}</h3>
              {provider.institution && (
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: '#e7f3ff',
                  color: '#0056b3',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginBottom: '10px'
                }}>
                  {provider.institution.name}
                </div>
              )}
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                <div><strong>Email:</strong> {provider.email}</div>
                {provider.phone && <div><strong>Phone:</strong> {provider.phone}</div>}
                {provider.address && (
                  <div>
                    <strong>Address:</strong> {provider.address.street_address_1}, {provider.address.city}, {provider.address.state}
                  </div>
                )}
              </div>
            </div>

            {provider.in_network ? (
              <div style={{
                padding: '8px 16px',
                background: '#d4edda',
                color: '#155724',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                In Network
              </div>
            ) : (
              <button
                onClick={() => handleAdd('provider', provider.id)}
                disabled={addingId === provider.id}
                style={{
                  padding: '8px 16px',
                  background: addingId === provider.id ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: addingId === provider.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                {addingId === provider.id ? 'Adding...' : '+ Add'}
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderInstitutions = () => {
    if (institutions.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No institutions found
        </div>
      )
    }

    return (
      <div style={{ display: 'grid', gap: '15px' }}>
        {institutions.map((institution) => (
          <div
            key={institution.id}
            style={{
              background: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start'
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{institution.name}</h3>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                {institution.website && (
                  <div>
                    <strong>Website:</strong>{' '}
                    <a href={institution.website} target="_blank" rel="noopener noreferrer">
                      {institution.website}
                    </a>
                  </div>
                )}
                {institution.phone && <div><strong>Phone:</strong> {institution.phone}</div>}
                {institution.address && (
                  <div>
                    <strong>Address:</strong> {institution.address.street_address_1}, {institution.address.city}, {institution.address.state}
                  </div>
                )}
              </div>
            </div>

            {institution.in_network ? (
              <div style={{
                padding: '8px 16px',
                background: '#d4edda',
                color: '#155724',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                In Network
              </div>
            ) : (
              <button
                onClick={() => handleAdd('provider_institution', institution.id)}
                disabled={addingId === institution.id}
                style={{
                  padding: '8px 16px',
                  background: addingId === institution.id ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: addingId === institution.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                {addingId === institution.id ? 'Adding...' : '+ Add'}
              </button>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '50px auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/network')}
          style={{
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Back to My Network
        </button>

        <h1>Browse Providers</h1>
        <p className="subtitle">Add providers and institutions to your network</p>
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid #dee2e6',
        paddingBottom: '10px'
      }}>
        <button
          onClick={() => setMode('providers')}
          style={{
            padding: '10px 20px',
            background: mode === 'providers' ? '#007bff' : 'transparent',
            color: mode === 'providers' ? 'white' : '#007bff',
            border: 'none',
            borderRadius: '5px 5px 0 0',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: mode === 'providers' ? 'bold' : 'normal'
          }}
        >
          Individual Providers
        </button>
        <button
          onClick={() => setMode('institutions')}
          style={{
            padding: '10px 20px',
            background: mode === 'institutions' ? '#007bff' : 'transparent',
            color: mode === 'institutions' ? 'white' : '#007bff',
            border: 'none',
            borderRadius: '5px 5px 0 0',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: mode === 'institutions' ? 'bold' : 'normal'
          }}
        >
          Institutions
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={mode === 'providers' ? 'Search by name or email...' : 'Search by institution name...'}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <button
            type="submit"
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
            Search
          </button>
        </div>
      </form>

      {error && (
        <div style={{
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Loading...
        </div>
      ) : (
        mode === 'providers' ? renderProviders() : renderInstitutions()
      )}
    </div>
  )
}
