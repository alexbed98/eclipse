import '../css/about.css'

function About() {
    return (
        <div className="about-container">

            {/* banniere nom et logo (backcard) */}
            <div className='about-header'>
                <div className='header-text'>
                    <h1 className='header-title'>Éclipse</h1>
                    <p className='header-subtext'>Collectionnez, échangez et combattez</p>
                </div>

                <div className='about-card-preview'>
                    <img
                        className="card-game card-shadow"
                        src={`/cards/backDesign.jpg`}
                        alt='backCard' />
                    <img
                        className="card-game card-shadow"
                        src={`/cards/30.png`}
                        alt='backCard' />
                    <img
                        className="card-game card-shadow"
                        src={`/cards/104.png`}
                        alt='backCard' />
                    <img
                        className="card-game card-shadow"
                        src={`/cards/90.png`}
                        alt='backCard' />
                </div>
            </div>

            <div className='about-grid'>
                <div className='about-info-card'>
                    <span className='info-label'>Membres de l'équipe</span>
                    <div className='info-value'>Alex Bédard & Louis-James Leroux</div>
                </div>

                <div className='about-info-card'>
                    <span className='info-label'>Superviseur du projet</span>
                    <div className='info-value'>Joan-Sébastien Morales</div>
                </div>
            </div>

            <div className='about-description-box'>
                <h2 className='description-heading'>À propos du projet</h2>
                <div className='description-body'>
                    <p>
                        ÉCLIPSE est un site web sur lequel des joueurs peuvent s’inscrire pour acheter des cartes numériques à collectionner et jouer contre un ordinateur. Les joueurs peuvent acheter des paquets de cartes dans le magasin, ce qui leur donneras aléatoirement un certain nombre d’une rareté variée. Les nouvelles cartes obtenues seront ajoutées à l’inventaire du joueur et pourrons être utilisées dans un deck pour jouer. Chaque joueur peut mettre en vente des cartes de sa collection dans un marché. Ce marché est accessible par tous les joueurs pour acheter et vendre des cartes. Le site comprend un système de monnaie virtuelle achetable dans le magasin et obtenable gratuitement en petite quantité lors de victoire. Le site comprend une interface de jeu dans laquelle on joue contre un ordinateur avec notre deck de carte. C’est un jeu de carte en tour par tour dans lequel chaque carte à des statistiques qui définisse sa force d’attaque, de défense, etc. Le but du jeu est d’éliminer toutes les cartes de l’adversaire.
                    </p>
                </div>
            </div>
        </div >
    );
}

export default About