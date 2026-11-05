import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/gameMenu.css';

const API_URL = import.meta.env.VITE_API_URL;

const BOT_DIFFICULTIES = [
    { id: 'easy', label: 'Apprenti', color: '#22c522' },
    { id: 'medium', label: 'Guerrier', color: '#eab308' },
    { id: 'hard', label: 'Héro', color: '#ef4444' }
];

function GameMenu() {
    const { player, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [decks, setDecks] = useState([]);
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [difficulty, setDifficulty] = useState('medium');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // charger les decks du joueur
    useEffect(() => {
        if (authLoading) return;
        if (!player) {
            setLoading(false);
            return;
        }

        fetch(`${API_URL}/decks/${player.id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Impossible de charger vos decks');
                return res.json();
            })
            .then((data) => {
                setDecks(data);
                if (data.length > 0) {
                    setSelectedDeckId(data[0].id);
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [player, authLoading]);

    // pour changer le deck selectionne
    const handleChangeSelected = (e) => {
        setSelectedDeckId(Number(e.target.value));
    }

    const handleStartGame = async () => {
        if (!selectedDeckId) {
            alert('Veuillez sélectionner un deck.');
            return;
        }

        try {
            navigate('/battle', {
                state: {
                    playerDeck: chosenDeck.id,
                    botDifficulty: difficulty
                }
            });
        } catch (err) {
            console.error(err);
            alert(err.message || 'Erreur lors du lancement');
        }
    };

    const chosenDeck = decks.find(deck => deck.id === selectedDeckId);

    if (authLoading || loading) return <p>Chargement du menu du jeu...</p>;
    if (!player) return <p>Connectez-vous pour jouer.</p>;

    return (
        <div className='game-menu-container'>
            <div className='game-menu-header'>
                <h1>Paramètres de la partie</h1>
                <p>Préparez-vous à combattre!</p>
            </div>

            {error && <div>{error}</div>}

            <div className='setup-container'>
                <div className='setup-box'>
                    <div className='deck-selector'>
                        <label htmlFor="deck-select">Choisissez votre deck</label>
                        <select id='deck-select' value={selectedDeckId} onChange={handleChangeSelected}>
                            {decks.map((sort) => (
                                <option key={sort.id} value={sort.id}>
                                    <div>{sort.nom}</div>
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='deck-preview'>
                        <img src={`/cards/${chosenDeck.image}`} alt={chosenDeck.nom} />
                    </div>
                </div>

                <div className='setup-box'>
                    <h3>Choisissez la Difficulté de l'ordinateur</h3>
                </div>
            </div>

        </div>
    );
}

export default GameMenu;