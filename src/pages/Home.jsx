import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import RecoveryChart from '../components/RecoveryChart'

export default function Home() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, recovered: 0, diseases: 0, hospitals: 0 })
  const [recent, setRecent] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchStats() {
      const { data } = await supabase.from('cases').select('*')
      if (!data) return
      const recovered = data.filter(c => c.outcome === 'Recovered').length
      const diseases = [...new Set(data.map(c => c.disease))].length
      const hospitals = [...new Set(data.map(c => c.hospital_name))].length
      setStats({ total: data.length, recovered, diseases, hospitals })
      setRecent(data.slice(-5).reverse())
    }
    fetchStats()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/results?disease=${search}`)
  }

  const outcomeColor = {
    Recovered: 'text-green-500',
    Improving: 'text-blue-500',
    Stable: 'text-amber-500',
    Deteriorating: 'text-rose-500',
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <main className="ml-[230px] flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-gray-400 mb-1">Pages / Dashboard</p>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-white border border-gray-100 px-3 py-2 rounded-lg shadow-sm">
              📅 {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-accent to-accent2 p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">✦ Real anonymized patient data</p>
            <p className="text-white text-xl font-bold">Make informed decisions after your diagnosis.</p>
            <p className="text-white/70 text-sm mt-1">Browse real treatment journeys — no names, no IDs, just outcomes.</p>
          </div>
          <button
            onClick={() => navigate('/results')}
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
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-white border border-gray-100 rounded-xl px-5 py-3 text-sm shadow-sm focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="bg-accent text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent2 transition-all shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <StatCard title="Total Cases" value={stats.total.toLocaleString()} sub="In the database" icon="🗂" color="indigo" />
          <StatCard title="Recovered" value={stats.recovered.toLocaleString()} sub="Reported full recovery" icon="✅" color="green" />
          <StatCard title="Diseases" value={stats.diseases} sub="Unique conditions" icon="🧬" color="amber" />
          <StatCard title="Hospitals" value={stats.hospitals} sub="Contributing institutions" icon="🏥" color="rose" />
        </div>

        {/* Chart + Recent */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <RecoveryChart />
          </div>

          {/* Recent Cases */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Cases</h3>
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
            <button
              onClick={() => navigate('/results')}
              className="w-full mt-4 text-xs text-accent font-medium hover:underline"
            >
              View all cases →
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}