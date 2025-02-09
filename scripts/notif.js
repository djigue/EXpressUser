/**
 * @function createNotification
 * @description Crée et affiche une notification sur la page avec un message et un type spécifié (success ou error).
 * @param {string} message - Le message à afficher dans la notification.
 * @param {string} type - Le type de notification ('success' ou 'error'). Détermine la couleur de la notification.
 */
function createNotification(message, type) {
    // Récupère l'élément de notifications dans le DOM
    const notifications = document.getElementById('notifications');
    
    // Vérifie si l'élément #notifications existe. Si non, affiche une erreur dans la console.
    if (!notifications) {
        console.error("L'élément #notifications est introuvable !");
        return;
    }

    // Crée une nouvelle div pour la notification
    const notification = document.createElement('div');
    notification.style.padding = '10px'; // Ajoute du padding pour rendre la notification plus lisible
    notification.style.marginBottom = '10px'; // Espace entre les notifications
    notification.style.borderRadius = '5px'; // Coins arrondis
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // Ombre pour l'effet visuel
    notification.style.color = '#fff'; // Définit la couleur du texte en blanc
    notification.style.backgroundColor = type === 'success' ? 'green' : 'red'; // Change la couleur de fond en fonction du type
    notification.textContent = message; // Définit le texte de la notification

    // Ajoute la notification à l'élément #notifications
    notifications.appendChild(notification);

    // Supprime la notification après 3 secondes
    setTimeout(() => {
        notifications.removeChild(notification);
    }, 3000);
}

// Expose la fonction createNotification à la fenêtre pour qu'elle soit accessible globalement
window.createNotification = createNotification;

/**
 * @function window.onload
 * @description Fonction exécutée lors du chargement complet de la page. Affiche les notifications flash s'il y en a.
 * @param {Object} flash - Objet contenant les messages de notification. Peut contenir des propriétés success ou error.
 */
window.onload = function () {
    // Affiche un message dans la console pour indiquer que le script a été chargé
    console.log("notif.js chargé avec succès");
    console.log("Contenu de flash dans notif.js :", flash); // Affiche le contenu de l'objet flash dans la console

    // Si un message de succès existe dans l'objet flash, affiche une notification de type success
    if (flash.success) {
        createNotification(flash.success, 'success');
    }

    // Si un message d'erreur existe dans l'objet flash, affiche une notification de type error
    if (flash.error) {
        createNotification(flash.error, 'error');
    }
};
