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
    const [deckTitle, setDeckTitle] = useState("");
    const [interfaceForm, setInterface] = useState(false);

    useEffect(() => {
        if (authLoading || !player?.id) return;

        fetchDecks();
    }, [authLoading, player?.id]);

    const fetchDecks = () => {
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
    }

    const handleForm = () => {
        if(!interfaceForm)
            setInterface(true);
        else{
            setInterface(false);
        }
    }

    const handleCreateDeck = () => {
        fetch(`${API_URL}/decks/${player.id}/${deckTitle}`)
        .then((response) => {
            if(!response.ok)
                throw new Error("bugged")
            return response.json();
        })
    }

    if (loading) return <p>Chargement des decks</p>;

    return (
        <div id='deck-main-container'>
            <button id='deck-create' className='profile-button' onClick={handleForm}>Créer un deck</button>
            {interfaceForm && (
                <div className="deck-overlay">
                    <div className="deck-modal">
                        <h2>Créer un deck</h2>
                        <input
                            type="text"
                            placeholder="Nom du deck"
                            value={deckTitle}
                            onChange={(textInput) => setDeckTitle(textInput.target.value)}
                        />
                        <button onClick={() => {handleCreateDeck(); fetchDecks(); handleForm();}} className='profile-button'>
                            Créer le deck
                        </button>
                        <button className='profile-button' onClick={handleForm}>Annuler</button>
                    </div>
                </div>
            )}
            <div id='deck-container'>
                {[deck].flat().map((element, index) => (
                    <Link to={`/decks/${element.id}`} key={element.id} className='individualDeck'>{element.nom}</Link>
                ))}
            </div>
        </div>
    );
}

export default Decks