import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
  } from 'recharts'
  
  const data = [
    { disease: 'Diabetes', recovery: 72 },
    { disease: 'Hypertension', recovery: 85 },
    { disease: 'Asthma', recovery: 78 },
    { disease: 'Depression', recovery: 65 },
    { disease: 'Arthritis', recovery: 60 },
    { disease: 'Cancer', recovery: 48 },
  ]
  
  const COLORS = ['#5b5ef4', '#7c3aed', '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd']
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-sm text-accent font-bold">{payload[0].value}% recovery rate</p>
        </div>
      )
    }
    return null
  }
  
  export default function RecoveryChart() {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900">Recovery Rate by Disease</h3>
            <p className="text-xs text-gray-400 mt-0.5">Based on reported outcomes in database</p>
          </div>
          <span className="text-xs bg-accent-light text-accent font-medium px-3 py-1 rounded-full">
            Last 30 days
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="disease"
              tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Sora' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Sora' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
            <Bar dataKey="recovery" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }