import '../css/inventory.css';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getSerie, filterCards, sortCards, sortByOwned } from '../utils/helpers';

function Inventory() {
  const { player, loading: authLoading } = useAuth();
  const [cards, setCards] = useState([]);
  const [sortBy, setSortBy] = useState('rarity-asc');
  const [filters, setFilters] = useState(['anges', 'dragons', 'zombies', 'goblins']);
  const [search, setSearch] = useState('')
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

  // pour changer le trie (rarete, nom)
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  }

  // pour changer les filtres (series)
  const handleFilterChange = (e) => {
    if (!filters.includes(e.target.value)) {
      setFilters([...filters, e.target.value]);
    }
    else {
      setFilters(filters.filter(f => f !== e.target.value));
    }
  }

  // pour changer le texte de recherche (nom de la carte)
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  // on utiliser les fonctions de triage et de filtrage de helper.js
  const sortedCards = useMemo(() => {
    const filtered = filterCards(cards, filters, search);
    const sorted = sortCards(filtered, sortBy);

    return sortByOwned(sorted);
  }, [cards, filters, sortBy, search]);

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
      <div className='filter-container'>
        <h3>Filter:</h3>
        <div className='filter-input'>
          <input type='checkbox' id='anges' name='filter' value='anges'
            checked={filters.includes('anges')} onChange={handleFilterChange} />
          <label htmlFor='anges'>Anges</label>
        </div>
        <div className='filter-input'>
          <input type='checkbox' id='dragons' name='filter' value='dragons'
            checked={filters.includes('dragons')} onChange={handleFilterChange} />
          <label htmlFor='dragons'>Dragons</label>
        </div>
        <div className='filter-input'>
          <input type='checkbox' id='zombies' name='filter' value='zombies'
            checked={filters.includes('zombies')} onChange={handleFilterChange} />
          <label htmlFor='zombies'>Zombies</label>
        </div>
        <div className='filter-input'>
          <input type='checkbox' id='goblins' name='filter' value='goblins'
            checked={filters.includes('goblins')} onChange={handleFilterChange} />
          <label htmlFor='goblins'>Goblins</label>
        </div>
      </div>
      <div className='search-container'>
          <label htmlFor="gsearch"><h3>Rechercher: </h3></label>
          <input type="search" id="gsearch" name="gsearch" onChange={handleSearchChange} />
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