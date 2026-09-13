import { useAuth } from '../context/AuthContext';
import Player from "../components/profil/Player";

function Profile() {

    const { player, loading } = useAuth();

    if (loading) {
        return <div>Chargement du profil en cours...</div>
    }

    return (
        <>
            <div>Bienvenue sur le profil</div>
            <Player player={player}/>
        </>
    );
}

export default Profile