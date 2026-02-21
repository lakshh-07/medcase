export default function FilterPanel({ filters, setFilters, cases }) {
    const diseases = ['All', ...new Set(cases.map(c => c.disease).filter(Boolean))]
    const severities = ['All', ...new Set(cases.map(c => c.severity).filter(Boolean))]
    const outcomes = ['All', ...new Set(cases.map(c => c.outcome).filter(Boolean))]
    const genders = ['All', ...new Set(cases.map(c => c.gender).filter(Boolean))]
  
    const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  
    const FilterGroup = ({ label, options, filterKey }) => (
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex flex-wrap gap-2">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => update(filterKey, opt)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all
                ${filters[filterKey] === opt
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-accent-light hover:text-accent'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Filters</h3>
          <button
            onClick={() => setFilters({ disease: 'All', severity: 'All', outcome: 'All', gender: 'All', ageMin: '', ageMax: '' })}
            className="text-xs text-accent hover:underline"
          >
            Reset all
          </button>
        </div>
  
        <FilterGroup label="Disease" options={diseases} filterKey="disease" />
        <FilterGroup label="Severity" options={severities} filterKey="severity" />
        <FilterGroup label="Outcome" options={outcomes} filterKey="outcome" />
        <FilterGroup label="Gender" options={genders} filterKey="gender" />
  
        <div className="mt-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Age Range</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.ageMin || ''}
              onChange={e => update('ageMin', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-accent"
            />
            <span className="text-gray-300">—</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.ageMax || ''}
              onChange={e => update('ageMax', e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>
    )
  }