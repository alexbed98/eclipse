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

    useEffect(() => {
        fetch(`${API_URL}/market`)
            .then(res => res.json())
            .then(data => {
                // prend les 3 cartes mises en ventes le plus recemment
                setRecentSales(data.slice(0, 3));
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement de l'accueil: ", err);
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
                    {loading ? (
                        <p>Chargement...</p>
                    ) : recentSales.length === 0 ? (
                        <p>Aucune carte pour l'instant.</p>
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
                    <Link to="/market" className='link-market'>Voir tout le marché</Link>
                </div>

                {/* nouveaute du shop (booster) */}
                <div className='home-card shop-preview'>
                    <h2>Magasin</h2>
                    <p>Découvrez les derniers boosters disponibles pour agrandir votre collection.</p>
                    <Link to="/shop" className='btn-secondary'>Visiter la boutique</Link>
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