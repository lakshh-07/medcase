import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#5b5ef4', '#7c3aed', '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd']

export default function RecoveryChart({ selectedDisease = 'All' }) {
  const [allCases, setAllCases] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('cases').select('hospital_name, outcome, disease')
      if (!data) return
      setAllCases(data)
      buildChart(data, selectedDisease)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (allCases.length > 0) buildChart(allCases, selectedDisease)
  }, [selectedDisease, allCases])

  const buildChart = (data, disease) => {
    const filtered = disease === 'All' ? data : data.filter(c => c.disease?.toLowerCase().includes(disease.toLowerCase()))
    const hospitals = [...new Set(filtered.map(c => c.hospital_name).filter(Boolean))]
    const chart = hospitals.map(hospital => {
      const total = filtered.filter(c => c.hospital_name === hospital).length
      const recovered = filtered.filter(c => c.hospital_name === hospital && (c.outcome === 'Recovered' || c.outcome === 'Improved')).length
      return {
        hospital: hospital.length > 14 ? hospital.slice(0, 14) + '…' : hospital,
        fullName: hospital,
        recovery: total > 0 ? Math.round((recovered / total) * 100) : 0,
        total
      }
    })
    setChartData(chart)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Recovery Rate by Hospital</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {selectedDisease === 'All' ? 'All diseases' : selectedDisease}
          </p>
        </div>
        <span className="text-xs bg-accent-light text-accent font-medium px-3 py-1 rounded-full">Live data</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="hospital" tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Sora' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Sora' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">{payload[0].payload.fullName}</p>
                    <p className="text-sm text-accent font-bold">{payload[0].value}% recovery rate</p>
                    <p className="text-xs text-gray-400">{payload[0].payload.total} cases</p>
                  </div>
                )
              }
              return null
            }}
            cursor={{ fill: '#f9fafb' }}
          />
          <Bar dataKey="recovery" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}