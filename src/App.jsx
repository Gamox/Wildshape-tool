import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Beasts from './pages/Beasts'
import Collection from './pages/Collection'
import Profile from './pages/Profile'
import Sheet from './pages/Sheet'
import ShapeshiftSheet from './pages/ShapeshiftSheet'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beasts" element={<Beasts />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sheet/:name" element={<Sheet />} />
          <Route path="/shapeshift/:id" element={<ShapeshiftSheet />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
