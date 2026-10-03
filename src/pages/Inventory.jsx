import '../css/inventory.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Inventory() {
  const { player, loading: authLoading } = useAuth();
  const [cards, setCards] = useState([]);
  const [sortBy, setSortBy] = useState('rarity-asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleTilt(event) {
    const element = event.currentTarget;
    const dimension = element.getBoundingClientRect();
    const x = event.clientX - dimension.left;
    const y = event.clientY - dimension.top;
    const milieuCarteX = dimension.width / 2;
    const milieuCarteY = dimension.height / 2;
    const rotationX = (x - milieuCarteX) / 20;
    const rotationY = (milieuCarteY - y) / 20;

    element.style.transform =
      `
      perspective(800px)
      rotateX(${rotationY}deg)
      rotateY(${rotationX}deg)
      scale3d(1.05, 1.05, 1.05)
    `;

  }

  function handleMouseLeave(event) {
    const element = event.currentTarget;

    element.style.transform =
      `
      perspective(800px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1,1,1)
    `
  }

  // fonction pour changer le filtre
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  }

  function getSortedCards() {
    const cardsSorted = [...cards].sort((a, b) => {
      switch (sortBy) {
        case "rarity-asc":
          return a.id_rarete - b.id_rarete;
        case "rarity-desc":
          return b.id_rarete - a.id_rarete;
        case "name-asc":
          return a.nom.localeCompare(b.nom);
        case "name-desc":
          return b.nom.localeCompare(a.nom);
        default:
          return 0;
      }
    });

    const cardsOwned = cardsSorted.filter((c) => c.quantite > 0);
    const cardsNotOwned = cardsSorted.filter((c) => c.quantite === 0);

    return [...cardsOwned, ...cardsNotOwned];
  }


  useEffect(() => {
    if (authLoading) return;

    if (!player) {
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

  const sortedCards = getSortedCards();

  return (
    <div>
      <div className='sort-container'>
        <h3>Trier par: </h3>
        <div className='sort-input'>
          <input type='radio' id='rarity-asc' name='sort' value='rarity-asc'
            checked={sortBy === 'rarity-asc'} onChange={handleSortChange} />
          <label htmlFor='rarity-asc'>Rareté &#8593;</label>
        </div>
        <div className='sort-input'>
          <input type='radio' id='rarity-desc' name='sort' value='rarity-desc'
            checked={sortBy === 'rarity-desc'} onChange={handleSortChange} />
          <label htmlFor='rarity-desc'>Rareté &#8595;</label>
        </div>
        <div className='sort-input'>
          <input type='radio' id='name-asc' name='sort' value='name-asc'
            checked={sortBy === 'name-asc'} onChange={handleSortChange} />
          <label htmlFor='name-asc'>Nom (A&#8594;Z)</label>
        </div>
        <div className='sort-input'>
          <input type='radio' id='name-desc' name='sort' value='name-desc'
            checked={sortBy === 'name-desc'} onChange={handleSortChange} />
          <label htmlFor='name-desc'>Nom (Z&#8594;A)</label>
        </div>
      </div>
      <div id="inventory-container">
        {sortedCards.length === 0 ? (
          <p>Aucun objet dans votre collection.</p>
        ) : (
          sortedCards.map((element, index) => (
            <Link key={element.id || index} className={`card ${element.quantite < 1 ? 'non-obtenu' : ''}`} to={`details/${element.id}`} onMouseMove={handleTilt} onMouseLeave={handleMouseLeave}>
              <img src={`/cards/${element.id}` + ".png"}></img>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
export default Inventory