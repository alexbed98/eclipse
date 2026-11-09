import "../css/game.css"

function Game() {

    const [playerDeck, setPlayerDeck] = useState([]);
    const [botDeck, setBotDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [botHand, setBotHand] = useState([]);
    const [activePlayer, setActivePlayer] = useState(false); // J'ai décidé que false était le bot et true était le joueur
    const [playerRoll, setPlayerRoll] = useState(0);
    const [botRoll, setBotRoll] = useState(0);
    const [playerField, setPlayerField] = useState();
    const [botField, setBotField] = useState();
    const [playerGraveyard, setPlayerGraveyard] = useState([]);
    const [botGraveyard, setBotGraveyard] = useState([]);
    const [gameStart, setGameStart] = useState(true);



    const shuffleDeck = (deck) => { // Mélanger le deck avant que la partie commence
        let deckLength = deck.length;
        let shuffledDeck;
    }

    const startingHand = () => {
        while(playerHand.length < 3 && botHand.length < 3){
            drawCard();
        }
    }

    const playCard = () => {
        // Vérifie qui est l'active player
        // Retire la carte sélectionnée de la main du joueur et l'ajoute sur le field
    }

    const drawCard = () => {
        useEffect(() => {
            if(gameStart){ // Action au début de la game. Les 2 joueurs vont piger des cartes pour leur main de départ.
                if(botDeck.length > 0){
                    let cardDrawn = botDeck[0];
                    setBotHand(previousHand => [...previousHand, cardDrawn])
                    setBotDeck(previousDeck => previousDeck.slice(1));
                }
                if(playerDeck.length > 0){
                    let cardDrawn = playerDeck[0];
                    setPlayerHand(previousHand => [...previousHand, cardDrawn])
                    setPlayerDeck(previousDeck => previousDeck.slice(1));
                }   
            }

            if(!gameStart){
                if(!activePlayer){ // Vérifie qui est l'active player
                    if(botDeck.length > 0){ // Vérifie que le deck n'est pas vide
                        let cardDrawn = botDeck[0]; // récupère la première carte du deck du joueur actif
                        setBotHand(previousHand => [...previousHand, cardDrawn]) // Récupère la main du joueur et ajoute la carte pigée
                        setBotDeck(previousDeck => previousDeck.slice(1)); // Update le deck en prenant toutes les cartes à partir de la position 1 (donc on retire 0)
                    }
                }
                else{
                    if(playerDeck.length > 0){
                        let cardDrawn = playerDeck[0];
                        setPlayerHand(previousHand => [...previousHand, cardDrawn])
                        setPlayerDeck(previousDeck => previousDeck.slice(1));
                    }    
                }
            }

        }, [activePlayer])
    }

    const startingPlayer = () => { // Fonction utilisée pour déterminer aléatoirement quel joueur commence en premier (nombre de 1 à 10).
        setPlayerRoll = Math.floor(Math.random(0,10) * 10); // Floor utilisé ici pour arondir les nombres.
        setBotRoll = Math.floor(Math.random(0,10) * 10);

        while(playerRoll === botRoll){ // Boucle pour s'assurer que le joueur et le bot aient un nombre différent.
            setPlayerRoll = Math.floor(Math.random(0,10) * 10);
            setBotRoll = Math.floor(Math.random(0,10) * 10);
        }

        setActivePlayer(playerRoll > botRoll); // Retourne un bool. Si true = Joueur qui commence | False =  le bot commence
    }

    const passTurn = () => { // Va être utilisé par le bouton in game pour que le joueur puisse passer son tour.
        setActivePlayer(!activePlayer);
    }


    const Attack = (attacker, target = null) => {
        // va falloir ajouter un élément current pour récupérer la créature que le joueur clique dessus pour 
        // qu'ensuite choisir la carte qu'il veut attaquer
        attacker = card.current; // à modifier pour récupérer la carte qu'il a cliqué dessus. event.current?
        while(target === null){
            // Doit mettre une notification in game qui demande au joueur de cibler une créature à attaquer.
            console.log("Choisi une cible");

            // mettre un autre event quand on clique sur la deuxième carte pour update la target
            target = card.current;

            // ici on devrait ajouter la posibilité que si le joueur clique dans le joueur (ailleurs que sur une carte de l'adversaire)
            // ou lorsqu'il pèse sur escape, il faudrait sortir de la boucle pour stopper l'action d'attaquer.
        }

        // Une fois que les 2 cibles ont été déterminées, il faut que la carte qui attaque inflige les dégâts à la carte qui défend.
        // ajouter fonction ici


        // Si la carte qui défend reçoit autant de dégât (ou plus) que son nombre de points de vie, elle doit être retirée du field et ajouté dans le graveyard
        // ici il va falloir déterminer à qui la créature appartient pour ensuite faire le bon update avec setPlayerField et setPlayerGraveyard


        // Une fois les dégâts infligés, il faut un "marker" directement sur la carte qui indique combien de vie elle lui reste si elle est encore en vie.
    }



    // On pourrait utiliser cela lorsque la partie est terminé. Si défaite, pas de récompense (ou récompense moindre)
    // Si le joueur gagne, donne une récompense. Faire une requête API pour augmenter nombre de pts.
    // Doit ajouter un modal / notification pour le résultat de la partie et bloquer le reste des actions in-game. Bouton pour retry ou quitter.
    const VictoryOrDefeat = () => { 
        if(playerDeck.length === 0 && playerHand.length === 0 && playerField.length === 0){ // ici doit valider playerField pour être sur que le joueur n'a pas de créature
            console.log("Vous avez perdu :'( ");                                            // sur le field.
        }
        if(botDeck.length === 0 && botDeck.length === 0 && botField === 0){
            console.log("Vous avez gagné!");  
            // faire un fetch ici pour ajouter des points ou whatever...
        }
    }


    useEffect(() => { // LE useEffect pour starter la partie
        // Étapes à faire
        // 0. Faire les fetch pour get les 2 decks des joueurs.
        // 1. shuffleDeck()
        // 2. startingPlayer()
        // 3. startingHand();

        // Une fois le setup de départ prêt, doit ensuite faire une boucle de jeu. (aucune idée pour l'instant ou mettre la boucle tho)
            // Le jeu doit attendre que le joueur fasse une des choses qui suit:
                // Jouer une carte de sa main
                // Choisir une créature sur le field pour en attaquer une autre du joueur adverse (important de se rappeler que les créatures d'un joueur
                // ne doit pas être capable d'attaquer ces propres créatures lol. Ça dlaire cave mais faut y penser).
                // Passer son tour.
            
                // ***POUR LE BOT***: À mon avis, il faudrait s'assurer que le bot joue toujours une carte de sa main et attaque avec ces créatures disponibles.


                // Un truc un peu moche que j'ai pensé par contre: Étant donné que pour l'instant, les joueurs n'ont pas de points de vie, que les créatures peuvent
                // attaquer le tour ou elles sont jouées et ne peuvent pas contre-attaquer, si le ''vrai joueur'' commence la partie,
                //  il n'est pas grandement incité à joueur une créature. Un joueur smart va surment simplement passer son tour. Bref, à discuter.
    })


    return (
        <div className="game-mainContainer"> {/* Container principal du jeu */}
            <div className="game-botHand"> {/* Main du bot */}
                    <div className="game-botCard">carte 1</div>   
                    <div className="game-botCard">carte 2</div> 
                    <div className="game-botCard">carte 3</div> 
                    <div className="game-botCard">carte 4</div>  
            </div> 
            
            <div className="game-botZone"> {/* Container de la zone de jeu du bot */}
                <div>
                    <div className="game-deck">zone deck</div> {/* Deck du bot */}
                    <div className="game-graveyard">zone cimetiere</div> {/* Cimetiere du bot */}
                </div>
                <div className="game-botField"> {/* Zone pour les créatures du joueur */}
                    <div className="game-botFieldCard">Créature 1</div>
                    <div className="game-botFieldCard">Créature 2</div>
                    <div className="game-botFieldCard">Créature 3</div>
                    <div className="game-botFieldCard">Créature 4</div>
                    <div className="game-botFieldCard">Créature 1</div>
                    <div className="game-botFieldCard">Créature 2</div>
                    <div className="game-botFieldCard">Créature 123</div>
                    <div className="game-botFieldCard">Créature 123</div>
                    <div className="game-botFieldCard">Créature 1810</div>
                    <div className="game-botFieldCard">Créature 123</div>
                    <div className="game-botFieldCard">Créature 123</div>
                </div> 
            </div> 


            <div className="game-playerZone">{/* Container de la zone de jeu du joueur */}
                <div className="game-playerField"> {/* Zone pour les créatures du joueur */}
                    <div className="game-playerFieldCard">Créature 1</div>
                    <div className="game-playerFieldCard">Créature 2</div>
                    <div className="game-playerFieldCard">Créature 3</div>
                    <div className="game-playerFieldCard">Créature 4</div>
                    <div className="game-playerFieldCard">Créature 1</div>
                    <div className="game-playerFieldCard">Créature 2</div>
                    <div className="game-playerFieldCard">Créature 123</div>
                    <div className="game-playerFieldCard">Créature 123</div>
                    <div className="game-playerFieldCard">Créature 1810</div>
                    <div className="game-playerFieldCard">Créature 123</div>
                    <div className="game-playerFieldCard">Créature 123</div>
                </div>
                <div>
                    <div className="game-graveyard">zone cimetiere</div> {/* Cimetiere du joueur */}
                    <div className="game-deck">zone deck</div> {/* Deck du joueur */}
                </div>
            </div> 

            <div className="game-playerHand">{/* Main du joueur */}
                    <div className="game-playerCard">carte 1</div>   
                    <div className="game-playerCard">carte 1</div> 
                    <div className="game-playerCard">carte 1</div> 
                    <div className="game-playerCard">carte 1</div>  
            </div> 
        </div>
    );
}

export default Game