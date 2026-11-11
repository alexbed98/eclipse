import { Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/general/ProtectedRoute';

import Header from "./components/general/Header";
import Footer from "./components/general/Footer";
import Home from './pages/Home';
import Login from './pages/Login';
import Game from './pages/Game';
import Inventory from './pages/Inventory';
import Shop from './pages/Shop';
import Market from './pages/Market';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Register from './pages/Register';
import Details from './pages/Details';
import Decks from './pages/Decks';
import DeckDetails from './pages/DeckDetails';
import GameMenu from './pages/GameMenu';

function App() {
  const location = useLocation();

  // route pour laquelle le header et le footer doivent etre cacher
  const hideLayoutRoutes = ['/game'];
  const isGameActive = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className={`app-container ${isGameActive ? 'game-mode' : ''}`}>
      {!isGameActive && <Header/>}

      <main>
        <Routes>
          {/* routes publiques */}
          <Route path="/" element={<Home/>}/>
          <Route path="/shop" element={<Shop/>}/>
          <Route path="/market" element={<Market/>}/>

          {/* routes seulement accessible aux guests (utilisateurs non-connectes) */}
          <Route path="/login" element={<GuestRoute><Login/></GuestRoute>}/>
          <Route path="/register" element={<GuestRoute><Register/></GuestRoute>}/>

          {/* routes protegees (joueur connecte seulement) */}
          <Route path="/game" element={<ProtectedRoute><Game/></ProtectedRoute>}/>
          <Route path="/inventory" element={<ProtectedRoute><Inventory/></ProtectedRoute>}/>
          <Route path="/inventory/details/:id" element={<ProtectedRoute><Details/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          <Route path="/decks" element={<ProtectedRoute><Decks/></ProtectedRoute>}/>
          <Route path='/decks/:id' element={<ProtectedRoute><DeckDetails/></ProtectedRoute>}/>
          <Route path="/gamemenu" element={<ProtectedRoute><GameMenu/></ProtectedRoute>}/>

          {/* routes protegees (admin seulement) */}
          <Route path="/admin" element={<AdminRoute><Admin/></AdminRoute>}/>
        </Routes>
      </main>

      {!isGameActive && <Footer/>}
    </div>
  )
}

export default App
