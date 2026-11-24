import { useState, useEffect, useRef  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "../css/game.css"
import '../css/modalBox.css';
const API_URL = import.meta.env.VITE_API_URL;

function Game() {
    const {player, loading: authLoading} = useAuth();
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
    const [gameOver, setGameOver] = useState(true);
    const [isWinner, setIsWinner] = useState(true);
    const [earnings, setEarnings] = useState(0);
    const [difficultyDeckBot, setDifficultyDeckBot] = useState(0);

    const [playerActionPoint, setPlayerActionPoint] = useState(1); // Nombre d'action par tour (ex: Jouer une carte de la main coute un point).
    const [botActionPoint, setBotActionPoint] = useState(1);
    const [attacker, setAttacker] = useState(null);
    const [waitingForTarget, setWaitingForTarget] = useState(false);
    const [notification, setNotification] = useState(null);

    const location = useLocation();
    

    const {playerDeckId, botDifficulty} = location.state || {};

    
    const navigate = useNavigate();
    if(!playerDeckId){
        navigate('/gamemenu');
        return null;
    }
    
    


    // Pour mélanger les cartes du deck des 2 joueurs.
    const shuffleDeck = (deck) => {

        let shuffledDeck = [...deck];

        for (let i = shuffledDeck.length - 1; i > 0; i--) {
            let random = Math.floor(Math.random() * (i + 1));

            [shuffledDeck[i], shuffledDeck[random]] =
            [shuffledDeck[random], shuffledDeck[i]];
        }
        return shuffledDeck;
    }

    const startingHand = (botDeck, playerDeck) => {
        const botStartingCards = botDeck.slice(0, 3);
        const playerStartingCards = playerDeck.slice(0, 3);

        setBotHand(botStartingCards);
        setPlayerHand(playerStartingCards);
        setBotDeck(botDeck.slice(3));
        setPlayerDeck(playerDeck.slice(3));
    };

    const playCard = (card) => {
        // console.log("Carte sélectionnée :", card);
        if(activePlayer){
            if(playerActionPoint === 1){
                setPlayerField(previousField => [...previousField, card]);
                setPlayerHand(previousHand => previousHand.filter(element => element.id_unique  !== card.id_unique))
                setPlayerActionPoint(0);
            }
        }
        else {
            if (botActionPoint === 1) {
                setBotField(previousField => [...previousField, card]);
                setBotHand(previousHand => previousHand.filter(element => element.id_unique !== card.id_unique));
                setBotActionPoint(0);
            }
    }
        //console.log(playerField);
    }

    const botPlayCard = () => {
        if(botActionPoint === 0)
            return;

        if(botHand.length === 0)
            return;

        const selectedCard = Math.floor(Math.random() * botHand.length);

        playCard(botHand[selectedCard]);
        setBotActionPoint(0);
    }

    const drawCard = (playerTurn) => {
        if(playerTurn){ // Vérifie qui est l'active player
            if(playerDeck.length > 0){  // Vérifie que le deck n'est pas vide
                let cardDrawn = playerDeck[0]; // récupère la première carte du deck du joueur actif
                setPlayerHand(previousHand => [...previousHand, cardDrawn]) // Récupère la main du joueur et ajoute la carte pigée
                setPlayerDeck(previousDeck => previousDeck.slice(1)); // Update le deck en prenant toutes les cartes à partir de la position 1 (donc on retire 0)
            }   
        }
        else{
             if(botDeck.length > 0){
                let cardDrawn = botDeck[0]; 
                setBotHand(previousHand => [...previousHand, cardDrawn]) 
                setBotDeck(previousDeck => previousDeck.slice(1)); 
            }
        }
    }

    const startingPlayer = () => { // Fonction utilisée pour déterminer aléatoirement quel joueur commence en premier (nombre de 1 à 10).

        let playerRoll = Math.floor(Math.random() * 10 + 1); // Floor utilisé ici pour arondir les nombres.
        let botRoll = Math.floor(Math.random() * 10 + 1);
        
        while(playerRoll === botRoll){ // Boucle pour s'assurer que le joueur et le bot aient un nombre différent.
            playerRoll = Math.floor(Math.random() * 10 + 1);
            botRoll = Math.floor(Math.random() * 10 + 1);
        }

        console.log("Player Roll: " + playerRoll);
        console.log("Bot Roll: " + botRoll);

        const startingActivePlayer = playerRoll > botRoll
        
        console.log(startingActivePlayer);
        return startingActivePlayer; // Retourne un bool. Si true = Joueur qui commence | False =  le bot commence
        
    }

    const passTurn = () => { // Utilisé pour que le joueur actif passe son tour. Le nouveau joueur actif récupère son point d'action pour jouer à son tour.
        const nextPlayer = !activePlayer;

        setActivePlayer(nextPlayer);
        drawCard(nextPlayer);
        resetMonsterActionPoints(nextPlayer);

        if(nextPlayer){
            setPlayerActionPoint(1);
            console.log("Tour du joueur");
        }
        else{
            setBotActionPoint(1);
            console.log("Tour du bot");
        }
    }

    const Attack = (attacker) => {
        if(attacker.point_action === 0)
            return;
        setAttacker(attacker);
        setWaitingForTarget(true);
    }

    // Fonction pour attaquer une carte adverse
    const SelectTarget = (defender) => {
        if (!waitingForTarget) return;

        // console.log("Attaquant :", attacker);
        // console.log("Cible :", defender);

        let hitOrMiss = Math.floor(Math.random() * 5 + 1); // On génère un nombre aléatoire entre 1 et 5.

        if(hitOrMiss === 1){ // Si le nombre est égale à 1, la créature à manqué sa cible.
            attackNotification(attacker, defender, 0, 1);
        }
        else{
            let damageDealt = Math.floor(Math.random() * attacker.attaque + 1)
            console.log("Dommage effectué: " + damageDealt);

            setBotField(previousField =>
                previousField.map(element =>
                    element.id_unique === defender.id_unique ? {...element, degat_accumule: element.degat_accumule + damageDealt} : element)
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

            if(hitOrMiss === 1){ 
                attackNotification(carteBot, defender, 0, 1)
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            else{
                let damageDealt = Math.floor(Math.random() * carteBot.attaque + 1);

                // Infliger les dégâts
                setPlayerField(previousField =>
                    previousField.map(element =>
                        element.id_unique === defender.id_unique ? {...element, degat_accumule: element.degat_accumule + damageDealt} : element
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

    const attackNotification = (attacker, defender, damage, notificationNumber) => {
        if(notificationNumber === 0){
            setNotification(`${attacker.nom_carte} a infligé ${damage} point(s)\n de dégâts à ${defender.nom_carte}!`);
        }
        else{
           setNotification(`${attacker.nom_carte} a raté son attaque.`);
        }
    }

    const resetMonsterActionPoints = (activePlayer) => {
        if(activePlayer){
            playerField.forEach((element) => {
                element.point_action = 1;
            })
        }
        else{
            botField.forEach((element) => {
                element.point_action = 1;
            })
        }
    }

    const ShowDamageTaken = (element) => {
        if(element.degat_accumule > 0){
            return(
                <div className="game-damageTaken">-{element.degat_accumule}❤️</div>
            )
        }
    }

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



    const VictoryOrDefeat = () => { 
        if(playerDeck.length === 0 && playerHand.length === 0 && playerField.length === 0){ // ici doit valider playerField pour être sur que le joueur n'a pas de créature
            // console.log("Vous avez perdu :'( ");                                            // sur le field.
        }
        if(botDeck.length === 0 && botDeck.length === 0 && botField === 0){
            // console.log("Vous avez gagné!");  
            // faire un fetch ici pour ajouter des points ou whatever...
        }
    }

    const expandDeck = (data) => {
        return data.flatMap(carte =>
            Array.from({ length: carte.quantite }, () => ({
                ...carte,
                id_unique: crypto.randomUUID(),
                quantite: 1
            }))
        );
    };


    // Ici on récupère les decks avec le fetch, on prend les cartes dans le résultat json et on les ''séparent'' en unités (si une carte à une quantité de 2 par exemple)
    // avec expandDeck, puis on mélange les cartes avec shuffleDeck.
    useEffect(() => {
        let deckDuBot;
        let deckJoueur = playerDeckId;

        // switch case pour faire la sélection du deck du bot.
        switch(botDifficulty){ // botDifficulty est le numéro que je vais recevoir dépendemment de la difficulté sélectionné.
            case 0:
                deckDuBot = 79;
                setDifficultyDeckBot(79) // Ajuster le numéro du deck (le id du deck dans la bd) du bot pour le deck niveau débutant
                setEarnings(25)
                break;
            case 1:
                deckDuBot = 79;
                setDifficultyDeckBot(79) // Ajuster le numéro du deck du bot pour le deck niveau intermédiaire
                setEarnings(50)
		break;
            case 2:
                deckDuBot = 79;
                setDifficultyDeckBot(79) // Ajuster le numéro du deck du bot pour le deck niveau expert
                setEarnings(100)
		break;
            default:
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

    // Actions du bot durant son tour.
    useEffect(() => {
        if (!activePlayer) {
            console.log("Le bot commence à jouer...");
            botPlayCard();
            botAttack();
            passTurn();
        }

    }, [activePlayer, botHand, botActionPoint]);


    const startGame = (botDeck, playerDeck) => {

        const startingActivePlayer = startingPlayer();
        setActivePlayer(startingActivePlayer);
        startingHand(botDeck, playerDeck);

        if(startingActivePlayer){
            console.log("Le joueur commence la partie.");
        }
        else{
            console.log("Le bot commence la partie");
        }

    };

    const quitGame = () => {
        navigate('/gamemenu');
        return null;
    }

    const resetGame = () => {
	window.location.reload();
    }
    
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
                            return (
                                <div key={element.id_unique} className='card-field'>
                                    <img
                                    src={`/cards/${element.id_carte}.png`}
                                    className="card-game card-shadow card-trans-down playable-card" 
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
                    <img className="deck-zone card-game card-shadow" src={`/cards/backDesign.jpg`} /> {/* Deck du bot */}
                    {botGraveyard.length > 0 ? (
                            <img src={`/cards/${botGraveyard[botGraveyard.length-1].id_carte}.png`} className="graveyard-zone card-game" alt='graveyard'></img>
                        ) : <img className="graveyard-zone card-game" alt='graveyard'/> }{/* Cimetiere du bot */}
                </div>
            </div>

            <div className="center-line"></div>

            <div className="player-container"> {/* Container du joueur */}

                <div className="large-panel"> {/* Grand panel du joueur (pour main et field) */}

                    <div className="play-zone"> {/* Zone de jeu du joueur */}
                        {playerField.map((element, index) => {
                            return (
                                <div key={element.id_unique} className='card-field'>
                                    <img  
                                    src={`/cards/${element.id_carte}.png`} 
                                    className={`card-game card-shadow playable-card card-trans-up rarity-${element.id_rarete}`} 
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
                    <button className='button-end-turn' onClick={passTurn}>Terminer le  tour</button>
                    {playerGraveyard.length > 0 ? (
                            <img src={`/cards/${playerGraveyard[playerGraveyard.length-1].id_carte}.png`} className="graveyard-zone card-game" alt='graveyard'></img>
                        ) : <img className="graveyard-zone card-game" alt='graveyard'/> }{/* Cimetiere du joueur */}
                    <img className="deck-zone card-game card-shadow" src={`/cards/backDesign.jpg`} /> {/* Deck du joueur */}
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