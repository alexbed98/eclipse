import '../css/shop.css'
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

function Shop() {   
    const {player, loading: authLoading, currency, setCurrency} = useAuth();
    const [booster, setBooster] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [prix, setPrix] = useState(null);
    const [focus, setFocus] = useState(null);
    const carouselRef = useRef(null);
    const [showInterface, setShowInterface] = useState(false);
    const [cardsObtained, setCardsObtained] = useState([]);

    const acheterBooster = async () => {
        if(!player){
            alert("Veuillez vous connecter")
            return;
        }

        try{
            const response = await fetch(`http://localhost:5000/api/shop/${player.id}/${prix}/${focus}`)
            const data = await response.json();

            if(!data.success){
                alert(data.message);
                return;
            }

            setCurrency(data.updatedCurrency);
            setCardsObtained(data.cardsObtained)
            setShowInterface(true);

        }
        catch(error){
            console.error("Erreur lors de l'achat :", error);
            alert("Une erreur est survenue lors de l'achat.");
        }
    }

    const handleClick = (param) => {
        setPrix(param.prix);
        setFocus(param.id);
    }

    useEffect(() => {
        fetch(`http://localhost:5000/api/shop`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des boosters');
                }

                return response.json();
            })
            .then((data) => {
                setBooster(data);
                setPrix(data[0].prix)

            })
            .catch((error) => {
                console.error("Erreur: ", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if(!loading && focus === null){
        setFocus(booster[0].id)
    }

    const scrollRight = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const product = carousel.querySelector(".shop-booster");
        if (!product) return;
        
        const gap = parseFloat(getComputedStyle(carousel).gap);
        const distance = product.offsetWidth + gap;

        carousel.scrollBy({
            left: distance,
            behavior: "smooth"
        });

        if(focus < booster.length){
            const newFocus = focus + 1;
            setFocus(newFocus);
            setPrix(booster[focus].prix)
        }
    };

    const scrollLeft = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        const product = carousel.querySelector(".shop-booster");
        if (!product) return;
        const gap = parseFloat(getComputedStyle(carousel).gap);
        const distance = product.offsetWidth + gap;

        carousel.scrollBy({
            left: -distance,
            behavior: "smooth"
        });

        if(focus !== 1){
            const newFocus = focus - 1;
            setFocus(newFocus);
            setPrix(booster[newFocus - 1].prix);
        }
    };

    if (loading) return <p>Chargement du magasin</p>;
    if (error) return <p>Erreur: {error}</p>;

    return (
        <div>
            <h1>Bienvenue dans le magasin</h1>
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
                        <button className='shop-button' onClick={() => {setShowInterface(false)}}>
                            Fermer
                        </button>
                    </div>     
                </div>
            )}
            <button id='shop-carousel-left-button' onClick={scrollLeft}>←</button>
            <div id="shop-carousel" ref={carouselRef}>
                {booster.length === 0 ? (
                    <p>Erreur lors du chargement du magasin</p>) : (
                        booster.map((element, index) => (
                            <img src={`/boosters/${element.id}.png`} className={`shop-booster ${element.id === focus ? 'shop-highlight': ''}`}
                                key={`${element.id}-${index}`} onClick={() => handleClick(element)}
                            />
                        ))
                    )
                }
            </div>
            <button id='shop-carousel-right-button' onClick={scrollRight}>→</button>
            <div id='shop-container-buy'>
                <div id='shop-currency'>
                    <p>{prix} pièces</p>
                </div>
                <button className='shop-button' onClick={acheterBooster}>
                    Acheter
                </button>
            </div>
        </div>
    );
}

export default Shop;