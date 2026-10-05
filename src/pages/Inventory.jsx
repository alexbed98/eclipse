import '../css/inventory.css';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getSerie, filterCards, sortCards, sortByOwned } from '../utils/helpers';
import Checkbox from '../components/inputs/Checkbox';
import Radio from '../components/inputs/Radio';

function Inventory() {
  const { player, loading: authLoading } = useAuth();
  const [cards, setCards] = useState([]);
  const [sortBy, setSortBy] = useState('rarity-asc');
  const [seriesFilters, setSeriesFilters] = useState(['anges', 'dragons', 'zombies', 'goblins']);
  const [raritiesFilters, setRaritiesFilters] = useState([1, 2, 3, 4, 5]);
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

  // pour changer les filtres de series
  const handleSeriesChange = (e) => {
    if (!seriesFilters.includes(e.target.value)) {
      setSeriesFilters([...seriesFilters, e.target.value]);
    }
    else {
      setSeriesFilters(seriesFilters.filter(f => f !== e.target.value));
    }
  }

  // pour changer les filtres de rarete
  const handleRaritiesChange = (e) => {
    const rarete = Number(e.target.value)

    if (!raritiesFilters.includes(rarete)) {
      setRaritiesFilters([...raritiesFilters, rarete]);
    }
    else {
      setRaritiesFilters(raritiesFilters.filter(f => f !== rarete));
    }
  }

  // pour changer le texte de recherche (nom de la carte)
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  // on utiliser les fonctions de triage et de filtrage de helper.js
  const sortedCards = useMemo(() => {
    const filtered = filterCards(cards, seriesFilters, raritiesFilters, search);
    const sorted = sortCards(filtered, sortBy);

    return sortByOwned(sorted);
  }, [cards, seriesFilters, raritiesFilters, sortBy, search]);

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

  const seriesList = [
    { id: 'anges', label: 'Anges' },
    { id: 'dragons', label: 'Dragons' },
    { id: 'zombies', label: 'Zombies' },
    { id: 'goblins', label: 'Goblins' }
  ];

  const rarityList = [
    { id: 1, label: 'Communes' },
    { id: 2, label: 'Rares' },
    { id: 3, label: 'Épiques' },
    { id: 4, label: 'Légendaires' },
    { id: 5, label: 'Mythiques' }
  ];

  const sortByList = [
    { id: 'rarity-asc', label: 'Rareté ↑' },
    { id: 'rarity-desc', label: 'Rareté ↓' },
    { id: 'name-asc', label: 'Nom (A→Z)' },
    { id: 'name-desc', label: 'Nom (Z→A)' },
  ]

  return (
    <div>

      <div className='filter-container'>
        <h3>Filter par:</h3>

        {/* construit dynamiquement tous les options de filtre par serie */}
        <div className='filters'>
          <h4>Series</h4>
          {seriesList.map((serie) => (
            <Checkbox
              key={serie.id}
              id={`serie-${serie.id}`}
              name='serie-filter'
              value={serie.id}
              label={serie.label}
              checked={seriesFilters.includes(serie.id)}
              onChange={handleSeriesChange}
            />
          ))}
        </div>

        {/* construit dynamiquement tous les options de filtre par rarete */}
        <div className='filters'>
          <h4>Raretés</h4>
          {rarityList.map((rarity) => (
            <Checkbox
              key={rarity.id}
              id={`rarity-${rarity.id}`}
              name='rarity-filter'
              value={rarity.id}
              label={rarity.label}
              checked={raritiesFilters.includes(rarity.id)}
              onChange={handleRaritiesChange}
            />
          ))}
        </div>

      </div>

      <div className='sort-container'>
        <h3>Trier par: </h3>

        {/* construit dynamiquement tous les options de tri */}
        {sortByList.map((sort) => (
          <Radio
            key={sort.id}
            className={'sort-input'}
            id={sort.id}
            name={'sort'}
            value={sort.id}
            checked={sortBy === sort.id}
            onChange={handleSortChange}
            label={sort.label}
          />
        ))}

        <div className='search-container'>
          <label htmlFor="search"><h3>Rechercher: </h3></label>
          <input type="search" id="search" name="search" value={search} onChange={handleSearchChange} />
        </div>

      </div>

      {/* affiche dynamiquement tous les cartes selon le tri et les filtres */}
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