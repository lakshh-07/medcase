import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Accent purple with varying opacity — each segment clearly distinct
const BASE = { r: 91, g: 94, b: 244 }
const COLORS = [1, 0.9, 0.78, 0.65, 0.52, 0.42].map(a =>
  `rgba(${BASE.r}, ${BASE.g}, ${BASE.b}, ${a})`
)

export default function OutcomePieChart({ selectedDisease = 'All' }) {
  const [allCases, setAllCases] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('cases').select('outcome, disease')
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
    const outcomeCounts = {}
    filtered.forEach(c => {
      const o = c.outcome || 'Unknown'
      outcomeCounts[o] = (outcomeCounts[o] || 0) + 1
    })
    const chart = Object.entries(outcomeCounts).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }))
    setChartData(chart)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">After Treatment Outcome</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Distribution {selectedDisease === 'All' ? 'of all cases' : `for ${selectedDisease}`}
          </p>
        </div>
        <span className="text-xs bg-accent-light text-accent font-medium px-3 py-1 rounded-full">Live data</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const p = payload[0].payload
                const total = chartData.reduce((s, d) => s + d.value, 0)
                const pct = total > 0 ? Math.round((p.value / total) * 100) : 0
                return (
                  <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                    <p className="text-sm text-accent font-bold">{p.value} cases ({pct}%)</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
