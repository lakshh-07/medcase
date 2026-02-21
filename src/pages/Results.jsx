import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import supabase from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import FilterPanel from '../components/FilterPanel'
import CaseCard from '../components/CaseCard'

export default function Results() {
  const [searchParams] = useSearchParams()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('disease') || '')
  const [activeTab, setActiveTab] = useState('All')
  const [filters, setFilters] = useState({
    disease: 'All', severity: 'All', outcome: 'All', gender: 'All', ageMin: '', ageMax: ''
  })

  useEffect(() => {
    async function fetchCases() {
      setLoading(true)
      const { data } = await supabase.from('cases').select('*')
      setCases(data || [])
      setLoading(false)
    }
    fetchCases()
  }, [])

  const filtered = cases.filter(c => {
    if (search && !c.disease?.toLowerCase().includes(search.toLowerCase()) &&
        !c.disease_spec?.toLowerCase().includes(search.toLowerCase()) &&
        !c.treatment?.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.disease !== 'All' && c.disease !== filters.disease) return false
    if (filters.severity !== 'All' && c.severity !== filters.severity) return false
    if (filters.outcome !== 'All' && c.outcome !== filters.outcome) return false
    if (filters.gender !== 'All' && c.gender !== filters.gender) return false
    if (filters.ageMin && c.age < parseInt(filters.ageMin)) return false
    if (filters.ageMax && c.age > parseInt(filters.ageMax)) return false
    if (activeTab !== 'All' && c.outcome !== activeTab) return false
    return true
  })

  const tabs = ['All', 'Recovered', 'Improving', 'Stable', 'Deteriorating']

  const tabCount = (tab) => {
    if (tab === 'All') return cases.length
    return cases.filter(c => c.outcome === tab).length
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar />
      <main className="ml-[230px] flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-gray-400 mb-1">Pages / Browse Cases</p>
            <h1 className="text-2xl font-bold text-gray-900">Patient Cases</h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search disease, treatment..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:border-accent w-64"
            />
            <span className="text-xs bg-white border border-gray-100 px-3 py-2.5 rounded-xl shadow-sm text-gray-500">
              {filtered.length} results
            </span>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter Panel */}
          <div className="w-64 shrink-0">
          <FilterPanel filters={filters} setFilters={setFilters} cases={cases} />
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-5">
              <div className="flex items-center gap-1 px-4 pt-4">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2
                      ${activeTab === tab
                        ? 'bg-accent-light text-accent'
                        : 'text-gray-500 hover:text-gray-800'
                      }`}
                  >
                    {tab}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full
                      ${activeTab === tab ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {tabCount(tab)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-2">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-gray-500 font-medium">No cases found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Disease', 'Age / Gender', 'Severity', 'Treatment', 'Hospital', 'Cost', 'Duration', 'Outcome', 'Report'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(c => <CaseCard key={c.id} c={c} />)}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination hint */}
              {filtered.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400">Showing {filtered.length} of {cases.length} cases</p>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 text-xs hover:bg-accent-light hover:text-accent transition-all">‹</button>
                    <button className="w-7 h-7 rounded-lg bg-accent text-white text-xs">1</button>
                    <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 text-xs hover:bg-accent-light hover:text-accent transition-all">›</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}