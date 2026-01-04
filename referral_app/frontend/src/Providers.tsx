import { useEffect, useState } from 'react'

interface Address {
  street_address_1: string
  street_address_2: string | null
  city: string
  state: string
  zip_code: string
  country: string
}

interface ProviderInstitution {
  id: string
  name: string
  website: string | null
  address: Address | null
}

interface Provider {
  id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string
  address: Address | null
  institution: ProviderInstitution | null
  created_at: string
  updated_at: string
}

function Providers() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('http://localhost:8000/providers')
        if (!response.ok) {
          throw new Error('Failed to fetch providers')
        }
        const data = await response.json()
        setProviders(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  if (loading) {
    return (
      <div className="providers-container">
        <h1>Providers</h1>
        <p>Loading providers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="providers-container">
        <h1>Providers</h1>
        <p className="error">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="providers-container">
      <h1>Healthcare Providers</h1>
      <p className="subtitle">Browse our network of healthcare professionals</p>

      <div className="providers-grid">
        {providers.map((provider) => (
          <div key={provider.id} className="provider-card">
            <div className="provider-header">
              <h2>{provider.full_name}</h2>
              {provider.institution && (
                <div className="institution-badge">{provider.institution.name}</div>
              )}
            </div>

            <div className="provider-details">
              <div className="detail-row">
                <strong>Email:</strong>
                <a href={`mailto:${provider.email}`}>{provider.email}</a>
              </div>

              {provider.phone && (
                <div className="detail-row">
                  <strong>Phone:</strong>
                  <a href={`tel:${provider.phone}`}>{provider.phone}</a>
                </div>
              )}

              {provider.institution?.website && (
                <div className="detail-row">
                  <strong>Institution Website:</strong>
                  <a href={provider.institution.website} target="_blank" rel="noopener noreferrer">
                    {provider.institution.website}
                  </a>
                </div>
              )}

              {provider.address && (
                <div className="detail-row address">
                  <strong>Provider Address:</strong>
                  <div>
                    <div>{provider.address.street_address_1}</div>
                    {provider.address.street_address_2 && (
                      <div>{provider.address.street_address_2}</div>
                    )}
                    <div>
                      {provider.address.city}, {provider.address.state} {provider.address.zip_code}
                    </div>
                  </div>
                </div>
              )}

              {provider.institution?.address && (
                <div className="detail-row address">
                  <strong>Institution Address:</strong>
                  <div>
                    <div>{provider.institution.address.street_address_1}</div>
                    {provider.institution.address.street_address_2 && (
                      <div>{provider.institution.address.street_address_2}</div>
                    )}
                    <div>
                      {provider.institution.address.city}, {provider.institution.address.state} {provider.institution.address.zip_code}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <p className="no-providers">No providers found.</p>
      )}
    </div>
  )
}

export default Providers
