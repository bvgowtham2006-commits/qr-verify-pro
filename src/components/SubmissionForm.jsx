import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SubmissionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      // 1. Check if Supabase is properly configured
      if (supabase.supabaseUrl.includes('your-project') || supabase.supabaseKey.includes('your-anon-key')) {
        throw new Error('CONFIG_ERROR');
      }

      // 2. Check if mobile number already exists in Supabase
      const { data: existingData, error: checkError } = await supabase
        .from('submissions')
        .select('mobile')
        .eq('mobile', formData.mobile)
        .single();

      // Note: single() returns an error if no row is found, which is expected for a new number
      if (existingData) {
        setStatus('error');
        setErrorMsg('Already exists: This mobile number is already registered.');
        return;
      }

      // 3. Insert new submission
      const { error: insertError } = await supabase
        .from('submissions')
        .insert([formData]);

      if (insertError) throw insertError;

      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err) {
      console.error('Submission Error:', err);
      setStatus('error');
      
      if (err.message === 'CONFIG_ERROR') {
        setErrorMsg('Configuration Error: Please update your .env file with real Supabase credentials.');
      } else if (err.code === 'PGRST301' || err.message?.includes('JWT')) {
        setErrorMsg('Authentication Error: Invalid Supabase Key.');
      } else if (err.message?.includes('failed to fetch')) {
        setErrorMsg('Network Error: Could not connect to Supabase. Check your URL.');
      } else {
        setErrorMsg('Something went wrong. Check if your table "submissions" exists and RLS is disabled.');
      }
    }
  }

  if (status === 'success') {
    return (
      <motion.div 
        className="card success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="success-icon">
          <Check size={32} />
        </div>
        <h1>Successfully Shared!</h1>
        <p>Thank you, {formData.name.split(' ')[0]}. Your details are securely stored.</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1>Join Now</h1>
      <p>Quickly fill in your details below. We'll ensure your privacy.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            placeholder="+1234567890"
            required
            autoComplete="tel"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>

        {status === 'error' && (
          <motion.div 
            className="error-msg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AlertCircle size={16} /> <span>{errorMsg}</span>
          </motion.div>
        )}

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? (
            <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
          ) : (
            'Share Details'
          )}
        </button>
      </form>
    </motion.div>
  )
}

export default SubmissionForm
