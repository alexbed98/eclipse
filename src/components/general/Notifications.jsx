import "../../css/notifications.css";

function Notifications({ NumeroNotification }) {

    let message = "";
    let notificationType = "";

    switch (NumeroNotification) {
        case 1:
            message = "Carte ajoutée au deck!";
            notificationType = "success";
            break;

        case 2:
            message = "Carte retirée du deck!";
            notificationType = "success";
            break;

        case 3:
            message = "Impossible d'ajouter la carte. Il y a déjà deux copies de cette carte dans le deck.";
            notificationType = "error";
            break;

        case 4:
            message = "Impossible d'ajouter la carte. Votre deck a atteint le maximum de cartes (20)";
            notificationType = "error";
            break;

        case 5:
            message = "Impossible d'ajouter la carte. Vous n'avez pas suffisamment de copies de cette carte dans votre collection.";
            notificationType = "error";
            break;

        default:
            message = "";
    }

    return (
        <div
            className={`notification ${notificationType}`}
            role={notificationType === "error" ? "alert" : "status"}
        >
            <span aria-hidden="true">
                {notificationType === "success" ? "✓" : "⚠"}
            </span>
            <span>{message}</span>
        </div>
    );
}

export default Notifications;