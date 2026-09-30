import '../../css/cards.css';

function Card({ card }) {
    return (
        <img 
            className={`card rarity-${card.id_rarete}`} 
            src={`/cards/${card.id}.png`} 
            alt={card.nom}
        />
    );
}

export default Card;