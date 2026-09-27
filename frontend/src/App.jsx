import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [incidents, setIncidents] = useState([])

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${API_URL}/incidents/`)
      // Sort so newest incidents are at the top
      setIncidents(response.data.reverse())
    } catch (error) {
      console.error("Error fetching incidents", error)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  const approveIncident = async (id) => {
    try {
      await axios.post(`${API_URL}/incidents/${id}/approve`)
      fetchIncidents() // Refresh the list after approving
    } catch (error) {
      console.error("Error approving", error)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #ccc', paddingBottom: '1rem' }}>
        Tattva Dashboard
      </h1>
      
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: '2rem' }}>
        {incidents.length === 0 ? <p>No incidents found.</p> : null}
        
        {incidents.map(inc => (
          <div key={inc.id} style={{ border: '1px solid #444', padding: '1.5rem', borderRadius: '8px', background: '#1a1a1a', color: 'white' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>{inc.id} | {inc.resource_id}</h3>
            <p><strong>Problem:</strong> {inc.problem_description}</p>
            <p><strong>AI Diagnosis:</strong> {inc.ai_diagnosis}</p>
            <p><strong>Status:</strong> <span style={{ color: inc.status === 'VERIFIED' ? '#4ade80' : '#facc15' }}>{inc.status}</span></p>
            <p><strong>Risk Level:</strong> {inc.risk_level}</p>
            
            {inc.status === 'PENDING_APPROVAL' && (
              <button
                onClick={() => approveIncident(inc.id)}
                style={{ background: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold' }}
              >
                Approve Remediation Action
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
