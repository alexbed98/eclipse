import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../css/home.css';
import '../css/marketCarousel.css';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
    const { player } = useAuth();
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);

    // index de la carte affichee dans le carousel
    const [cardIndex, setCardIndex] = useState(0);

    // le booster le plus recent a afficher
    const [latestBooster, setLatestBooster] = useState(null);

    // fetch market
    useEffect(() => {
        fetch(`${API_URL}/market`)
            .then(res => res.json())
            .then(data => {

                console.log("Données du marché reçues :", data);
                let notOwnedSales = data;

                if (player) {
                    // on prend seulement les ventes qui ne sont pas ceux du joueur connecte
                    notOwnedSales = data.filter((sale) => sale.id_seller !== player.id)
                }

                // prend les 5 cartes mises en ventes le plus recemment
                setRecentSales(notOwnedSales.slice(0, 5));
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement de l'accueil: ", err);
                setLoading(false);
            });
    }, [player]);

    // fetch shop
    useEffect(() => {
        fetch(`${API_URL}/shop`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    // recupere le dernier booster ajouter
                    setLatestBooster(data[data.length - 1]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement du magasin: ", err);
                setLoading(false);
            });
    }, []);

    // change de carte a toute les 8 secondes dans le carousel
    useEffect(() => {
        if (recentSales.length <= 1) return;

        const interval = setInterval(() => {
            setCardIndex((prevIndex) => (prevIndex + 1) % recentSales.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [recentSales]);

    const hideNotif = () => {
        alert('notif efface!');
    }

    // carte affichee dans le carousel
    const currentSale = recentSales[cardIndex];

    return (
        <div className='home-container'>
            {/* titre et banniere */}
            <div className='banner-container'>
                <h1 className='banner-title'>Bienvenue sur Eclipse {player?.alias}</h1>
                <p className='banner-text'>Combattez, collectionnez et échangez vos cartes.</p>
            </div>

            {/* grille principale*/}
            <div className='home-grid'>

                {/* nouveaute du market (carousel de carte) */}
                <div className='home-card market-preview'>
                    <h2>Nouveautés du Marché</h2>
                    <p>Soyez les premiers à découvrir ces nouvelles vente de carte sur le marché.</p>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : recentSales.length === 0 ? (
                        <p>Aucune contenu pour l'instant.</p>
                    ) : (
                        <div className='market-carousel'>
                            <img
                                src={`/public/cards/${currentSale.id_card}.png`}
                                alt={currentSale.card_name}
                                className='card-img'
                            />
                            <div className='card-info'>
                                <span className='card-name'>{currentSale.card_name}</span>
                                <span className='card-seller'>Vendeur: {currentSale.seller_username}</span>
                                <span className='card-price'>Prix: {currentSale.sale_price} pièces</span>
                            </div>
                        </div>


                    )}
                    <Link to="/market" className='link-home'>Visiter le marché</Link>
                </div>

                {/* nouveaute du shop (booster) */}
                <div className='home-card shop-preview'>
                    <h2>Nouveauté du Magasin</h2>
                    <p>Découvrez la nouvelle serie de boosters disponible maintenant dans le magasin.</p>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : !latestBooster ? (
                        <p>Aucun booster disponible.</p>
                    ) : (
                        <div className='market-carousel'>
                            <img
                                src={`/public/boosters/${latestBooster.id}.png`}
                                alt={latestBooster.nom}
                                className='booster-img'
                            />
                            <div className='card-info'>
                                <span className='card-name'>{latestBooster.nom || latestBooster.name}</span>
                                <span className='card-seller new-booster'>------------------------------------------------</span>
                                <span className='card-price'>Prix: {latestBooster.prix || latestBooster.price} pièces</span>
                            </div>
                        </div>
                    )}
                    <Link to="/shop" className='link-home'>Visiter la boutique</Link>
                </div>

                {/* notifications (si connecté) */}
                {player && (
                    <div className='home-card notifications-box'>
                        <h2>Notifications</h2>
                        <div className='notif-box'>
                            {/* systeme de notif a faire */}
                            <div className='notif'>
                                <div className='notif-text'>Ex: Votre carte 'Golbin Fou' a ete achetée 25 pièces par 'Walter White'!</div>
                                <button className='notif-button' onClick={hideNotif}>X</button>
                            </div>
                            <div className='notif'>
                                <div className='notif-text'>Ex: Votre carte 'Dragon Rouge' a ete achetée 350 pièces par 'Jesse Pinkman'!</div>
                                <button className='notif-button' onClick={hideNotif}>X</button>
                            </div>
                            <div className='notif'>
                                <div className='notif-text'>Ex: Votre carte 'Ange Ultime' a ete achetée 215 pièces par 'Saul Goodman'!</div>
                                <button className='notif-button' onClick={hideNotif}>X</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* lien vers le jeu */}
                <div className='home-card game-preview'>
                    <h2>Prêt à jouer ?</h2>
                    {player ? (
                        <Link to="/game" className='btn-primary'>Lancez une partie</Link>
                    ) : (
                        <Link to="/login" className='btn-primary'>Connectez-vous pour jouer</Link>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Home