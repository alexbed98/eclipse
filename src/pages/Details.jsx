import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/general/Card';
import Specs from '../components/general/Specs';

import '../css/details.css';
import '../css/cards.css';

function Details() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {player, loading: authLoading} = useAuth();

  useEffect(() => {
    fetch(`http://localhost:5000/api/inventory/details/${id}/${player.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails');
        }
        return response.json();
      })
      .then((data) => {
        setCard(data);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement des détails...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!card) return <p>Aucune carte trouvée.</p>;

  return (
    <div className='details-container'>
      <div className='details-left'>
        <Card card={card}/>
      </div>

      <div className='details-right'>
        <Specs card={card}/>
      </div>
    </div>
  );
}

export default Details;