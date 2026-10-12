import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/general/Card';
import Specs from '../components/general/Specs';
import { useAuth } from '../context/AuthContext';

import '../css/details.css';
import '../css/cards.css';
import '../css/sell.css';

function Details() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { player, loading: authLoading } = useAuth();
  const [showInterface, setShowInterface] = useState(false);
  const [saleQty, setSaleQty] = useState(1);
  const [salePrice, setSalePrice] = useState(10);

  const onClickSell = async () => {
    setShowInterface(true);
  };

  const onClickCancel = async () => {
    setShowInterface(false);
    setSaleQty(1);
    setSalePrice(10);
  };

  const onClickConfirm = async () => {
    const price = salePrice;
    const qty = saleQty;

    if (!price || price <= 0){
      alert("Le prix doit être supérieur à 0.");
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/market/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          joueur: player.id,
          carte: card.id,
          quantiteAjoutee: qty,
          nouveauPrix: price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise en vente");
      }

      alert("Carte(s) mise(s) en vente avec succès!");
      setShowInterface(false);

    }
    catch (err) {
      console.error("Erreur: ", err);
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleQtyChange = (e) => {
    const qty = e.target.value;
    if (qty > 0 && qty <= card.quantite)
      setSaleQty(qty);
  };

  const handlePriceChange = (e) => {
    const price = e.target.value;
    if (price === '' || (price >= 0 && price <= 9999))
      setSalePrice(price);
  };

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
        <Card card={card} />
      </div>

      <div className='details-right'>
        <Specs card={card} onClick={onClickSell} showButton={showInterface} />
        {showInterface && (
          <div className='sell-interface'>
            <div className='interface-row'>
              <label>Quantité: </label>
              <input type='number' value={saleQty} onChange={handleQtyChange} />
            </div>
            <div className='interface-row'>
              <label>Prix: </label>
              <input type='number' value={salePrice} onChange={handlePriceChange} />
            </div>
            <div className='interface-row'>
              <button className='button-confirm' onClick={onClickConfirm}>Mettre en vente</button>
              <button className='button-cancel' onClick={onClickCancel}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;