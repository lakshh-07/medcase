import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Results from './pages/Results'
import Submit from './pages/Submit'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
    </BrowserRouter>
  )
}