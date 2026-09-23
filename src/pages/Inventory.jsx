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

    useEffect(() =>{
        if(authLoading) return;
    
        if(!player){
            setLoading(false);
            return;
        }

// Va falloir faire attention lorsqu'on va faire la transition vers le vrai serveur du prof puis modifier le localhost!
// On devrait créer une variable global et l'utiliser partout pour le  localhost sinon va fallor fix tous nos fetch à la fin = ark.
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
          <Link key={element.id || index} className={`card ${element.quantite < 1 ? 'non-obtenu' : ''}`} to={`details/${element.id}`}>
            <p>{element.nom}</p>
            <p><strong>Attaque :</strong> {element.attaque}</p>
            <p><strong>Défense :</strong> {element.defense}</p>
            <p><strong>Série :</strong> {element.id_serie}</p>
            <p><strong>Rareté :</strong> {element.id_rarete}</p>
          </Link>
        ))
      )}
    </div>
  );
}
export default Inventory