import Card from '../general/Card'
import '../../css/sales.css'

function Sale({ sale }) {
    const cardData = {
        id: sale.id_card, 
        id_rarete: sale.id_rarity, 
        nom: sale.card_name 
    }

    return (
        <div className='sale-container'>
            <Card card={cardData}/>
            <div className='infos-container'>
                <p className='card-title'>{sale.card_name}</p>
                <div className='infos-box'>
                    <p className='infos-label'>Vendeur:</p>
                    <p className='infos-value'>{sale.seller_username}</p>
                </div>
                <div className='infos-box'>
                    <p className='infos-label'>Prix:</p>
                    <p className='infos-value'>{sale.sale_price} pièces</p>
                </div>
                <div className='infos-box'>
                    <p className='infos-label'>Quantité:</p>
                    <p className='infos-value'>{sale.sale_qty}</p>
                </div>
            </div>
        </div>
    );
}

export default Sale;