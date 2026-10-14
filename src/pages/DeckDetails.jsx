import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../css/deckDetails.css'

function DeckDetails(){
    const { id } = useParams();
    const { player, loading: authLoading } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([])
    const [listeCartes, setListeCartes] = useState([]);

    useEffect(() => {
        if (authLoading) return;

        if (!player) {
        setLoading(false);
        return;
        }

        setLoading(true);

        fetch(`http://localhost:5000/api/deckDetails/${player.id}`)
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
            console.error("Erreur: ", error);
            setError(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [player, authLoading]);



    useEffect(() => {
        fetch(`http://localhost:5000/api/deck/cartes/${id}`)
        .then((response) => {
            if(!response.ok)
                throw new Error("big lol");
            return response.json();

        })
        .then((data) => {
            setListeCartes(data)
        })
        .finally(() =>{
            setLoading(false);
        })
    }, [])


    const handleClick = () => {
  
    }


if (loading) return <p>Chargement des cartes</p>;
if (error) return <p>Erreur : {error}</p>;

    return (
        <div>
            <div id='deckDetails-title-container'>
                <div>Page de détails du deck {id}!</div>
                <button>Bouton confirmer changements / création</button>
                <button>Bouton delete deck</button>
            </div>

            <div id='deckDetails-main-container'>
                <div id='deckDetails-search-card'>
                    <p>zone pour ajouter, retirer et rechercher les cartes de l'inventaire du joueur.</p>
                    <br />
                    <div> barre de recherche ici</div>
                    <br />
                    {cards.map((element, index) => (
                        <img key={index} className='deckDetails-collection-cards' src={`/cards/${element.id}.png`}></img>
                    ))}
                </div>

                <div id='deckDetails-card-list'>
                    {listeCartes.map((element, index) => (
                        <img key={index} className='deckDetails-card' src={`/cards/${element.id_carte}.png`}></img>
                    ))}
                </div>
            </div>
            


        </div>
    )

    
}

export default DeckDetails