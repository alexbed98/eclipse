import { getRarity, getSerie } from '../../utils/helpers';
import { Sword, Shield } from 'lucide-react';

import '../../css/specs.css'

function Specs({ card }) {

    if (!card) {
        return <div className='specs-container'>Chargement...</div>;
    }

    return (
        <div>
            <div className='specs-container'>
                <h2 className='title'>{card.nom}</h2>

                <div className='stat'>
                    <span className='stat-label'>Attaque : </span>
                    <span className='stat-value'>{card.attaque}</span>
                    <Sword size={20} className='stat-icon icon-sword'/>
                </div>

                <div className='stat'>
                    <span className='stat-label'>Défense :</span>
                    <span className='stat-value'>{card.defense}</span>
                    <Shield size={20} className='stat-icon icon-shield'/>
                </div>

                <div className='stat'>
                    <span className='stat-label'>Série :</span>
                    <span className='stat-value'>{getSerie(card.id_serie)}</span>
                </div>

                <div className='stat'>
                    <span className='stat-label'>Rareté :</span>
                    <span className={`stat-value text-rarity-${card.id_rarete}`}>
                        {getRarity(card.id_rarete)}
                    </span>
                </div>

                <div className='stat'>
                    <span className='stat-label'>Quantité possédée :</span>
                    <span className='stat-value'>{card.quantite ?? 0}</span>
                </div>

                {card.quantite > 0 && <button className='button-sell'>Vendre</button>}
            </div>
        </div>
    );
}

export default Specs