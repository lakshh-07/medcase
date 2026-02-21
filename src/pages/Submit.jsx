import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../lib/supabase'
import Sidebar from '../components/Sidebar'

const AUTHORITY_CODE = 'MEDCASE2026'

export default function Submit() {
  const navigate = useNavigate()
  const [authorized, setAuthorized] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    disease: '', disease_spec: '', hospital_name: '', age: '',
    gender: '', severity: '', treatment: '', treatment_start_date: '',
    treatment_end_date: '', total_cost_inr: '', outcome: '',
    side_effects: '', report_available: false
  })

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleCodeSubmit = (e) => {
    e.preventDefault()
    if (code === AUTHORITY_CODE) {
      setAuthorized(true)
      setCodeError('')
    } else {
      setCodeError('Invalid authority code. Access denied.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      ...form,
      age: form.age ? parseInt(form.age) : null,
      total_cost_inr: form.total_cost_inr ? parseInt(form.total_cost_inr) : null,
      treatment_start_date: form.treatment_start_date || null,
      treatment_end_date: form.treatment_end_date || null,
    }
    const { error } = await supabase.from('cases').insert([payload])
    setLoading(false)
    if (!error) setSuccess(true)
    else alert('Error submitting case: ' + error.message)
  }

  const Field = ({ label, required, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  )

  const inputClass = "w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent transition-colors"
  const selectClass = "w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-accent bg-white transition-colors"

  // ── ACCESS GATE ──
  if (!authorized) {
    return (
      <div className="flex min-h-screen bg-[#f4f6fb]">
        <Sidebar />
        <main className="ml-[230px] flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
            <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
              🔒
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Restricted Access</h2>
            <p className="text-sm text-gray-400 mb-6">
              This page is only accessible to authorized medical institutions and hospitals. Enter your authority code to continue.
            </p>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Enter authority code"
                value={code}
                onChange={e => setCode(e.target.value)}
                className={inputClass + ' text-center tracking-widest'}
              />
              {codeError && <p className="text-xs text-rose-500">{codeError}</p>}
              <button
                type="submit"
                className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent2 transition-all"
              >
                Verify Access
              </button>
            </form>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600"
            >
              ← Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ── SUCCESS ──
  if (success) {
    return (
      <div className="flex min-h-screen bg-[#f4f6fb]">
        <Sidebar />
        <main className="ml-[230px] flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
              ✅
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Case Submitted!</h2>
            <p className="text-sm text-gray-400 mb-6">The case has been anonymously added to the database and is now accessible to the public.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setSuccess(false); setForm({ disease: '', disease_spec: '', hospital_name: '', age: '', gender: '', severity: '', treatment: '', treatment_start_date: '', treatment_end_date: '', total_cost_inr: '', outcome: '', side_effects: '', report_available: false }) }}
                className="flex-1 border border-accent text-accent font-semibold py-3 rounded-xl hover:bg-accent-light transition-all"
              >
                Submit Another
              </button>
              <button
                onClick={() => navigate('/results')}
                className="flex-1 bg-accent text-white font-semibold py-3 rounded-xl hover:bg-accent2 transition-all"
              >
                View Cases
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── FORM ──
  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <main className="ml-[230px] flex-1 p-8">
        <div className="mb-8">
          <p className="text-xs text-gray-400 mb-1">Pages / Submit Case</p>
          <h1 className="text-2xl font-bold text-gray-900">Submit Patient Case</h1>
          <p className="text-sm text-gray-400 mt-1">All identifying information is automatically stripped. Only clinical data is stored.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-5">

            {/* Disease Info */}
            <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-accent-light text-accent rounded-lg flex items-center justify-center text-xs font-bold">1</span>
                Disease Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Disease" required>
                  <input required value={form.disease} onChange={e => update('disease', e.target.value)} placeholder="e.g. Type 2 Diabetes" className={inputClass} />
                </Field>
                <Field label="Specification">
                  <input value={form.disease_spec} onChange={e => update('disease_spec', e.target.value)} placeholder="e.g. HbA1c 8.4%" className={inputClass} />
                </Field>
                <Field label="Severity">
                  <select value={form.severity} onChange={e => update('severity', e.target.value)} className={selectClass}>
                    <option value="">Select severity</option>
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Patient Info */}
            <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-accent-light text-accent rounded-lg flex items-center justify-center text-xs font-bold">2</span>
                Anonymous Patient Info
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Age">
                  <input type="number" value={form.age} onChange={e => update('age', e.target.value)} placeholder="e.g. 45" className={inputClass} />
                </Field>
                <Field label="Gender">
                  <select value={form.gender} onChange={e => update('gender', e.target.value)} className={selectClass}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Hospital Name" required>
                  <input required value={form.hospital_name} onChange={e => update('hospital_name', e.target.value)} placeholder="e.g. Apollo Hospital" className={inputClass} />
                </Field>
              </div>
            </div>

            {/* Treatment Info */}
            <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-accent-light text-accent rounded-lg flex items-center justify-center text-xs font-bold">3</span>
                Treatment Details
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Treatment">
                  <input value={form.treatment} onChange={e => update('treatment', e.target.value)} placeholder="e.g. Metformin + Diet Plan" className={inputClass} />
                </Field>
                <Field label="Start Date">
                  <input type="date" value={form.treatment_start_date} onChange={e => update('treatment_start_date', e.target.value)} className={inputClass} />
                </Field>
                <Field label="End Date">
                  <input type="date" value={form.treatment_end_date} onChange={e => update('treatment_end_date', e.target.value)} className={inputClass} />
                </Field>
                <Field label="Total Cost (INR)">
                  <input type="number" value={form.total_cost_inr} onChange={e => update('total_cost_inr', e.target.value)} placeholder="e.g. 45000" className={inputClass} />
                </Field>
                <Field label="Outcome">
                  <select value={form.outcome} onChange={e => update('outcome', e.target.value)} className={selectClass}>
                    <option value="">Select outcome</option>
                    <option>Recovered</option>
                    <option>Improved</option>
                    <option>Stable</option>
                    <option>Deteriorating</option>
                  </select>
                </Field>
                <Field label="Side Effects">
                  <input value={form.side_effects} onChange={e => update('side_effects', e.target.value)} placeholder="e.g. Nausea, fatigue" className={inputClass} />
                </Field>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="report"
                  checked={form.report_available}
                  onChange={e => update('report_available', e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <label htmlFor="report" className="text-sm text-gray-600">Report / documentation available</label>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => navigate('/')} className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent2 transition-all disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Case →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}