import { Routes, Route, Link } from 'react-router-dom'

import Header from "./components/general/Header"
import Footer from "./components/general/Footer"
import Home from './pages/Home'
import Connection from './pages/Connection'
import Game from './pages/Game'
import Inventory from './pages/Inventory'
import Shop from './pages/Shop'
import Market from './pages/Market'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

function App() {
  return (
    <>
      <Header/>

      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/connection" element={<Connection/>}/>
          <Route path="/game" element={<Game/>}/>
          <Route path="/inventory" element={<Inventory/>}/>
          <Route path="/shop" element={<Shop/>}/>
          <Route path="/market" element={<Market/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/admin" element={<Admin/>}/>
        </Routes>
      </main>

      <Footer/>
    </>
  )
}

export default App
