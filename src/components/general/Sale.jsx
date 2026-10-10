import Card from '../general/Card'
import '../../css/sale.css';

function Sale({ sale }) {
    const cardData = {
        id: sale.id_card, 
        id_rarete: sale.id_rarity, 
        nom: sale.card_name 
    }

    return (
        <div className='sale-container'>
            <Card card={cardData}/>
            <div className='infos'>
                <p>{sale.card_name}</p>
                <p>Vendeur: {sale.seller_username}</p>
                <p>Prix: {sale.sale_price}</p>
                <p>Quantité: {sale.sale_qty}</p>
            </div>
        </div>
    );
}

export default Sale;