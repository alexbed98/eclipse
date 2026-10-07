import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiLogOut } from 'react-icons/fi'; // icone de deconnexion
import { useState } from 'react';

import '../../css/header.css'

{/* reste a determiner avec l'equipe quelle onglet du menu est visible par qui */ }

function Header() {
    const { player, logout } = useAuth();
    const navigate = useNavigate();
    const [piece, setPiece] = useState(null)

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    if(player !== null){
        fetch(`http://localhost:5000/api/shop/${player.id}`)
        .then((response) => {
            if(!response.ok)
                throw new Error('Erreur lors du chargement des infos du joueur')
            return response.json();
        })
        .then((data) => {
            setPiece(data.nbPiece);
        })
    }


    return (
        <header className='header-container'>
            <div className='header-content'>
                <nav className='navbar'>
                    {/* onglets TOUJOURS visibles */}
                    <Link to="/" className='brand-title'>
                        <h1>ECLIPSE</h1>
                    </Link>
                    <NavLink to="/">ACCUEIL</NavLink>
                    <NavLink to="/shop">MAGASIN</NavLink>
                    <NavLink to="/market">MARCHÉ</NavLink>

                    {/* onglets visibles si user est NON connecte */}
                    {!player && (
                        <NavLink to="/login" className='navlink-right'>CONNEXION</NavLink>
                    )}

                    {/* onglets visibles si joueur EST connecte */}
                    {player && (
                        <>
                            <NavLink to="/game">JOUER</NavLink>
                            <NavLink to="/inventory">INVENTAIRE</NavLink>
                            <NavLink to="/profile">PROFIL</NavLink>

                            {/* onglets visibles si user est ADMIN */}
                            {Boolean(player.est_admin) && (
                                <NavLink to="/admin">ADMIN</NavLink>
                            )}

                            <div className='navlink-right username'>{player.alias}</div>
                            <button
                                className='button-logout-icon'
                                onClick={handleLogout}
                                title="Déconnexion"
                            >
                                <FiLogOut size={18} />
                            </button>
                            <div>Pièces: {piece}</div>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header