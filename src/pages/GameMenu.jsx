import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/gameMenu.css';

const API_URL = import.meta.env.VITE_API_URL;

const BOT_DIFFICULTIES = [
    { id: 'easy', label: 'Apprenti (facile)' },
    { id: 'medium', label: 'Guerrier (intermédiaire)' },
    { id: 'hard', label: 'Héro (difficile)' }
];

function GameMenu() {
    const { player, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [decks, setDecks] = useState([]);
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [cards, setCards] = useState(null);
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

    // charger les cartes du deck selectionne
    useEffect(() => {
        if (!selectedDeckId) return;

        fetch(`${API_URL}/deck/cartes/${selectedDeckId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Problème lors du chargement des cartes");
                return res.json();
            })
            .then((data) => {
                setCards(data);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, [selectedDeckId]);

    // pour changer le deck selectionne
    const handleChangeSelected = (e) => {
        setSelectedDeckId(Number(e.target.value));
    }

    const handleChangeDifficulty = (diff) => {
        setDifficulty(diff)
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
                <div className='deck-setup-box'>
                    <div className='deck-selector'>
                        <label htmlFor="deck-select"><h3>Choisissez votre deck</h3></label>
                        <select id='deck-select' value={selectedDeckId} onChange={handleChangeSelected}>
                            {decks.map((sort) => (
                                <option key={sort.id} value={sort.id}>
                                    <div>{sort.nom}</div>
                                </option>
                            ))}
                        </select>
                        <p>Liste des cartes</p>
                        <div className='cards-list'>
                            {cards?.map((card) => (
                                <div>{card.nom_carte}</div>
                            ))}
                        </div>
                    </div>
                    <div className='deck-preview'>
                        <img src={`/cards/${chosenDeck.image}`} alt={chosenDeck.nom} />
                    </div>
                </div>

                <div className='diff-setup-box'>
                    <h3>Choisissez la Difficulté de l'ordinateur</h3>
                    <div className='diff-box'>
                        {BOT_DIFFICULTIES.map((diff) => (
                            <button
                                key={diff.id}
                                className={`diff-button diff-${diff.id} ${difficulty === diff.id ? 'diff-selected' : ''}`}
                                onClick={() => {handleChangeDifficulty(diff.id)}}>
                                {diff.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <button>Commencer la partie</button>
            </div>

        </div>
    );
}

export default GameMenu;