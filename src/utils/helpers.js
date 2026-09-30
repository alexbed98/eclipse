export const getRarity = (id_rarete) => {
    switch (id_rarete) {
        case 1:
            return 'Commune';
        case 2:
            return 'Rare';
        case 3:
            return 'Épique';
        case 4:
            return 'Légendaire';
        case 5:
            return 'Mythique';
        default:
            return 'Inconnue';
    }
}

export const getSerie = (id_serie) => {
    switch (id_serie) {
        case 1:
            return 'Anges';
        case 2:
            return 'Dragons';
        case 3:
            return 'Zombies';
        case 4:
            return 'Goblin';
        default:
            return 'Inconnue';
    }
}