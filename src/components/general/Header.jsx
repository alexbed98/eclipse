

function Header(){
    return (
        <header>
            <h1>Eclipse</h1>
            <nav>
                <ul>
                    <li>Accueil</li>
                    <li>Jouer</li>
                    <li>Magasin</li>
                    <li>Marché</li>
                    <li>Profil</li>
                    <li>Admin</li> {/* devra etre visible seulement pour les admins */}
                </ul>
            </nav>
        </header>
    );
}

export default Header