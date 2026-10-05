import '../../css/cards.css';

function Card({ card }) {
    return (
        <img 
            className={`card rarity-${card.id_rarete} ${card.quantite < 1 ? 'non-obtenu-details' : ''}`}
            src={`/cards/${card.id}.png`} 
            alt={card.nom}
        />
    );
}

export default Card;