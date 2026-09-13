import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import '../../css/header.css'

{/* reste a determiner avec l'equipe quelle onglet du menu est visible par qui */ }

function Header() {
    const { player, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <header className='header-container'>
            <div className='header-content'>
                <nav className='navbar'>
                    {/* onglets TOUJOURS visibles */}
                    <Link to="/" className='brand-title'>
                        <h1>ECLIPSE</h1>
                    </Link>
                    <NavLink to="/">Accueil</NavLink>
                    <NavLink to="/shop">Magasin</NavLink>
                    <NavLink to="/market">Marché</NavLink>

                    {/* onglets visibles si user est NON connecte */}
                    {!player && (
                        <NavLink to="/login" className='navlink-right'>Connexion</NavLink>
                    )}

                    {/* onglets visibles si joueur EST connecte */}
                    {player && (
                        <>
                            <NavLink to="/game">Jouer</NavLink>
                            <NavLink to="/inventory">Inventaire</NavLink>
                            <NavLink to="/profile">Profil</NavLink>

                            {/* onglets visibles si user est ADMIN */}
                            {Boolean(player.est_admin) && (
                                <NavLink to="/admin">Administrateur</NavLink>
                            )}

                            <div className='navlink-right username'>{player.alias}</div>
                            <button className='button-logout' onClick={handleLogout}>Déconnexion</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header