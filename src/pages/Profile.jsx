import { useState, useEffect} from 'react';

import Player from "../components/profil/Player";

function Profile() {

    const [player, setPlayer] = useState(null)

    {/* il va falloir recuperer l'id du joueur connecter en session */}
    let id = 3

    useEffect(() => {
        fetch(`http://localhost:5000/api/joueurs/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setPlayer(data);
                }
            })
            .catch((err) => console.error("Erreur de connexion:", err));
    }, [id]);

    return (
        <>
            <div>Bienvenue sur le profil</div>
            <Player player={player}/>
        </>
    );
}

export default Profile