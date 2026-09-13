

function Player({player}){

    if (!player) {
        return <div>Chargement des donnees du joueur...</div>
    }

    return (
        <div>joueur connecté: {player.alias}</div>
    );
}
 
export default Player