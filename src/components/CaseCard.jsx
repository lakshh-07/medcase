const outcomeStyles = {
    Recovered: 'bg-green-50 text-green-600',
    Improving: 'bg-blue-50 text-blue-600',
    Stable: 'bg-amber-50 text-amber-600',
    Deteriorating: 'bg-rose-50 text-rose-600',
  }
  
  const severityStyles = {
    Mild: 'bg-green-100 text-green-700',
    Moderate: 'bg-amber-100 text-amber-700',
    Severe: 'bg-rose-100 text-rose-700',
  }
  
  export default function CaseCard({ c }) {
    const duration = c.treatment_start_date && c.treatment_end_date
      ? Math.round((new Date(c.treatment_end_date) - new Date(c.treatment_start_date)) / (1000 * 60 * 60 * 24))
      : null
  
    return (
      <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
        <td className="py-4 px-4">
          <div>
            <p className="font-semibold text-gray-800 text-sm">{c.disease}</p>
            {c.disease_spec && <p className="text-xs text-gray-400 mt-0.5">{c.disease_spec}</p>}
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{c.age ?? '—'}</span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-sm text-gray-600">{c.gender ?? '—'}</span>
          </div>
        </td>
        <td className="py-4 px-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${severityStyles[c.severity] || 'bg-gray-100 text-gray-500'}`}>
            {c.severity ?? 'Unknown'}
          </span>
        </td>
        <td className="py-4 px-4">
          <p className="text-sm text-gray-600 max-w-[160px] truncate">{c.treatment ?? '—'}</p>
        </td>
        <td className="py-4 px-4">
          <p className="text-sm text-gray-600">{c.hospital_name}</p>
        </td>
        <td className="py-4 px-4">
          <p className="text-sm text-gray-600">
            {c.total_cost_inr ? `₹${c.total_cost_inr.toLocaleString('en-IN')}` : '—'}
          </p>
        </td>
        <td className="py-4 px-4">
          <p className="text-sm text-gray-500 font-mono">
            {duration !== null ? `${duration} days` : '—'}
          </p>
        </td>
        <td className="py-4 px-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${outcomeStyles[c.outcome] || 'bg-gray-100 text-gray-500'}`}>
            {c.outcome ?? 'Unknown'}
          </span>
        </td>
        <td className="py-4 px-4">
          <span className={`text-xs px-2 py-1 rounded-full ${c.report_available ? 'bg-indigo-50 text-indigo-500' : 'bg-gray-100 text-gray-400'}`}>
            {c.report_available ? '📄 Yes' : 'No'}
          </span>
        </td>
      </tr>
    )
  }