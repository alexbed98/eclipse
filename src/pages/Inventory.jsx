import '../css/inventory.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Inventory() {
  const {player, loading: authLoading } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleTilt(event){
    const element = event.currentTarget;
    const dimension = element.getBoundingClientRect();
    const x = event.clientX - dimension.left;
    const y = event.clientY - dimension.top;
    const milieuCarteX = dimension.width/2;
    const milieuCarteY = dimension.height/2;
    const rotationX = ( x - milieuCarteX) / 20;
    const rotationY = (milieuCarteY  - y) / 20;

    element.style.transform = 
    `
      perspective(800px)
      rotateX(${rotationY}deg)
      rotateY(${rotationX}deg)
      scale3d(1.05, 1.05, 1.05)
    `;

  }

  function handleMouseLeave(event){
    const element = event.currentTarget;

    element.style.transform = 
    `
      perspective(800px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1,1,1)
    `
  }

  useEffect(() =>{
    if(authLoading) return;
    
    if(!player){
        setLoading(false);
        return;
    }

    fetch(`http://localhost:5000/api/collection/${player.id}`)
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

  if (authLoading || loading) return <p>Chargement de l'inventaire...</p>;
  if (!player) return <p>Veuillez vous connecter pour voir votre inventaire.</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div id="inventory-container">
      {cards.length === 0 ? (
        <p>Aucun objet dans votre collection.</p>
      ) : (
        cards.map((element, index) => (
          <Link key={element.id || index} className={`card ${element.quantite < 1 ? 'non-obtenu' : ''}`} to={`details/${element.id}`} onMouseMove={handleTilt} onMouseLeave={handleMouseLeave}>
            <img src={`/cards/${element.id}` + ".png"}></img>
          </Link>
        ))
      )}
    </div>
  );
}
export default Inventory