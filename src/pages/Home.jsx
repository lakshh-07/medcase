import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import RecoveryChart from '../components/RecoveryChart'
import HospitalCostChart from '../components/HospitalCostChart'
import OutcomePieChart from '../components/OutcomePieChart'

export default function Home() {
  const [allCases, setAllCases] = useState([])
  const [stats, setStats] = useState({ total: 0, recovered: 0, diseases: 0, hospitals: 0 })
  const [recent, setRecent] = useState([])
  const [selectedDisease, setSelectedDisease] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase.from('cases').select('*')
      setLoading(false)
      if (err) {
        setError(err.message || 'Failed to load cases. Check your Supabase URL and key in .env.')
        return
      }
      const list = data ?? []
      setAllCases(list)
      applyFilter(list, 'All')
    }
    fetchAll()
  }, [])

  const applyFilter = (data, disease) => {
    const filtered = disease === 'All' ? data : data.filter(c =>
      c.disease?.toLowerCase().includes(disease.toLowerCase())
    )
    const recovered = filtered.filter(c => c.outcome === 'Recovered' || c.outcome === 'Improved').length
    const uniqueDiseases = [...new Set(filtered.map(c => c.disease).filter(Boolean))].length
    const uniqueHospitals = [...new Set(filtered.map(c => c.hospital_name).filter(Boolean))].length
    setStats({ total: filtered.length, recovered, diseases: uniqueDiseases, hospitals: uniqueHospitals })
    setRecent(filtered.slice(-5).reverse())
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const val = search.trim() === '' ? 'All' : search.trim()
    setSelectedDisease(val)
    applyFilter(allCases, val)
  }

  const outcomeColor = {
    Recovered: 'text-green-500',
    Improved: 'text-blue-500',
    Stable: 'text-amber-500',
    Deteriorating: 'text-rose-500',
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <main className="ml-[230px] flex-1 p-8">

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading dashboard…</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 mb-8">
            <p className="font-semibold text-rose-800">Could not load data</p>
            <p className="text-sm text-rose-600 mt-1">{error}</p>
            <p className="text-xs text-rose-500 mt-2">Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a <code className="bg-rose-100 px-1 rounded">.env</code> file in the project root (see .env.example).</p>
          </div>
        )}

        {!loading && !error && (
        <>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-gray-400 mb-1">Pages / Dashboard</p>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          </div>
          <span className="text-xs text-gray-400 bg-white border border-gray-100 px-3 py-2 rounded-lg shadow-sm">
            📅 {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-accent to-accent2 p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">✦ Real anonymized patient data</p>
            <p className="text-white text-xl font-bold">Make informed decisions after your diagnosis.</p>
            <p className="text-white/70 text-sm mt-1">Browse real treatment journeys — no names, no IDs, just outcomes.</p>
          </div>
          <button
            onClick={() => window.location.href = '/results'}
            className="bg-white text-accent font-semibold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
          >
            Browse Cases →
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3 max-w-2xl">
            <input
              type="text"
              placeholder="Search by disease e.g. Diabetes, Asthma..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                if (e.target.value === '') {
                  setSelectedDisease('All')
                  applyFilter(allCases, 'All')
                }
              }}
              className="flex-1 bg-white border border-gray-100 rounded-xl px-5 py-3 text-sm shadow-sm focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="bg-accent text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent2 transition-all shadow-sm"
            >
              Search
            </button>
            {selectedDisease !== 'All' && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedDisease('All')
                  applyFilter(allCases, 'All')
                }}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-400 hover:text-gray-600 transition-all"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </form>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <StatCard
            title={selectedDisease === 'All' ? 'Total Cases' : `${selectedDisease} Cases`}
            value={stats.total.toLocaleString()}
            sub={selectedDisease === 'All' ? 'In the database' : 'Matching your search'}
            icon="🗂" color="indigo"
          />
          <StatCard title="Recovered" value={stats.recovered.toLocaleString()} sub="Reported full recovery" icon="✅" color="green" />
          <StatCard title="Diseases" value={stats.diseases} sub="Unique conditions" icon="🧬" color="amber" />
          <StatCard title="Hospitals" value={stats.hospitals} sub="Contributing institutions" icon="🏥" color="rose" />
        </div>

        {/* Chart + Recent */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            <RecoveryChart selectedDisease={selectedDisease} />
            <HospitalCostChart selectedDisease={selectedDisease} />
          </div>

          <div className="space-y-5">
            {/* Outcome Pie Chart - above cases */}
            <OutcomePieChart selectedDisease={selectedDisease} />
            {/* Recent Cases */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-1">Recent Cases</h3>
              <p className="text-xs text-gray-400 mb-4">
                {selectedDisease === 'All' ? 'All diseases' : selectedDisease}
              </p>
              <div className="space-y-3">
                {recent.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c.disease}</p>
                      <p className="text-xs text-gray-400">{c.age ? `Age ${c.age}` : '—'} · {c.hospital_name}</p>
                    </div>
                    <span className={`text-xs font-semibold ${outcomeColor[c.outcome] || 'text-gray-400'}`}>
                      {c.outcome ?? '—'}
                    </span>
                  </div>
                ))}
                {recent.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No cases yet</p>}
              </div>
              <button onClick={() => window.location.href = '/results'} className="w-full mt-4 text-xs text-accent font-medium hover:underline">
                View all cases →
              </button>
            </div>
          </div>
        </div>
        </>
        )}

      </main>
    </div>
  )
}