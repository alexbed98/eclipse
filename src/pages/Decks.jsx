import { useEffect } from 'react';
import '../css/decks.css'
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

function Decks() {
    const {player, loading: authLoading} = useAuth();
    const [deck, setDeck] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/decks/${player.id}`)
        .then((response) => {
            if(!response.ok){
                throw new Error('Erreur lors du chargement des decks du joueur.')
            }

            return response.json();
        })
        .then((data) => {
            setDeck(data);

            
        })
        .catch((error) => {
            console.error("Erreur: ", error);
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        })
    }, [])

    if (loading) return <p>Chargement des decks</p>;

    return (
        <div id='deck-main-container'>
            <button id='deck-create'> Créer un deck</button>
            <div id='deck-container'>
                {[deck].flat().map((element, index) => (
                    <Link to={`/decks/${element.id}`} key={element.id} className='individualDeck'>{element.nom}</Link>
                ))}
            </div>
        </div>
    );
}

export default Decks