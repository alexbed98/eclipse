import '../css/shop.css'
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';

function Shop() {   

    const {player, loading: authLoading} = useAuth();
    const [booster, setBooster]  = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [prix, setPrix] = useState(null)
    
    const handleClick = (param) => {
        setPrix(param.prix)
    }

    useEffect(()=> {
        
        fetch(`http://localhost:5000/api/shop`)
            .then((response) => {
                if(!response.ok){
                    throw new Error('Erreur lors du chargement des boosters')
                }
                return response.json();
            })
            .then((data) => {
                setBooster(data);
            })
            .catch((error) => {
                console.error("Erreur: ", error);
                setError(error.message);
            })
            .finally(() =>{
                setLoading(false);
            });
    }, []);


    if(loading) return <p>Chargement du magasin</p>
    if(error) return <p>Erreur: {error}</p>

    return (
        <div>
            <h1>Bienvenue dans le magasin</h1>
            <br />
            <div id="shop-container">
                {booster.length === 0 ? (<p> Erreur lors du chargement du magasin</p>):(
                    booster.map((element, index) => (
                        <button key={element.id || index} onClick={() => handleClick(element)}>
                            <div  className='shop-booster'>
                                <p>{element.nom}</p>
                            </div>
                        </button>
                    ))
                )}
            </div>
            <div id='shop-container-buy'>
                <div id='shop-currency'>
                    <p>{prix}</p> 
                    {prix !== null ? (<p>$</p>): (<p>Veuillez choisir un paquet!</p>)}
                </div>
                <button id='shop-buy-button'>Acheter</button>
            </div>

        </div>
    )}




export default Shop