function createNotification(message, type) {
    const notifications = document.getElementById('notifications');
    if (!notifications) {
        console.error("L'élément #notifications est introuvable !");
        return;
    }

    const notification = document.createElement('div');
    notification.style.padding = '10px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.color = '#fff';
    notification.style.backgroundColor = type === 'success' ? 'green' : 'red';
    notification.textContent = message;

    notifications.appendChild(notification);

    setTimeout(() => {
        notifications.removeChild(notification);
    }, 3000);
}

window.createNotification = createNotification;

window.onload = function () {
    console.log("notif.js chargé avec succès");
    console.log("Contenu de flash dans notif.js :", flash);

    if (flash.success) {
        createNotification(flash.success, 'success');
    }

    if (flash.error) {
        createNotification(flash.error, 'error');
    }
};
