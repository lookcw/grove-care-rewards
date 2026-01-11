import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import EditProvider from './EditProvider'

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface NetworkItem {
  id: string
  target_type: 'provider' | 'provider_institution'
  // Provider fields
  provider_id?: string
  first_name?: string
  last_name?: string
  full_name?: string
  email?: string
  phone?: string
  global_provider?: boolean
  created_by_user_id?: string
  // Institution fields
  provider_institution_id?: string
  name?: string
  website?: string
  // Common
  address?: {
    street_address_1: string
    street_address_2: string | null
    city: string
    state: string
    zip_code: string
    country: string
  }
  institution?: {
    id: string
    name: string
    website: string | null
  }
  datetime_added: string
}

export default function MyNetwork() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [networkItems, setNetworkItems] = useState<NetworkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingProvider, setEditingProvider] = useState<NetworkItem | null>(null)

  // Fetch user's network
  useEffect(() => {
    fetchNetwork()
  }, [])

  const fetchNetwork = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/network`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch network')
      }

      const data = await response.json()
      setNetworkItems(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (entryId: string) => {
    if (!confirm('Remove from your network?')) return

    setDeletingId(entryId)
    try {
      const response = await fetch(`${API_URL}/network/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to remove from network')
      }

      // Remove from UI immediately
      setNetworkItems(prev => prev.filter(item => item.id !== entryId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '900px', margin: '50px auto' }}>
        <h1>My Provider Network</h1>
        <p>Loading your network...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '50px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1>My Provider Network</h1>
          <p className="subtitle">Manage your preferred providers and institutions</p>
        </div>
        <button
          onClick={() => navigate('/network/browse')}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          + Add to Network
        </button>
      </div>

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

      {networkItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '15px' }}>Your network is empty</h3>
          <p style={{ color: '#6c757d', marginBottom: '25px' }}>
            Add providers and institutions to create referrals
          </p>
          <button
            onClick={() => navigate('/network/browse')}
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
            Browse Providers
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {networkItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                position: 'relative'
              }}
            >
              {/* Provider Card */}
              {item.target_type === 'provider' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>
                          {item.full_name}
                        </h3>
                        {item.global_provider === false && (
                          <span style={{
                            padding: '4px 8px',
                            background: '#ffc107',
                            color: '#000',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            Custom
                          </span>
                        )}
                      </div>
                      {item.institution && (
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: '#e7f3ff',
                          color: '#0056b3',
                          borderRadius: '12px',
                          fontSize: '14px',
                          marginBottom: '15px'
                        }}>
                          {item.institution.name}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => setEditingProvider(item)}
                        style={{
                          padding: '8px 16px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={deletingId === item.id}
                        style={{
                          padding: '8px 16px',
                          background: deletingId === item.id ? '#ccc' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: deletingId === item.id ? 'not-allowed' : 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        {deletingId === item.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '8px', color: '#666', fontSize: '15px' }}>
                    {item.email && (
                      <div>
                        <strong>Email:</strong> <a href={`mailto:${item.email}`}>{item.email}</a>
                      </div>
                    )}
                    {item.phone && (
                      <div>
                        <strong>Phone:</strong> <a href={`tel:${item.phone}`}>{item.phone}</a>
                      </div>
                    )}
                    {item.address && (
                      <div>
                        <strong>Address:</strong> {item.address.street_address_1}, {item.address.city}, {item.address.state} {item.address.zip_code}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#999' }}>
                    Added: {new Date(item.datetime_added).toLocaleDateString()}
                  </div>
                </>
              )}

              {/* Institution Card */}
              {item.target_type === 'provider_institution' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>
                        {item.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={deletingId === item.id}
                      style={{
                        padding: '8px 16px',
                        background: deletingId === item.id ? '#ccc' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: deletingId === item.id ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {deletingId === item.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: '8px', color: '#666', fontSize: '15px' }}>
                    {item.website && (
                      <div>
                        <strong>Website:</strong> <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a>
                      </div>
                    )}
                    {item.address && (
                      <div>
                        <strong>Address:</strong> {item.address.street_address_1}, {item.address.city}, {item.address.state} {item.address.zip_code}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#999' }}>
                    Added: {new Date(item.datetime_added).toLocaleDateString()}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Provider Modal */}
      {editingProvider && (
        <EditProvider
          provider={editingProvider}
          onSave={() => {
            setEditingProvider(null)
            fetchNetwork() // Refresh network
          }}
          onCancel={() => setEditingProvider(null)}
        />
      )}
    </div>
  )
}
