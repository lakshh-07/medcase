import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: '⊞', path: '/dashboard' },
  { label: 'Browse Cases', icon: '🗂', path: '/results' },
  { label: 'Submit Case', icon: '＋', path: '/submit' },
]

export default function Sidebar({ openAI }) {
  const location = useLocation()

  return (
    <aside className="fixed top-0 left-0 h-screen w-[230px] bg-white border-r border-gray-100 flex flex-col z-50">
      
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">MedCase</span>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest px-3 mb-2">
          General
        </p>

        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all
                ${
                  active
                    ? 'bg-accent-light text-accent'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        {/* 🔥 ASK AI BUTTON */}
        <button
          onClick={openAI}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
        >
          <span className="text-base">🤖</span>
          Ask AI
        </button>

      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent font-bold text-sm">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Anonymous</p>
            <p className="text-xs text-gray-400">Public Access</p>
          </div>
        </div>
      </div>
    </aside>
  )
}