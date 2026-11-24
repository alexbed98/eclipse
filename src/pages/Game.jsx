import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../css/game.css"
import '../css/modalBox.css';
const API_URL = import.meta.env.VITE_API_URL;

function Game() {
    const { player, refreshPlayer, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);

    const [playerDeck, setPlayerDeck] = useState([]);
    const [botDeck, setBotDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [botHand, setBotHand] = useState([]);
    const [activePlayer, setActivePlayer] = useState(true); // J'ai décidé que false était le bot et true était le joueur
    const [playerField, setPlayerField] = useState([]);
    const [botField, setBotField] = useState([]);
    const [playerGraveyard, setPlayerGraveyard] = useState([]);
    const [botGraveyard, setBotGraveyard] = useState([]);
    const gameStarted = useRef(false);
    const [gameOver, setGameOver] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [earnings, setEarnings] = useState(0);

    const [playerActionPoint, setPlayerActionPoint] = useState(1); // Nombre d'action par tour (ex: Jouer une carte de la main coute un point).
    const [botActionPoint, setBotActionPoint] = useState(1);
    const [attacker, setAttacker] = useState(null);
    const [waitingForTarget, setWaitingForTarget] = useState(false);
    const [notification, setNotification] = useState(null);

    const location = useLocation();

    const { playerDeckId, botDifficulty } = location.state || {};

    const MAX_HAND = 8;   // Maximum de cartes en main
    const MAX_FIELD = 8;  // Maximum de cartes sur le battlefield

    const navigate = useNavigate();

    if (playerDeckId === undefined || playerDeckId === null) {
        navigate('/gamemenu');
        return null;
    }

    const shuffleDeck = (deck) => {

        let shuffledDeck = [...deck];

        for (let i = shuffledDeck.length - 1; i > 0; i--) {
            let random = Math.floor(Math.random() * (i + 1));

            [shuffledDeck[i], shuffledDeck[random]] =
                [shuffledDeck[random], shuffledDeck[i]];
        }
        return shuffledDeck;
    };

    const startingHand = (botDeck, playerDeck) => {
        const botStartingCards = botDeck.slice(0, 3);
        const playerStartingCards = playerDeck.slice(0, 3);

        setBotHand(botStartingCards);
        setPlayerHand(playerStartingCards);
        setBotDeck(botDeck.slice(3));
        setPlayerDeck(playerDeck.slice(3));
    };

    const playCard = (card) => {
        if (!activePlayer || gameOver) return;

        if (playerField.length >= MAX_FIELD) {
            setNotification("Terrain plein ! Maximum de créatures atteint.");
            setTimeout(() => setNotification(null), 2500);
            return;
        }

        if (playerActionPoint === 1) {
            setPlayerField(prev => [...prev, card]);
            setPlayerHand(prev => prev.filter(c => c.id_unique !== card.id_unique));
            setPlayerActionPoint(0);
        }
    };

    const botPlayCard = () => {
        if (botActionPoint === 0 || botHand.length === 0) return;

        if (botField.length >= MAX_FIELD) return;

        const selectedCard = Math.floor(Math.random() * botHand.length);
        const card = botHand[selectedCard];

        setBotField(prev => [...prev, card]);
        setBotHand(prev => prev.filter(c => c.id_unique !== card.id_unique));
        setBotActionPoint(0);
    };

    const drawCard = (playerTurn) => {
        if (playerTurn) {
            if (playerHand.length >= MAX_HAND || playerDeck.length === 0) return;

            let cardDrawn = playerDeck[0];
            setPlayerHand(prev => [...prev, cardDrawn]);
            setPlayerDeck(prev => prev.slice(1));
        } else {
            if (botHand.length >= MAX_HAND || botDeck.length === 0) return;

            let cardDrawn = botDeck[0];
            setBotHand(prev => [...prev, cardDrawn]);
            setBotDeck(prev => prev.slice(1));
        }
    };

    const startingPlayer = () => {

        let playerRoll = Math.floor(Math.random() * 10 + 1); // Floor utilisé ici pour arondir les nombres.
        let botRoll = Math.floor(Math.random() * 10 + 1);

        while (playerRoll === botRoll) { // Boucle pour s'assurer que le joueur et le bot aient un nombre différent.
            playerRoll = Math.floor(Math.random() * 10 + 1);
            botRoll = Math.floor(Math.random() * 10 + 1);
        }

        console.log("Player Roll: " + playerRoll);
        console.log("Bot Roll: " + botRoll);

        const startingActivePlayer = playerRoll > botRoll

        console.log(startingActivePlayer);
        return startingActivePlayer; // Retourne un bool. Si true = Joueur qui commence | False =  le bot commence

    };

    const passTurn = () => {
        const nextPlayer = !activePlayer;

        setActivePlayer(nextPlayer);
        drawCard(nextPlayer);
        resetMonsterActionPoints(nextPlayer);

        if (nextPlayer) {
            setPlayerActionPoint(1);
            console.log("Tour du joueur");
        }
        else {
            setBotActionPoint(1);
            console.log("Tour du bot");
        }
    };

    const Attack = (selectedCard) => {
        if (!activePlayer || gameOver || selectedCard.point_action === 0) return;

        if (attacker && attacker.id_unique === selectedCard.id_unique) {
            setAttacker(null);
            setWaitingForTarget(false);
        } else {
            setAttacker(selectedCard);
            setWaitingForTarget(true);
        }
    };

    const SelectTarget = (defender) => {
        if (!waitingForTarget) return;

        // console.log("Attaquant :", attacker);
        // console.log("Cible :", defender);

        let hitOrMiss = Math.floor(Math.random() * 5 + 1); // On génère un nombre aléatoire entre 1 et 5.

        if (hitOrMiss === 1) { // Si le nombre est égale à 1, la créature à manqué sa cible.
            attackNotification(attacker, defender, 0, 1);
        }
        else {
            let damageDealt = Math.floor(Math.random() * attacker.attaque + 1)
            console.log("Dommage effectué: " + damageDealt);

            setBotField(previousField =>
                previousField.map(element =>
                    element.id_unique === defender.id_unique ? { ...element, degat_accumule: element.degat_accumule + damageDealt } : element)
            );

            attackNotification(attacker, defender, damageDealt, 0);
        }

        setPlayerField(previousField => // Peu importe si l'attaque a réussie ou si c'est un échec, le point d'action doit être retiré.
            previousField.map(element => element.id_unique === attacker.id_unique ? { ...element, point_action: 0 } : element)
        );

        setAttacker(null);
        setWaitingForTarget(false);
    };

    const botAttack = async () => {
        if (botField.length === 0)
            return;

        if (playerField.length === 0)
            return;

        for (const carteBot of botField) {

            if (carteBot.point_action === 0)
                continue;

            if (playerField.length === 0)
                return;

            // Choisir une cible aléatoire
            const cibleBot = Math.floor(Math.random() * playerField.length);

            const defender = playerField[cibleBot];

            let hitOrMiss = Math.floor(Math.random() * 5 + 1);

            if (hitOrMiss === 1) {
                attackNotification(carteBot, defender, 0, 1)
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            else {
                let damageDealt = Math.floor(Math.random() * carteBot.attaque + 1);

                // Infliger les dégâts
                setPlayerField(previousField =>
                    previousField.map(element =>
                        element.id_unique === defender.id_unique ? { ...element, degat_accumule: element.degat_accumule + damageDealt } : element
                    )
                );

                attackNotification(carteBot, defender, damageDealt, 0);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setBotField(previousField =>
                previousField.map(element =>
                    element.id_unique === carteBot.id_unique ? { ...element, point_action: 0 } : element
                )
            );

            await new Promise(resolve => setTimeout(resolve, 1000));

        }
    };

    const expandDeck = (data) => {
        return data.flatMap(carte =>
            Array.from({ length: carte.quantite }, () => ({
                ...carte,
                id_unique: crypto.randomUUID(),
                quantite: 1
            }))
        );
    };

    const attackNotification = (attacker, defender, damage, notificationNumber) => {
        if (notificationNumber === 0) {
            setNotification(`${attacker.nom_carte} a infligé ${damage} point(s)\n de dégâts à ${defender.nom_carte}!`);
        }
        else {
            setNotification(`${attacker.nom_carte} a raté son attaque.`);
        }

        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    const resetMonsterActionPoints = () => {
        setPlayerField(prev => prev.map(c => ({ ...c, point_action: 1 })));
        setBotField(prev => prev.map(c => ({ ...c, point_action: 1 })));
    };

    const ShowDamageTaken = (element) => {
        if (element.degat_accumule > 0) {
            return (
                <div className="game-damageTaken">-{element.degat_accumule}❤️</div>
            )
        }
    };

    const startGame = (botDeck, playerDeck) => {

        const startingActivePlayer = startingPlayer();
        setActivePlayer(startingActivePlayer);
        startingHand(botDeck, playerDeck);

        if (startingActivePlayer) {
            console.log("Le joueur commence la partie.");
        }
        else {
            console.log("Le bot commence la partie");
        }

    };

    const quitGame = () => {
        navigate('/gamemenu');
        return null;
    };

    const resetGame = () => {
        window.location.reload();
    };

    const updatePlayerEarnings = async () => {
        if (earnings <= 0) return;

        try {
            const token = localStorage.getItem('token'); // ou récupéré via useAuth()

            const response = await fetch(`${API_URL}/joueurs/earnings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ pieces: earnings })
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour des pièces");
            }

            const data = await response.json();
            console.log("Nouveau solde de pièces :", data.nbpiece);

            await refreshPlayer();

        } catch (error) {
            console.error("Échec de la mise à jour des pièces :", error);
        }
    };

    // check si game over
    useEffect(() => {
        if (!gameStarted.current) return;

        const playerDead = playerDeck.length === 0 && playerHand.length === 0 && playerField.length === 0;
        const botDead = botDeck.length === 0 && botHand.length === 0 && botField.length === 0;

        if (playerDead && (playerGraveyard.length > 0 || botGraveyard.length > 0)) {
            setIsWinner(false);
            setGameOver(true);
        } else if (botDead && (playerGraveyard.length > 0 || botGraveyard.length > 0)) {
            setIsWinner(true);
            setGameOver(true);
            updatePlayerEarnings();
        }
    }, [playerDeck, playerHand, playerField, botDeck, botHand, botField, playerGraveyard, botGraveyard]);

    useEffect(() => {
        const deadCreatures = playerField.filter(
            element => element.degat_accumule >= element.defense
        );

        if (deadCreatures.length === 0)
            return;

        setPlayerField(previousField => previousField.filter(element => element.degat_accumule < element.defense));

        setPlayerGraveyard(previousGraveyard => [...previousGraveyard, ...deadCreatures]);

    }, [playerField]);

    useEffect(() => {
        const deadCreatures = botField.filter(
            element => element.degat_accumule >= element.defense
        );

        if (deadCreatures.length === 0)
            return;

        setBotField(previousField => previousField.filter(element => element.degat_accumule < element.defense)
        );

        setBotGraveyard(previousGraveyard => [...previousGraveyard, ...deadCreatures]);

    }, [botField]);

    // recuperation des decks (joueur et bot)
    useEffect(() => {
        // Ici on récupère les decks avec le fetch, on prend les cartes dans le résultat json et on les ''séparent'' en unités (si une carte à une quantité de 2 par exemple)
        // avec expandDeck, puis on mélange les cartes avec shuffleDeck.
        let deckJoueur = playerDeckId;
        if (deckJoueur === 0) { deckJoueur = 1 }
        let deckDuBot;

        // switch case pour faire la sélection du deck du bot.
        switch (botDifficulty) { // botDifficulty est le numéro que je vais recevoir dépendemment de la difficulté sélectionné.
            case 1:
                deckDuBot = 2;
                setEarnings(25)
                break;
            case 2:
                deckDuBot = 3;
                setEarnings(50)
                break;
            case 3:
                deckDuBot = 4;
                setEarnings(100)
                break;
            default:
                deckDuBot = 2;
                setEarnings(25)
                break;
        }

        if (gameStarted.current) return; // problème avec strict mode de React qui fait 2 render du useEffect, ce qui cause quelque problème...

        gameStarted.current = true;

        const fetchDecks = async () => {
            try {
                const [botResponse, playerResponse] = await Promise.all([
                    fetch(`${API_URL}/deck/cartes/${deckDuBot}`),
                    fetch(`${API_URL}/deck/cartes/${deckJoueur}`)
                ]);

                if (!botResponse.ok || !playerResponse.ok) {
                    throw new Error("Erreur lors de la récupération des decks");
                }

                const botData = await botResponse.json();
                const playerData = await playerResponse.json();
                const shuffledBotDeck = shuffleDeck(expandDeck(botData));
                const shuffledPlayerDeck = shuffleDeck(expandDeck(playerData));

                setBotDeck(shuffledBotDeck);
                setPlayerDeck(shuffledPlayerDeck);
                startGame(shuffledBotDeck, shuffledPlayerDeck);

            } catch (error) {
                console.error(error);
            }
        };

        fetchDecks();

    }, []);

    // Actions du bot durant son tour
    useEffect(() => {
        if (!activePlayer && !gameOver) {
            const executeBotTurn = async () => {
                console.log("Le bot commence à jouer...");

                // 1. Pause avant qu'il joue sa carte
                await new Promise(resolve => setTimeout(resolve, 800));
                botPlayCard();

                // 2. Pause avant ses attaques
                await new Promise(resolve => setTimeout(resolve, 800));
                await botAttack(); // On ATTEND la fin de toutes ses attaques !

                // 3. Pause avant de terminer son tour
                await new Promise(resolve => setTimeout(resolve, 600));
                passTurn();
            };

            executeBotTurn();
        }
    }, [activePlayer, gameOver]);

    return (
        <div className="game-container"> {/* Container principal du jeu */}
            {notification && (
                <div className="attack-notification">
                    {notification}
                </div>
            )}
            <div className="bot-container"> {/* Container du bot */}

                <div className="large-panel large-panel-bot"> {/* Grand panel du bot (pour main et field) */}
                    <div className="hand-zone bot-hand-zone"> {/* Zone de main du bot */}
                        {botHand.map((element, index) => {
                            return (
                                <img
                                    key={element.id_carte}
                                    className="card-game card-shadow"
                                    src={`/cards/backDesign.jpg`}
                                    alt='card in hand'
                                />
                            )
                        })}
                    </div>

                    <div className="play-zone"> {/* Zone de jeu du bot */}
                        {botField.map((element, index) => {
                            const isPlayed = element.point_action === 0;
                            return (
                                <div key={element.id_unique} className='card-field'>
                                    <img
                                        src={`/cards/${element.id_carte}.png`}
                                        className={`card-game card-shadow card-trans-down playable-card ${isPlayed ? 'played-card' : ''}`}
                                        onClick={() => waitingForTarget && SelectTarget(element)}
                                        alt='card in field'
                                    />
                                    {ShowDamageTaken(element)}
                                </div>

                            )
                        })}
                    </div>
                </div>

                <div className="small-panel"> {/* Petit panel du bot (pour deck et cimetiere) */}
                    <div className="deck-wrapper">
                        <img className="deck-zone card-game card-shadow" src={`/cards/backDesign.jpg`} alt="Deck bot" />
                        <span className="deck-count">x{botDeck.length}</span>
                    </div> {/* Deck du bot */}
                    {botGraveyard.length > 0 ? (
                        <img src={`/cards/${botGraveyard[botGraveyard.length - 1].id_carte}.png`} className="graveyard-zone card-game played-card" alt='graveyard'></img>
                    ) : <img className="graveyard-zone card-game" alt='graveyard' />}{/* Cimetiere du bot */}
                </div>
            </div>

            <div className="center-line"></div>

            <div className={`player-container ${activePlayer ? 'player-turn' : ''}`}> {/* Container du joueur */}

                <div className="large-panel"> {/* Grand panel du joueur (pour main et field) */}

                    <div className="play-zone"> {/* Zone de jeu du joueur */}
                        {playerField.map((element, index) => {
                            const isSelected = attacker?.id_unique === element.id_unique;
                            const isPlayed = element.point_action === 0;
                            return (
                                <div key={element.id_unique} className='card-field'>
                                    <img
                                        src={`/cards/${element.id_carte}.png`}
                                        className={`card-game card-shadow playable-card card-trans-up rarity-${element.id_rarete} ${isSelected ? 'selected-card' : ''} ${isPlayed ? 'played-card' : ''}`}
                                        onClick={() => Attack(element)}
                                        alt='card in field'
                                    />
                                    {ShowDamageTaken(element)}
                                </div>
                            )
                        })}
                    </div>

                    <div className="hand-zone player-hand-zone"> {/* Zone de main du joueur */}
                        {playerHand.map((element, index) => {
                            return (
                                <img
                                    key={element.id || index}
                                    src={`/cards/${element.id_carte}.png`}
                                    className={`card-game card-shadow playable-card card-trans-up rarity-${element.id_rarete}`}
                                    onClick={() => playCard(element)}
                                    alt='card in hand' />
                            )
                        })}
                    </div>
                </div>

                <div className="small-panel"> {/* Petit panel du joueur (pour deck et cimetiere) */}
                    {/* Bouton pour terminer le tour */}
                    <button
                        className='button-end-turn'
                        onClick={passTurn}
                        disabled={!activePlayer || gameOver}
                    >
                        {activePlayer ? "Terminer le tour" : "Tour adverse..."}
                    </button>
                    {playerGraveyard.length > 0 ? (
                        <img src={`/cards/${playerGraveyard[playerGraveyard.length - 1].id_carte}.png`} className="graveyard-zone card-game played-card" alt='graveyard'></img>
                    ) : <img className="graveyard-zone card-game" alt='graveyard' />}{/* Cimetiere du joueur */}
                    <div className="deck-wrapper">
                        <img className="deck-zone card-game card-shadow" src={`/cards/backDesign.jpg`} alt="Deck joueur" />
                        <span className="deck-count">x{playerDeck.length}</span>
                    </div> {/* Deck du joueur */}
                </div>

                {gameOver && (
                    <div className="modal-box game-over-box">
                        <div className="modal-content game-over-content">
                            <div>
                                {isWinner ? <h1>Victoire!</h1> : <h1>Défaite</h1>}
                                {isWinner && (
                                    <h3>Vous avez gagné {earnings} pieces.</h3>
                                )}
                                {!isWinner && (
                                    <h3>Vous avez périe au combat...</h3>
                                )}
                            </div>
                            <div className='button-box'>
                                <button className='restart-button' onClick={resetGame}>
                                    Rejouer
                                </button>
                                <button className='quit-button' onClick={quitGame}>
                                    Quitter
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
}

export default Game