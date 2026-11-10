import '../css/shop.css'
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

function Shop() {
    const { player, refreshPlayer, authLoading } = useAuth();
    const [boosters, setBoosters] = useState([]);
    const [selectedBooster, setSelectedBooster] = useState(null);
    const [nouveauBooster, setNouveauBooster] = useState();
    const [cardsObtained, setCardsObtained] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInterface, setShowInterface] = useState(false);
    const [showConfirmBox, setShowConfirmBox] = useState(false);
    const carouselRef = useRef(null);

    const acheterBooster = async () => {
        if (!player) {
            alert("Veuillez vous connecter")
            return;
        }
        if (!selectedBooster) return;

        try {
            const response = await fetch(`${API_URL}/shop/${player.id}/${selectedBooster.prix}/${selectedBooster.id}`);
            const data = await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            await refreshPlayer();
            setCardsObtained(data.cardsObtained)
            setShowConfirmBox(false);
            setShowInterface(true);
        }
        catch (error) {
            console.error("Erreur lors de l'achat :", error);
            alert("Une erreur est survenue lors de l'achat.");
        }
    }

    const handleClickFocus = async (booster) => {
        setSelectedBooster(booster);
    }

    const handleClickBuy = async () => {
        setShowConfirmBox(true)
    }

    useEffect(() => {
        fetch(`${API_URL}/shop`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des boosters');
                }
                return response.json();
            })
            .then((data) => {
                setBoosters(data);
                if (data.length > 0) {
                    setSelectedBooster(data[0]);
                    setNouveauBooster(data.at(-1));
                }
            })
            .catch((error) => {
                console.error("Erreur: ", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const scrollRight = () => {
        const carousel = carouselRef.current;
        if (!carousel || boosters.length === 0) return;

        const product = carousel.querySelector(".booster-box");
        if (!product) return;

        const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
        const distance = product.offsetWidth + gap;

        carousel.scrollBy({ left: distance, behavior: "smooth" });

        const currentIndex = boosters.findIndex((b) => b.id === selectedBooster?.id);
        if (currentIndex !== -1 && currentIndex < boosters.length - 1) {
            setSelectedBooster(boosters[currentIndex + 1]);
        }
    };

    const scrollLeft = () => {
        const carousel = carouselRef.current;
        if (!carousel || boosters.length === 0) return;

        const product = carousel.querySelector(".booster-box");
        if (!product) return;

        const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
        const distance = product.offsetWidth + gap;

        carousel.scrollBy({ left: -distance, behavior: "smooth" });

        const currentIndex = boosters.findIndex((b) => b.id === selectedBooster?.id);
        if (currentIndex > 0) {
            setSelectedBooster(boosters[currentIndex - 1]);
        }
    };

    if (authLoading || loading) return <p>Chargement du magasin</p>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <div>
            {showConfirmBox && selectedBooster && (
                <div className='modal-box'>
                    <div className='modal-content'>
                        <div>
                            <h3>Êtes-vous certain de vouloir acheter un {selectedBooster.nom} pour {selectedBooster.prix} pièces?</h3>
                        </div>
                        <div className='button-box'>
                            <button className='cancel-button' onClick={() => setShowConfirmBox(false)}>
                                Annuler
                            </button>
                            <button className='confirm-button' onClick={acheterBooster}>
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='shop-banner-container'>
                <h1 className='shop-banner-title'>Bienvenue sur Eclipse</h1>
                <p className='shop-banner-text'>Combattez, collectionnez et échangez vos cartes.</p>
            </div>
            <br />
            {showInterface && (
                <div className='shop-results-overlay'>
                    <div className='shop-results'>
                        <h1>Voici les cartes que vous avez obtenues!</h1>
                        <div className='obtained-cards'>
                            {cardsObtained?.map((idCard, index) => (
                                <div className='obtained-card' key={index}>
                                    <img src={`/cards/${idCard}.png`}></img>
                                </div>
                            ))}
                        </div>
                        <button className='shop-button close-button' onClick={() => { setShowInterface(false) }}>
                            Fermer
                        </button>
                    </div>
                </div>
            )}
            <button id='shop-carousel-left-button' onClick={scrollLeft}>←</button>
            <div id="shop-carousel" ref={carouselRef}>
                {boosters.length === 0 ? (
                    <p>Erreur lors du chargement du magasin</p>) : (
                    boosters.map((element, index) => (
                        <div className='booster-box'>
                            <img
                                src={`/boosters/${element.id}.png`}
                                className={`shop-booster 
                                            ${element.id === selectedBooster?.id ? 'shop-highlight' : ''}
                                            `}
                                key={`${element.id}-${index}`}
                                onClick={() => handleClickFocus(element)}
                            />
                            <div className='booster-info'>
                                <div className='booster-name'>{element.nom}</div>
                                <div className='booster-price'>{element.prix} pièces</div>
                            </div>
                            {element.id === nouveauBooster.id && (
                                <div className='new-booster'>Nouveau!</div>
                            )}
                        </div>
                    ))
                )
                }
            </div>
            <button id='shop-carousel-right-button' onClick={scrollRight}>→</button>
            <div id='shop-container-buy'>
                {player ?
                    <button className='shop-button' onClick={handleClickBuy}>
                        Acheter
                    </button> :
                    <div className='login-message'>
                        Connectez vous pour acheter!
                    </div>
                }
            </div>
        </div>
    );
}

export default Shop;