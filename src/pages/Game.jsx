
import { useState, useEffect, useRef  } from "react";
import { useAuth } from '../context/AuthContext';
import "../css/game.css"
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

    const [playerActionPoint, setPlayerActionPoint] = useState(1); // Nombre d'action par tour (ex: Jouer une carte de la main coute un point).
    const [botActionPoint, setBotActionPoint] = useState(1);
    const [attacker, setAttacker] = useState(null);
    const [waitingForTarget, setWaitingForTarget] = useState(false);


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
                setPlayerHand(previousHand => previousHand.filter(element => element !== card))
                setPlayerActionPoint(0);
            }
        }
        else {
            if (botActionPoint === 1) {
                setBotField(previousField => [...previousField, card]);
                setBotHand(previousHand =>
                    previousHand.filter(element => element !== card)
                );
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
        // va falloir ajouter un élément current pour récupérer la créature que le joueur clique dessus pour 
        // qu'ensuite choisir la carte qu'il veut attaquer
        setAttacker(attacker); // à modifier pour récupérer la carte qu'il a cliqué dessus. event.current?
        setWaitingForTarget(true);

            // ici on devrait ajouter la posibilité que si le joueur clique dans le joueur (ailleurs que sur une carte de l'adversaire)
            // ou lorsqu'il pèse sur escape, il faudrait sortir de la boucle pour stopper l'action d'attaquer.

        // Une fois que les 2 cibles ont été déterminées, il faut que la carte qui attaque inflige les dégâts à la carte qui défend.
        // ajouter fonction ici


        // Si la carte qui défend reçoit autant de dégât (ou plus) que son nombre de points de vie, elle doit être retirée du field et ajouté dans le graveyard
        // ici il va falloir déterminer à qui la créature appartient pour ensuite faire le bon update avec setPlayerField et setPlayerGraveyard


        // Une fois les dégâts infligés, il faut un "marker" directement sur la carte qui indique combien de vie elle lui reste si elle est encore en vie.

        // Doit aussi s'assurer qu'une créature ne peut attaquer qu'une seule fois par tour.
    }

    const SelectTarget = (defender) => {

        if (!waitingForTarget) return;

        console.log("Attaquant :", attacker);
        console.log("Cible :", defender);

        setAttacker(null);
        setWaitingForTarget(false);
    };



    // On pourrait utiliser cela lorsque la partie est terminé. Si défaite, pas de récompense (ou récompense moindre)
    // Si le joueur gagne, donne une récompense. Faire une requête API pour augmenter nombre de pts.
    // Doit ajouter un modal / notification pour le résultat de la partie et bloquer le reste des actions in-game. Bouton pour retry ou quitter.
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
                quantite: 1
            }))
        );
    };


    // Ici on récupère les decks avec le fetch, on prend les cartes dans le résultat json et on les ''séparent'' en unités (si une carte à une quantité de 2 par exemple)
    // avec expandDeck, puis on mélange les cartes avec shuffleDeck.
    useEffect(() => {

        if (gameStarted.current) return; // problème avec strict mode de React qui fait 2 render du useEffect, ce qui cause quelque problème...

        gameStarted.current = true;

        const fetchDecks = async () => {
            try {
                const [botResponse, playerResponse] = await Promise.all([
                    fetch(`${API_URL}/deck/cartes/${79}`),
                    fetch(`${API_URL}/deck/cartes/${80}`)
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

    useEffect(() => {
        //console.log("Bot Deck :", botDeck);
        //console.log("Player Deck :", playerDeck);
        //console.log("Bot Hand :", botHand);
        //console.log("Player Hand :", playerHand);
    }, [botDeck, playerDeck, botHand, playerHand]);


    useEffect(() => {

        if (!activePlayer) {
            console.log("Le bot commence à jouer...");

            botPlayCard();
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
    
        // Une fois le setup de départ prêt, doit ensuite faire une boucle de jeu. Pourrait possiblement faire une fonction de jeu avec des boucle while dedans.
            // Le jeu doit attendre que le joueur fasse une des choses qui suit:
                // Jouer une carte de sa main
                // Choisir une créature sur le field pour en attaquer une autre du joueur adverse (important de se rappeler que les créatures d'un joueur
                // ne doit pas être capable d'attaquer ces propres créatures lol. Ça dlaire cave mais faut y penser).
                // Passer son tour.
            
                // ***POUR LE BOT***: À mon avis, il faudrait s'assurer que le bot joue toujours une carte de sa main et attaque avec ces créatures disponibles.


    return (
        <div className="game-mainContainer"> {/* Container principal du jeu */}
            <div className="game-botHand"> {/* Main du bot */}
                {botHand.map((element, index) => {
                    return(
                        <img key={element.id_carte} className="game-botCard" src={`/cards/backDesign.jpg`}/>
                    )
                    /*
                    return(
                        
                        <div key={element.id_carte} >
                            <img src={`/cards/${element.id_carte}.png`} className="game-playerCard" onClick={() => playCard(element)}/>
                        </div>
                    )*/
                })} 
            </div> 
            
            <div className="game-botZone"> {/* Container de la zone de jeu du bot */}
                <div>
                    <div className="game-deck">zone deck</div> {/* Deck du bot */}
                    <div className="game-graveyard">zone cimetiere</div> {/* Cimetiere du bot */}
                </div>
                <div className="game-botField"> {/* Zone pour les créatures du joueur */}
                    {botField.map((element, index) => {
                        return(
                            <div key={element.id || index} >
                                <img src={`/cards/${element.id_carte}.png`} className="game-botCardOnField" onClick={() => waitingForTarget && SelectTarget(element)}/>
                            </div>
                        )
                    })}
                </div> 
            </div> 


            <button onClick={passTurn}>Fin de tour</button>

            <div className="game-playerZone">{/* Container de la zone de jeu du joueur */}
                <div className="game-playerField"> {/* Zone pour les créatures du joueur */}
                    {playerField.map((element, index) => {
                        return(
                            <div key={element.id || index} >
                                <img src={`/cards/${element.id_carte}.png`} className="game-playerCardOnField" onClick={() => Attack(element)}/>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <div className="game-graveyard">zone cimetiere</div> {/* Cimetiere du joueur */}
                    <div className="game-deck">zone deck</div> {/* Deck du joueur */}
                </div>
            </div> 

            <div className="game-playerHand">{/* Main du joueur */}
                {playerHand.map((element,index) => {
                    return(
                        <div key={element.id || index} >
                            <img src={`/cards/${element.id_carte}.png`} className="game-playerCard" onClick={() => playCard(element)}/>
                        </div>
                    )
                })} 
            </div> 
        </div>
    );
}

export default Game