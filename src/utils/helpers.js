export const getRarity = (id_rarete) => {
    switch (id_rarete) {
        case 1: return  'Commune';
        case 2: return  'Rare';
        case 3: return  'Épique';
        case 4: return  'Légendaire';
        case 5: return  'Mythique';
        default: return 'Inconnue';
    }
};

export const getSerie = (id_serie) => {
    switch (id_serie) {
        case 1: return  'Anges';
        case 2: return  'Dragons';
        case 3: return  'Zombies';
        case 4: return  'Goblins';
        default: return 'Inconnue';
    }
};

// filtre les cartes par filtre de serie et par texte de recherche
export function filterCards(cards, seriesFilters, raritiesFilters, search = '') {
    const cleanSearch = search.trim().toLowerCase();

    return cards.filter((card) => {
        const serie = getSerie(card.id_serie);
        const matchSerie = seriesFilters.includes(serie?.toLowerCase());
        const matchRarity = raritiesFilters.includes(card.id_rarete);
        const matchSearch = cleanSearch === '' || card.nom?.toLowerCase().includes(cleanSearch);

        return matchSerie && matchSearch && matchRarity;
    });
}

// tri les cartes selon le tri choisi
export function sortCards(cards, sortBy) {
    return [...cards].sort((a, b) => {
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
    })
}

// tri les cartes en mettant les cartes possedees en premier
export function sortByOwned(cards, ownershipFilter) {
    const owned = cards.filter((c) => c.quantite > 0);
    const notOwned = cards.filter((c) => c.quantite === 0);

    if (ownershipFilter == 'owned') return owned
    else if (ownershipFilter == 'not-owned') return notOwned
    else return cards;
}

// filtre les ventes par texte de recherche
export function filterSales(sales, search, ownershipFilter, playerId) {
    const cleanSearch = search.trim().toLowerCase();

    const filteredSales = sales.filter((sale) => {
        return cleanSearch === '' || sale.card_name?.toLowerCase().includes(cleanSearch);
    });

    const owned = filteredSales.filter((c) => c.id_seller === playerId);
    const notOwned = filteredSales.filter((c) => c.id_seller !== playerId);

    if (ownershipFilter == 'owned') return owned
    else if (ownershipFilter == 'not-owned') return notOwned
    else return filteredSales;
}

// tri les ventes selon le tri choisi
export function sortSales(sales, sortBy) {
    return [...sales].sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return a.sale_price - b.sale_price;
            case "price-desc":
                return b.sale_price - a.sale_price;
            case "name-asc":
                return a.card_name.localeCompare(b.card_name);
            case "name-desc":
                return b.card_name.localeCompare(a.card_name);
            default:
                return 0;
        }
    })
}