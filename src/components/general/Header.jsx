import { Link, useNavigate } from 'react-router-dom'
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
        <header>
            <Link to="/"><h1>Eclipse</h1></Link>
            <nav className='header-nav'>
                {/* onglets TOUJOURS visibles */}
                <Link to="/">Accueil</Link>
                <Link to="/shop">Magasin</Link>
                <Link to="/market">Marché</Link>

                {/* onglets visibles si user est NON connecte */}
                {!player && (
                    <Link to="/login">Connexion</Link>
                )}

                {/* onglets visibles si joueur EST connecte */}
                {player && (
                    <>
                        <Link to="/game">Jouer</Link>
                        <Link to="/inventory">Inventaire</Link>
                        <Link to="/profile">Profil</Link>

                        {/* onglets visibles si user est ADMIN */}
                        {Boolean(player.est_admin) && (
                            <Link to="/admin">Administrateur</Link>
                        )}

                        <button onClick={handleLogout}>Déconnexion</button>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header