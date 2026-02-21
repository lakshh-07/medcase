import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import RecoveryChart from '../components/RecoveryChart'

export default function Home() {
  const [allCases, setAllCases] = useState([])
  const [stats, setStats] = useState({ total: 0, recovered: 0, diseases: 0, hospitals: 0 })
  const [recent, setRecent] = useState([])
  const [selectedDisease, setSelectedDisease] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchAll() {
      const { data } = await supabase.from('cases').select('*')
      if (!data) return
      setAllCases(data)
      setRecent(data.slice(-5).reverse())
      updateStats(data, 'All')
    }
    fetchAll()
  }, [])

  const updateStats = (data, disease) => {
    const filtered = disease === 'All' ? data : data.filter(c =>
      c.disease?.toLowerCase().includes(disease.toLowerCase())
    )
    const recovered = filtered.filter(c => c.outcome === 'Recovered' || c.outcome === 'Improved').length
    const uniqueDiseases = [...new Set(filtered.map(c => c.disease).filter(Boolean))].length
    const uniqueHospitals = [...new Set(filtered.map(c => c.hospital_name).filter(Boolean))].length
    setStats({ total: filtered.length, recovered, diseases: uniqueDiseases, hospitals: uniqueHospitals })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const val = search.trim() === '' ? 'All' : search.trim()
    setSelectedDisease(val)
    updateStats(allCases, val)
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

        {/* Banner with hero image */}
        <div className="rounded-2xl bg-gradient-to-r from-accent to-accent2 p-6 mb-8 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 flex items-center justify-between w-full gap-8">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">✦ Real anonymized patient data</p>
              <p className="text-white text-xl font-bold">Make informed decisions after your diagnosis.</p>
              <p className="text-white/70 text-sm mt-1">Browse real treatment journeys — no names, no IDs, just outcomes.</p>
            </div>
            <div className="hidden lg:flex items-center gap-6 shrink-0">
              <div className="relative w-44 h-32 rounded-xl overflow-hidden shadow-xl border-2 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=352&h=256&fit=crop"
                  alt="Healthcare professional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-36 h-28 rounded-xl overflow-hidden shadow-xl border-2 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=288&h=224&fit=crop"
                  alt="Medical data"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/results'}
              className="bg-white text-accent font-semibold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg transition-all whitespace-nowrap shrink-0"
            >
              Browse Cases →
            </button>
          </div>
        </div>

        {/* Visual feature strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { img: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=200&fit=crop', label: 'Real outcomes', sub: 'From verified cases' },
            { img: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=200&fit=crop', label: 'Privacy first', sub: '100% anonymized' },
            { img: 'https://images.unsplash.com/photo-1579154204200-7d1f28b9f0b6?w=400&h=200&fit=crop', label: 'Informed decisions', sub: 'Evidence-based' },
          ].map(({ img, label, sub }) => (
            <div key={label} className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="relative aspect-[2/1] overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
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
                  updateStats(allCases, 'All')
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
                  updateStats(allCases, 'All')
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
          <StatCard
            title="Recovered"
            value={stats.recovered.toLocaleString()}
            sub="Reported full recovery"
            icon="✅" color="green"
          />
          <StatCard
            title="Diseases"
            value={stats.diseases}
            sub="Unique conditions"
            icon="🧬" color="amber"
          />
          <StatCard
            title="Hospitals"
            value={stats.hospitals}
            sub="Contributing institutions"
            icon="🏥" color="rose"
          />
        </div>

        {/* Chart + Recent */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <RecoveryChart selectedDisease={selectedDisease} />
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
            <button onClick={() => window.location.href = '/results'} className="w-full mt-4 text-xs text-accent font-medium hover:underline">
              View all cases →
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}