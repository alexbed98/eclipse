import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Details() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/inventory/details/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des détails");
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
    <div className="details-container">
      <h2>{card.nom}</h2>
      <p><strong>Attaque :</strong> {card.attaque}</p>
      <p><strong>Défense :</strong> {card.defense}</p>
      <p><strong>Série :</strong> {card.id_serie}</p>
      <p><strong>Rareté :</strong> {card.id_rarete}</p>
      <p><strong>Quantité :</strong> {card.quantite}</p>
    </div>
  );
}

export default Details;