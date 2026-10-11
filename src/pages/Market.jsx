import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GoSearch } from "react-icons/go";
import { filterSales, sortSales } from '../utils/helpers';
import Sale from '../components/general/Sale'
import '../css/market.css'

function Market() {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [error, setError] = useState(null);

    const [sortBy, setSortBy] = useState('price-asc');
    const [search, setSearch] = useState('');

    // pour changer le tri (prix, nom)
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    }

    // pour changer le texte de recherche (nom de la carte)
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    // on utiliser les fonctions de triage et de recherche de helper.js
    const sortedSales = useMemo(() => {
        const filtered = filterSales(sales, search);
        const sorted = sortSales(filtered, sortBy);

        return sorted
    }, [sales, sortBy, search]);

    useEffect(() => {

        setLoading(true);

        fetch(`http://localhost:5000/api/market`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Problème lors du chargement du marché');
                }
                return response.json();
            })
            .then((data) => {
                setSales(data);
            })
            .catch((error) => {
                console.error("Erreur: ", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Chargement du marché...</p>;
    if (error) return <p>Erreur : {error}</p>;

    const sortByList = [
        { id: 'price-asc', label: 'Prix (Croissant)' },
        { id: 'price-desc', label: 'Prix (Décroissant)' },
        { id: 'name-asc', label: 'Nom (A à Z)' },
        { id: 'name-desc', label: 'Nom (Z à A)' },
    ]

    return (
        <div className='market-container'>
            <h1 className='page-title'>Marché</h1>

            {/* barre de recherche & tri */}
            <div className="sort-container">
                <div className="search-box">
                    <GoSearch size={20} color={'grey'} className='search-icon' />
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

            <div className='market-grid'>
                {sortedSales.length === 0 ? (
                    <p>Aucune carte en vente pour l'instant</p>
                ) : (
                    sortedSales.map((sale) => (
                        <Sale key={sale.id_sale} sale={sale} />
                    ))
                )}
            </div>


        </div>
    );
}

export default Market