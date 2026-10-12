import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GoSearch } from "react-icons/go";
import { filterSales, sortSales } from '../utils/helpers';
import Sale from '../components/general/Sale'
import Radio from '../components/inputs/Radio'
import '../css/market.css'

function Market() {
    const { player, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [error, setError] = useState(null);

    const [sortBy, setSortBy] = useState('price-asc');
    const [search, setSearch] = useState('');
    const [ownershipFilter, setOwnershipFilter] = useState('not-owned');

    // pour changer le tri (prix, nom)
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    }

    // pour changer le texte de recherche (nom de la carte)
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    // pour changer le filtre d'ownership
    const handleOwnerShipChange = (e) => {
        setOwnershipFilter(e.target.value);
    }

    const handleRemove = async (saleId) => {
        if(!window.confirm("Voulez-vous vraiment retirer cette carte du marché?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/market/${saleId}`,{
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message || "Erreur lors du retrait de la carte du marché");
            }

            setSales(sales.filter((sale) => sale.id_sale !== saleId));
        }
        catch (err) {
            console.error("Erreur: ", err);
            alert(`Erreur: ${err.message}`);
        }
    }

    const handleBuy = (sale) => {
        alert("buy");
    }

    // on utiliser les fonctions de triage et de recherche de helper.js
    const sortedSales = useMemo(() => {
        const filtered = filterSales(sales, search, ownershipFilter, player?.id);
        const sorted = sortSales(filtered, sortBy);
        return sorted
    }, [sales, sortBy, search, ownershipFilter]);

    useEffect(() => {
        if (authLoading) return;

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
    }, [authLoading]);

    if (loading) return <p>Chargement du marché...</p>;
    if (error) return <p>Erreur : {error}</p>;

    const sortByList = [
        { id: 'price-asc', label: 'Prix (Croissant)' },
        { id: 'price-desc', label: 'Prix (Décroissant)' },
        { id: 'name-asc', label: 'Nom (A à Z)' },
        { id: 'name-desc', label: 'Nom (Z à A)' },
    ];

    const ownershipList = [
        { id: 'not-owned', label: 'Marché publique' },
        { id: 'owned', label: 'Mes cartes en vente' },
    ];

    return (
        <div className='market-container'>

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

                {player && (
                    <div className="filter-container">
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
                )}

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
                    sortedSales.map((sale) => {
                        const isOwner = player ? sale.id_seller === player.id : false;

                        return (
                            <Sale
                                key={sale.id_sale}
                                sale={sale}
                                isConnected={player}
                                isOwner={isOwner}
                                onClick={() => isOwner ? handleRemove(sale.id_sale) : handleBuy(sale.id_sale)}
                            />
                        );
                    })
                )}
            </div>


        </div>
    );
}

export default Market