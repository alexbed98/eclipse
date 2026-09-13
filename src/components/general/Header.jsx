import { Routes, Route, Link } from 'react-router-dom'

import '../../css/header.css'

{/* reste a determiner avec l'equipe quelle onglet du menu est visible par qui */}

function Header(){
    return (
        <header>
            <Link to="/"><h1>Eclipse</h1></Link>
            <nav className='header-nav'>
                <Link to="/">Accueil</Link>
                <Link to="/login">Connexion</Link> {/* devra etre visible seulement pour les utilisateurs non-connectes */}
                <Link to="/game">Jouer</Link> {/* devra etre visible seulement pour les utilisateurs connectes */}
                <Link to="/inventory">Inventaire</Link> {/* devra etre visible seulement pour les utilisateurs connectes */}
                <Link to="/shop">Magasin</Link> 
                <Link to="/market">Marché</Link> 
                <Link to="/profile">Profil</Link> {/* devra etre visible seulement pour les utilisateurs connectes */}
                <Link to="/admin">Administrateur</Link> {/* devra etre visible seulement pour les admins */}
            </nav>
        </header>
    );
}

export default Header