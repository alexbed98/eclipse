import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/general/ProtectedRoute';

import Header from "./components/general/Header"
import Footer from "./components/general/Footer"
import Home from './pages/Home'
import Login from './pages/Login'
import Game from './pages/Game'
import Inventory from './pages/Inventory'
import Shop from './pages/Shop'
import Market from './pages/Market'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Details from './pages/Details';

function App() {
  return (
    <div className='app-container'>
      <Header/>

      <main>
        <Routes>
          {/* routes publiques */}
          <Route path="/" element={<Home/>}/>
          <Route path="/shop" element={<Shop/>}/>
          <Route path="/market" element={<Market/>}/>
          <Route path="/login" element={<Login/>}/>

          {/* routes protegees (joueur connecte seulement) */}
          <Route path="/game" element={<ProtectedRoute><Game/></ProtectedRoute>}/>
          <Route path="/inventory" element={<ProtectedRoute><Inventory/></ProtectedRoute>}/>
          <Route path="/inventory/details/:id" element={<ProtectedRoute><Details/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>

          {/* routes protegees (admin seulement) */}
          <Route path="/admin" element={<AdminRoute><Admin/></AdminRoute>}/>
        </Routes>
      </main>

      <Footer/>
    </div>
  )
}

export default App
