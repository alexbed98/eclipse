import { getRarity, getSerie } from '../../utils/helpers';
import Card from '../general/Card'
import '../../css/sales.css'
import '../../css/specs.css'

function Sale({ sale, isConnected=false, isOwner=false, onClick }) {
    const cardData = {
        id: sale.id_card,
        id_rarete: sale.id_rarity,
        nom: sale.card_name
    }

    const buttonClass = isOwner ? "remove-button" : "buy-button";
    const buttonText = isOwner ? "Retirer du marché" : "Acheter";

    return (
        <div className='sale-container'>
            <div className='card-container'>
                <Card card={cardData} />
            </div>
            <div className='infos-container'>
                <p className='card-title'>{sale.card_name}</p>
                <div className='infos-box'>
                    <p className='infos-label'>Vendeur:</p>
                    <p className='infos-value'>{sale.seller_username}</p>
                </div>
                <div className='infos-box'>
                    <p className='infos-label'>Série:</p>
                    <p className='infos-value'>{getSerie(sale.id_serie)}</p>
                </div>
                <div className='infos-box'>
                    <p className='infos-label'>Rareté:</p>
                    <p className={`infos-value text-rarity-${sale.id_rarity}`}>{getRarity(sale.id_rarity)}</p>
                </div>
                <div className='infos-box'>
                    <p className='infos-label'>Prix:</p>
                    <p className='infos-value'>{sale.sale_price} pièces</p>
                </div>
                <div className='infos-box'>
                    <p className='infos-label'>Quantité:</p>
                    <p className='infos-value'>{sale.sale_qty}</p>
                </div>

                {isConnected && (
                    <div className='button-container'>
                        <button className={buttonClass} onClick={onClick}>
                            {buttonText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sale;