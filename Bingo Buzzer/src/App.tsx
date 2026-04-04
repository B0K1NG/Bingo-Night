import { Routes, Route } from 'react-router-dom'
import HostPage from './pages/HostPage'
import PlayerPage from './pages/PlayerPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HostPage />} />
      <Route path="/play" element={<PlayerPage />} />
    </Routes>
  )
}

export default App