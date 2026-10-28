import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import Card from '../components/general/Card';
import Specs from '../components/general/Specs';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

import '../css/details.css';
import '../css/cards.css';
import '../css/sell.css';
import '../css/modalBox.css';
import '../css/notif.css';

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { player, loading: authLoading } = useAuth();
  const [saleMode, setSaleMode] = useState(false);
  const [saleQty, setSaleQty] = useState(1);
  const [salePrice, setSalePrice] = useState(10);

  const { notification, showNotification } = useNotification();

  const onClickSell = async () => {
    setSaleMode(true);
  };

  const onClickCancel = async () => {
    setSaleMode(false);
    setSaleQty(1);
    setSalePrice(10);
  };

  const onClickConfirm = async () => {
    const price = salePrice;
    const qty = saleQty;

    if (!price || price <= 0) {
      showNotification("Le prix doit être supérieur à 0", "error");
      return
    }

    try {
      const response = await fetch(`${API_URL}/market/sell`, {
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

      showNotification("Mise en vente effectuée avec succès!", "success");
      setSaleMode(false);

      if (card.quantite <= qty) {
        navigate('/inventory');
      }
    }
    catch (err) {
      console.error("Erreur: ", err);
      showNotification("Erreur lors de la vente", "error");
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
    fetch(`${API_URL}/inventory/details/${id}/${player.id}`)
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
  }, [id, saleMode]);

  if (loading) return <p>Chargement des détails...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!card) return <p>Aucune carte trouvée.</p>;

  return (
    <div className='details-container'>

      {/* banniere de notification */}
      {notification && (
        <div className={`notif-banner ${notification.type}`}>
          {notification.text}
        </div>
      )}

      <div className='details-left'>
        <Card card={card} />
      </div>

      <div className='details-right'>
        <Specs card={card} onClick={onClickSell} />
      </div>

      {saleMode && (
        <div className='modal-box'>
          <div className='modal-content'>
            <h2>Mise en vente</h2>
            <div className='sell-input'>
              <label htmlFor='qty-input'>Quantité à mettre en vente:</label>
              <input
                id='qty-input'
                type='number'
                min='1'
                max={card.quantite}
                value={saleQty}
                onChange={(e) => {
                  const newQty = Number(e.target.value);
                  if (newQty >= 1 && newQty <= card.quantite) {
                    setSaleQty(newQty);
                  }
                }}
              />
            </div>
            <div className='sell-input'>
              <label htmlFor='price-input'>Prix unitaire:</label>
              <input
                id='price-input'
                type='number'
                min='1'
                max='9999'
                value={salePrice}
                onChange={(e) => {
                  const newPrice = Number(e.target.value);
                  if (newPrice >= 1 && newPrice <= 9999) {
                    setSalePrice(newPrice);
                  }
                }}
              />
            </div>
            <div className='button-box'>
              <button className='cancel-button' onClick={onClickCancel}>
                Annuler
              </button>
              <button className='confirm-button' onClick={onClickConfirm}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;