import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/deckDetails.css'
import '../css/decks.css';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

import { GoSearch } from "react-icons/go";
import { useState, useEffect, useMemo } from 'react';
import { filterCards, sortCards, sortByOwned } from '../utils/helpers';
import Notifications from '../components/general/notifications';


function DeckDetails(){
    const { id } = useParams();
    const { player, loading: authLoading } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([])
    const [listeCartes, setListeCartes] = useState([]);
    const [numeroNotification, setNumeroNotification] = useState(0);
    const [notificationId, setNotificationId] = useState(0);
    const [deckName, setDeckName] = useState("");
    const [interfaceDelete, setInterfaceDelete] = useState(false);
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState('rarity-asc');
    const [ownershipFilter, setOwnershipFilter] = useState('owned');
    const [raritiesFilters, setRaritiesFilters] = useState([1, 2, 3, 4, 5]);
    const [seriesFilters, setSeriesFilters] = useState(['anges', 'dragons', 'zombies', 'goblins']);
    const [search, setSearch] = useState('');
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }
    
    const sortedCards = useMemo(() => {
        const filtered = filterCards(cards, seriesFilters, raritiesFilters, search);
        const sorted = sortCards(filtered, sortBy);
    
        return sortByOwned(sorted, ownershipFilter);
    }, [cards, seriesFilters, raritiesFilters, ownershipFilter, sortBy, search]);


    const fetchDeck = () => {
        fetch(`${API_URL}/deckDetails/${player.id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Problème lors du chargement de la collection');
            }
            return response.json();
        })
        .then((data) => {
            setCards(data);
        })
        .catch((error) => {
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        fetch(`${API_URL}/deckDetails/name/${id}`)
        .then((response) => {
            if(!response.ok)
                throw new Error("Erreur lors de la récupération des informations du deck")
            return response.json();
        })
        .then((data) =>{
            setDeckName(data);
        })
        .catch((error) => {
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    })

    // useEffect qui get la liste des decks du joueur au chargement de la page - utilisation de fetchDeck.
    useEffect(() => {
        if (authLoading) return;

        if (!player) {
            setLoading(false);
            return;
        }
        setLoading(true);
        fetchDeck();
    }, [player, authLoading]);

    // Ici on fetch la liste des cartes du deck.
    // On peut l'utiliser lorsque la liste de cartes change (ex: après avoir ajouté/retiré une carte - voir handleCard pour un exemple)
    const fetchListeCartes = () => {
        fetch(`${API_URL}/deck/cartes/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Problème lors du chargement du deck");
                }
                return response.json();
            })
            .then((data) => {
                setListeCartes(data);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    // useEffect qui gère l'affichage des cartes lors du chargement de la page.
    useEffect(() => {
        fetchListeCartes();
    }, [id])

    // Ajouter une carte à un deck
    const handleAddCard = (element) => {
        fetch(`${API_URL}/deck/cartes/${element.id}/${id}`)
        .then((response) => {
            return response.json().then((data) => {
                if(!response.ok){
                    throw new Error(data.code);
                }
            })  
        })
        .then(() => {
            fetchListeCartes()
            afficherNotification(1);
        })
        .catch((error) => {
            switch (error.message) {
                case "MAX_COPIES":
                    afficherNotification(3);
                    break;

                case "DECK_FULL":
                    afficherNotification(4);
                    break;
                
                case "INSUFFICIENT_COPIES":
                    afficherNotification(5);
                    break;
            }
        });
    }

    // Retirer une carte d'un deck
    const handleRemoveCard = (element) => {
        fetch(`${API_URL}/deck/cartes/retirer/${element.id_carte}/${id}`)
        .then((response) => {
            if(!response.ok){
                throw new Error("Problème survenu lors de l'action pour retirer une carte");
            }
            return response.json();
        })
        .then(() => {
            fetchListeCartes()
            afficherNotification(2);
        })
        .catch((error) => {
            setError(error.message);
        });
    }

    // Pour faire apparaître l'interface pour delete un deck
    const handleInterfaceDelete = () => {
        if(!interfaceDelete)
            setInterfaceDelete(true);
        else{
            setInterfaceDelete(false);
        }
    }

    // Pour delete un deck
    const handleDelete = () => {
        fetch(`${API_URL}/deckDetails/delete/${id}`)
            .then((response) => {
                if(!response.ok)
                    throw new Error("Erreur lors de l'effacement du deck.");
                return response.json();
            })
            .then((data) => {
                console.log(data.message);
                navigate('/decks')
            })
            .catch((error) => {
                console.error(error);
                setError("Impossible d'effacer le deck.");
        });
    }

    // Redirige l'utilisateur vers la page de deck - Utilisé lorsqu'on veut delete un deck
    const handleNavigationDeck = () => {
        navigate('/decks');
    }

    // useEffect qui gère les notifications (durée)
    useEffect(() => {
        if(numeroNotification === 0)
            return;

        const timer = setTimeout(() => {
            setNumeroNotification(0);
        }, 3000);

        return () => clearTimeout(timer);

    }, [numeroNotification, notificationId])


    function afficherNotification(numero) {
        setNumeroNotification(numero);
        setNotificationId(id => id + 1);
    }

    if (loading) return <p>Chargement des cartes</p>;

    return (
        <div>
            {numeroNotification !== 0 && (
                <Notifications NumeroNotification={numeroNotification}/>
            )}
            <div id='deckDetails-title-container'>
                <div>Page de détails du deck: {deckName.nom}!</div>
                <button className='profile-button' onClick={handleNavigationDeck}>Sauvegarder et retour à la page des decks</button>
                <button className='profile-button' onClick={handleInterfaceDelete}>Effacer le deck</button>
                {interfaceDelete && (
                    <div className='deck-overlay'>
                        <div className="deck-modal">
                        <h2>Voulez-vous vraiment effacer votre deck?</h2>
                        <button className='profile-button' onClick={handleDelete}>Effacer</button>
                        <button className='profile-button' onClick={handleInterfaceDelete}>Annuler</button>
                    </div>
                    </div>
                )}
            </div>
            <div id='deckDetails-main-container'>
                <div id='deckDetails-search-card'>
                          <div className="sort-container">
                            <div className="search-box">
                              <GoSearch size={20} color={'grey'} className='search-icon'/>
                              <input
                                type="search"
                                id="search"
                                name="search"
                                placeholder="Rechercher une carte de votre collection"
                                value={search}
                                onChange={handleSearchChange}
                              />
                            </div>
                        </div>
                    {sortedCards.map((element, index) => (
                        <div key={element.id || index} className='deckDetails-collection-cards-container'>
                            <img  className='deckDetails-collection-cards' src={`/cards/${element.id}.png`}></img>
                            <div>
                                <button className='deckDetails-overlay-button1' onClick={() => handleAddCard(element)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div id='deckDetails-card-list'>
                    {listeCartes.map((element, index) => (
                        <div key={element.id_carte || index} className='deckDetails-deck-cards-container'>
                            {Array.from({ length: element.quantite || 1 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    style={{ 
                                        position: i === 0 ? 'relative' : 'absolute',
                                        top: `${i * 25}px`,
                                        left: `${i * 0}px`,
                                        zIndex: i
                                    }}>
                                    <img 
                                        className='deckDetails-card' 
                                        src={`/cards/${element.id_carte}.png`}
                                        alt={`Carte ${element.id_carte}`}
                                    />
                                    {i === (element.quantite || 1) - 1 && (
                                        <button className='deckDetails-overlay-button2' onClick={() => handleRemoveCard(element)}>-</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) 
}

export default DeckDetails