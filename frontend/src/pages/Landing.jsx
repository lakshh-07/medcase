import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-sora">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">MedCase</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#how" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">How it works</a>
          <a href="#features" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Features</a>
          <a href="#trust" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Privacy</a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/submit')}
            className="text-sm font-medium text-accent border border-accent px-4 py-2 rounded-xl hover:bg-accent-light transition-all"
          >
            Submit Case
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-semibold bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent2 transition-all shadow-sm"
          >
            Go to Dashboard →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent2/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-12 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-accent-light text-accent text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
            100% Anonymized · No personal data stored
          </div>
          <h1 className="text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            Real patient outcomes.<br />
            <span className="text-accent">Zero identity.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            MedCase is a database of real anonymized treatment journeys. When you're diagnosed, stop guessing — see what actually worked for people like you.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-accent text-white font-semibold px-8 py-4 rounded-2xl text-base hover:bg-accent2 transition-all shadow-lg hover:shadow-xl"
            >
              Explore Cases →
            </button>
            <button
              onClick={() => navigate('/submit')}
              className="bg-white text-gray-700 font-semibold px-8 py-4 rounded-2xl text-base border border-gray-200 hover:border-accent hover:text-accent transition-all"
            >
              Submit a Case
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-12 mt-16 pt-12 border-t border-gray-200">
            {[
              { value: '17+', label: 'Patient Cases' },
              { value: '2', label: 'Diseases Tracked' },
              { value: '3', label: 'Hospitals' },
              { value: '100%', label: 'Anonymous' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white py-20 px-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest text-center mb-3">How it works</p>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">From diagnosis to decision in 3 steps</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Search your diagnosis', desc: 'Enter your disease or condition into the search bar and instantly find matching anonymized cases from real patients.' },
              { step: '02', icon: '📊', title: 'Compare treatments', desc: 'See what treatments were used, at which hospitals, how long they took, and what they cost — all in one view.' },
              { step: '03', icon: '✅', title: 'Make informed decisions', desc: 'Use real outcome data to have better conversations with your doctor and choose the path that has worked for others.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative p-6 rounded-2xl border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all">
                <span className="text-4xl font-bold text-gray-100 absolute top-4 right-5">{step}</span>
                <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center text-2xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-12 bg-[#f4f6fb]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest text-center mb-3">Features</p>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Everything you need post-diagnosis</h2>
          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: '🏥', title: 'Hospital-wise recovery rates', desc: 'See which hospitals have the best outcomes for your specific condition — backed by real data.' },
              { icon: '💊', title: 'Treatment comparisons', desc: 'Compare multiple treatment paths side by side — costs, duration, side effects, and outcomes.' },
              { icon: '🔒', title: 'Fully anonymized', desc: 'No names, no IDs, no personal information. Only clinical data that helps you decide.' },
              { icon: '📋', title: 'Doctor submissions', desc: 'Cases are submitted only by verified hospitals and medical institutions ensuring data quality.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-accent-light rounded-xl flex items-center justify-center text-2xl shrink-0">{icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="trust" className="bg-white py-20 px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-accent-light rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy first, always</h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            MedCase never stores names, phone numbers, or any identifying information. Every case is reviewed before publishing. Our database contains only what matters — the clinical journey.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['No personal data', 'Hospital verified', 'Publicly accessible', 'Open data'].map(tag => (
              <span key={tag} className="text-xs font-medium bg-accent-light text-accent px-4 py-2 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-accent to-accent2 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to make an informed decision?</h2>
          <p className="text-white/80 mb-8">Browse real patient cases — free, anonymous, and always up to date.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-accent font-bold px-8 py-4 rounded-2xl text-base hover:shadow-xl transition-all"
          >
            Explore Cases Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="font-semibold text-gray-700 text-sm">MedCase</span>
        </div>
        <p className="text-xs text-gray-500">© 2026 MedCase. All patient data is fully anonymized.</p>
        <div className="flex gap-4">
          <a href="#" className="text-xs text-gray-500 hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="text-xs text-gray-500 hover:text-gray-700">Contact</a>
        </div>
      </footer>

    </div>
  )
}