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

