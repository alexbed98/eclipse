import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../hooks/useNotification';
import { Link } from 'react-router-dom';
import { GoSearch } from "react-icons/go";
import { filterSales, sortSales } from '../utils/helpers';
import Sale from '../components/general/Sale';
import Radio from '../components/inputs/Radio';

const API_URL = import.meta.env.VITE_API_URL;

import '../css/market.css';
import '../css/modalBox.css';
import '../css/notif.css';

function Market() {
    const { player, refreshPlayer, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [error, setError] = useState(null);

    const [sortBy, setSortBy] = useState('price-asc');
    const [search, setSearch] = useState('');
    const [ownershipFilter, setOwnershipFilter] = useState('not-owned');

    const [selectedSale, setSelectedSale] = useState(null);
    const [buyQty, setBuyQty] = useState(1);

    const [selectedRemove, setSelectedRemove] = useState(null);
    const [removeQty, setRemoveQty] = useState(1);

    const { notification, showNotification } = useNotification();


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

    const handleRemove = async (sale) => {
        setSelectedRemove(sale);
        setRemoveQty(1);
    }

    const executeRemove = async () => {
        const saleId = selectedRemove.id_sale;
        try {
            const response = await fetch(`${API_URL}/market/${saleId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors du retrait de la carte du marché");
            }

            showNotification("Retrait effectué avec succès!", "success");
            await fetchMarket();
        }
        catch (err) {
            console.error("Erreur: ", err);
            showNotification("Erreur lors du retrait", "error");
        }
        finally {
            setSelectedRemove(null);
            setRemoveQty(1);
        }
    }

    const handleBuy = (sale) => {
        setSelectedSale(sale);
        setBuyQty(1);
    }

    const executeBuy = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/market/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    saleId: selectedSale.id_sale,
                    quantity: buyQty
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de l'achat");
            }

            showNotification("Achat effectué avec succès!", "success");
            await fetchMarket();
            await refreshPlayer();
        }
        catch (err) {
            console.error("Erreur:", err);
            showNotification("Erreur lors de l'achat", "error");
        }
        finally {
            setSelectedSale(null);
            setBuyQty(1);
        }
    }

    // on utiliser les fonctions de triage et de recherche de helper.js
    const sortedSales = useMemo(() => {
        const filtered = filterSales(sales, search, ownershipFilter, player?.id);
        const sorted = sortSales(filtered, sortBy);
        return sorted
    }, [sales, sortBy, search, ownershipFilter]);

    const fetchMarket = async () => {
        try {
            const response = await fetch(`${API_URL}/market`);
            if (!response.ok) throw new Error('Erreur lors du chargement du marché');
            const data = await response.json();
            setSales(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (authLoading) return;
        fetchMarket();
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

            {/* banniere de notification */}
            {notification && (
                <div className={`notif-banner ${notification.type}`}>
                    {notification.text}
                </div>
            )}



            {/* barre de recherche & tri */}
            <div className="sort-container">

                <div className='market-banner-container'>
                    <h1 className='market-banner-title'>Bienvenue sur le marché</h1>
                    <p className='market-banner-text'>Achetez et vendez des cartes entre joueurs.</p>
                </div>

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
                                onClick={() => isOwner ? handleRemove(sale) : handleBuy(sale)}
                            />
                        );
                    })
                )}
            </div>

            {selectedSale && (
                <div className='modal-box'>
                    <div className='modal-content'>
                        <div className='buy-infos'>
                            <h3>Achat de carte</h3>
                            <p>Carte: {selectedSale.card_name}</p>
                            <p>Vendeur: {selectedSale.seller_username}</p>
                            <p>Prix unitaire: {selectedSale.sale_price} pièces</p>
                            <p>Quantité disponible: {selectedSale.sale_qty}</p>
                        </div>

                        <div className='buy-input'>
                            <label htmlFor='qty-input'>Quantité désirée</label>
                            <input
                                id='qty-input'
                                type='number'
                                min='1'
                                max={selectedSale.sale_qty}
                                value={buyQty}
                                onChange={(e) => {
                                    const newQty = Number(e.target.value);
                                    if (newQty >= 1 && newQty <= selectedSale.sale_qty) {
                                        setBuyQty(newQty);
                                    }
                                }}
                            />
                        </div>

                        <div className='buy-infos'>
                            <p>Prix total: {buyQty * selectedSale.sale_price} pièces</p>
                        </div>

                        <div className='button-box'>
                            <button className='cancel-button' onClick={() => setSelectedSale(null)}>
                                Annuler
                            </button>
                            <button className='confirm-button' onClick={executeBuy}>
                                Acheter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedRemove && (
                <div className='modal-box'>
                    <div className='modal-content'>
                        <div>
                            <h3>Êtes-vous certain de vouloir retirer cette carte du marché?</h3>
                        </div>
                        <div className='button-box'>
                            <button className='cancel-button' onClick={() => setSelectedRemove(null)}>
                                Annuler
                            </button>
                            <button className='confirm-button' onClick={executeRemove}>
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Market