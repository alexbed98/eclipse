import '../css/inventory.css';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { filterCards, sortCards, sortByOwned } from '../utils/helpers';
import Checkbox from '../components/inputs/Checkbox';
import Radio from '../components/inputs/Radio';
import { GoSearch } from "react-icons/go";

function Inventory() {
  const { player, loading: authLoading } = useAuth();
  const [cards, setCards] = useState([]);
  const [sortBy, setSortBy] = useState('rarity-asc');
  const [seriesFilters, setSeriesFilters] = useState(['anges', 'dragons', 'zombies', 'goblins']);
  const [raritiesFilters, setRaritiesFilters] = useState([1, 2, 3, 4, 5]);
  const [ownershipFilter, setOwnershipFilter] = useState('owned')
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

  // pour changer le filtre d'ownership
  const handleOwnerShipChange = (e) => {
    setOwnershipFilter(e.target.value);
  }

  // on utiliser les fonctions de triage et de filtrage de helper.js
  const sortedCards = useMemo(() => {
    const filtered = filterCards(cards, seriesFilters, raritiesFilters, search);
    const sorted = sortCards(filtered, sortBy);

    return sortByOwned(sorted, ownershipFilter);
  }, [cards, seriesFilters, raritiesFilters, ownershipFilter, sortBy, search]);

  useEffect(() => {
    if (authLoading) return;

    if (!player) {
      setLoading(false);
      return;
    }

    setLoading(true);

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

  const ownershipList = [
    { id: 'owned', label: 'Obtenues' },
    { id: 'not-owned', label: 'Manquantes' },
    { id: 'all', label: 'Toutes' }
  ];

  const sortByList = [
    { id: 'rarity-asc', label: 'Rareté (Commun à Mythique)' },
    { id: 'rarity-desc', label: 'Rareté (Mythique à Commun)' },
    { id: 'name-asc', label: 'Nom (A à Z)' },
    { id: 'name-desc', label: 'Nom (Z à A)' },
  ]

  return (
  <div className='inventory-container'>
    <header className="inventory-header">
      
      {/* barre de recherche & tri */}
      <div className="sort-container">
        <div className="search-box">
          <GoSearch size={20} color={'grey'} className='search-icon'/>
          <input
            type="search"
            id="search"
            name="search"
            placeholder="Rechercher une carte..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="sort-box">
          <label htmlFor="sort-select">Trier par :</label>
          <select id="sort-select" value={sortBy} onChange={handleSortChange}>
            {sortByList.map((sort) => (
              <option key={sort.id} value={sort.id}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* filtres */}
      <div className="filter-panel">
        <div className="filter-group">
          <span className="filter-label">Séries :</span>
          <div className="filter-options">
            {seriesList.map((serie) => (
              <Checkbox
                key={serie.id}
                id={`serie-${serie.id}`}
                className="filter-checkbox"
                name="serie-filter"
                value={serie.id}
                label={serie.label}
                checked={seriesFilters.includes(serie.id)}
                onChange={handleSeriesChange}
              />
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Raretés :</span>
          <div className="filter-options">
            {rarityList.map((rarity) => (
              <Checkbox
                key={rarity.id}
                id={`rarity-${rarity.id}`}
                className="filter-checkbox"
                name="rarity-filter"
                value={rarity.id}
                label={rarity.label}
                checked={raritiesFilters.includes(rarity.id)}
                onChange={handleRaritiesChange}
              />
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Possession :</span>
          <div className="filter-options">
            {ownershipList.map((ownership) => (
              <Radio
                key={ownership.id}
                id={`ownership-${ownership.id}`}
                className="filter-radio"
                name="ownership-filter"
                value={ownership.id}
                label={ownership.label}
                checked={ownershipFilter === ownership.id}
                onChange={handleOwnerShipChange}
              />
            ))}
          </div>
        </div>
      </div>
    </header>

    {/* Affichage des cartes */}
    <main className="cards-container">
      {sortedCards.length === 0 ? (
        <div className="empty-state">
          <p>Aucun objet ne correspond à vos critères.</p>
        </div>
      ) : (
        sortedCards.map((element, index) => (
          <Link
            key={element.id || index}
            className={`card rarity-${element.id_rarete} ${element.quantite < 1 ? 'non-obtenu' : ''}`}
            to={`details/${element.id}`}
            onMouseMove={handleTilt}
            onMouseLeave={handleMouseLeave}
          >
            <img src={`/cards/${element.id}.png`} alt={element.nom || 'Carte'} />
          </Link>
        ))
      )}
    </main>
  </div>
);
}
export default Inventory