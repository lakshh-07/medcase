export default function StatCard({ title, value, sub, icon, color }) {
    const colors = {
      indigo: 'bg-indigo-50 text-indigo-500',
      green: 'bg-green-50 text-green-500',
      amber: 'bg-amber-50 text-amber-500',
      rose: 'bg-rose-50 text-rose-500',
    }
  
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${colors[color] || colors.indigo}`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
      </div>
    )
  }