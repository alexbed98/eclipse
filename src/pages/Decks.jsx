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
    const [activeDeckOverlay, setActiveDeckOverlay] = useState(false);
    const [cards, setCards] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);

    useEffect(() => {
        if (authLoading || !player?.id) return;

        fetchDecks();
        fetchAllCards();
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
        setInterface(!interfaceForm);
    }

    const handleCreateDeck = () => {
        fetch(`${API_URL}/decks/${player.id}/${deckTitle}`)
        .then((response) => {
            if(!response.ok)
                throw new Error("bugged")
            return response.json();
        })
    }

    const handleDeckOverlay = () => {
        setActiveDeckOverlay(!activeDeckOverlay);
    }

    const fetchAllCards = () => {
        fetch(`${API_URL}/decks/allCards`)
        .then((response) => {
            if(!response.ok)
                throw new Error("Erreur lors de la récupération des cartes")
            return response.json();
        })
        .then((data) => {
            setCards(data);
        })
        .catch((error) => {
            console.error("Erreur :", error);
        });
    }

    const setImageDeck = (idImage) => {
        fetch(`${API_URL}/decks/deckPicture/${selectedDeck}/${idImage}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erreur lors de la sauvegarde de l'image.");
            }
            return response.json();
        })
        .then(() => {
            console.log("Image sauvegardée !");
            fetchDecks();
        })
        .catch((error) => {
            console.error("Erreur :", error);
        });
    };


    if (loading) return <p>Chargement des decks</p>;
    

    return (
        <div id='deck-main-container'>

            <div className='deck-banner-container'>
                <h1 className='market-banner-title'>Bienvenue à la forge</h1>
                <p className='market-banner-text'>Fabriquez vos decks pour affronter vos adversaires.</p>
            </div>
            
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
            {activeDeckOverlay  && (
                <div id='deck-card-list-container'>
                    <div className='deck-card-list'>
                        {cards.length > 0 ? cards.map((element, index) => {
                            return(
                                <img onClick={() => {setImageDeck(element.id);; handleDeckOverlay();}} src={`/cards/${element.id}.png`} alt={element.nom || 'Carte'} key={element.id}></img>
                            )
                        }) : ""}
                    </div>
                    <button onClick={handleDeckOverlay}>Annuler</button>
                </div>
            )}
            <div id='deck-container'>
                {[deck].flat().map((element, index) => (
                    <div className='individualDeck' key={element.id}>
                        <Link to={`/decks/${element.id}`}  className='individualDeck-link'>
                                <div className='deck-deckTitle'>{element.nom}</div>
                            <img src={`/cards/${element.image}`} className='deck-deckImage' alt={element.nom} />
                        </Link>
                        <div className='deck-button-container'>
                            <button className='deck-button-modify-picture' onClick={() => {handleDeckOverlay(); setSelectedDeck(element.id);}}>Modifier l'image de couverture</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Decks