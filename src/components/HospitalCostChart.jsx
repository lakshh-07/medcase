import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const LINE_COLOR = '#5b5ef4'

export default function HospitalCostChart({ selectedDisease = 'All' }) {
  const [allCases, setAllCases] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('cases').select('hospital_name, total_cost_inr, disease')
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
      const casesAtHospital = filtered.filter(c => c.hospital_name === hospital)
      const costs = casesAtHospital.map(c => c.total_cost_inr).filter(Boolean)
      const avgCost = costs.length > 0 ? Math.round(costs.reduce((a, b) => a + b, 0) / costs.length) : 0
      const totalCost = costs.reduce((a, b) => a + b, 0)
      return {
        hospital: hospital.length > 14 ? hospital.slice(0, 14) + '…' : hospital,
        fullName: hospital,
        avgCost,
        totalCost,
        cases: casesAtHospital.length
      }
    }).filter(d => d.avgCost > 0).sort((a, b) => b.avgCost - a.avgCost)
    setChartData(chart)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Cost by Hospital (₹ INR)</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Average treatment cost {selectedDisease === 'All' ? 'across all diseases' : `for ${selectedDisease}`}
          </p>
        </div>
        <span className="text-xs bg-accent-light text-accent font-medium px-3 py-1 rounded-full">Live data</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="hospital" tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Sora' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Sora' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const p = payload[0].payload
                return (
                  <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">{p.fullName}</p>
                    <p className="text-sm text-accent font-bold">₹{p.avgCost?.toLocaleString('en-IN')} avg</p>
                    <p className="text-xs text-gray-400">{p.cases} cases</p>
                  </div>
                )
              }
              return null
            }}
            cursor={{ stroke: '#e5e7eb' }}
          />
          <Line type="monotone" dataKey="avgCost" stroke={LINE_COLOR} strokeWidth={2.5} dot={{ fill: LINE_COLOR, r: 4 }} activeDot={{ r: 6 }} name="Avg Cost (₹)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
