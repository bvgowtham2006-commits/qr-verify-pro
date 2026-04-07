import React, { useState, useEffect } from 'react'
import QRDisplay from './components/QRDisplay'
import SubmissionForm from './components/SubmissionForm'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'

function App() {
  const [view, setView] = useState('qr') // 'qr', 'form', 'success', 'admin'
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    // Basic routing based on URL parameters
    const params = new URLSearchParams(window.location.search)
    const viewParam = params.get('view')
    if (viewParam) setView(viewParam)
    
    if (viewParam === 'admin') fetchSubmissions()
  }, [])


  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setSubmissions(data)
  }

  const renderView = () => {
    switch (view) {
      case 'form':
        return <SubmissionForm onSuccess={() => setView('success')} />
      case 'success':
        return (
          <div className="card success-container">
            <div className="success-icon">✓</div>
            <h1>Details Received!</h1>
            <p>Your information has been securely stored.</p>
          </div>
        )
      case 'admin':
        return (
          <div className="admin-container">
            <div className="card table-card">
              <h1>Submissions Portal</h1>
              <p>Real-time list of all collected leads and signatures.</p>
              
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Submitted On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length > 0 ? (
                      submissions.map((s, i) => (
                        <tr key={i}>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.email}</td>
                          <td><code>{s.mobile}</code></td>
                          <td className="date-cell">
                            {new Date(s.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No submissions found yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <button className="back-btn" onClick={() => setView('qr')}>Back to Dashboard</button>
            </div>
          </div>
        )
      default:
        return <QRDisplay />
    }
  }

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
