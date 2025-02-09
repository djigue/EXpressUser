/**
 * @function getCookie
 * @description Fonction pour obtenir la valeur d'un cookie par son nom (token).
 * @param {string} token - Le nom du cookie à récupérer.
 * @returns {string|null} - La valeur du cookie ou null si le cookie n'est pas trouvé.
 */
function getCookie(token) {
    const value = `; ${document.cookie}`;  // Ajouter un préfixe pour faciliter la recherche
    const parts = value.split(`; ${token}=`);  // Séparer la chaîne en utilisant le nom du cookie
    if (parts.length === 2) return parts.pop().split(';').shift();  // Retourner la valeur du cookie
    return null;  // Si le cookie n'existe pas, retourner null
}

/**
 * @description Si un token est trouvé dans les cookies, envoyer une requête GET avec l'en-tête Authorization contenant le token.
 * Cette requête est envoyée au serveur pour récupérer les informations de l'utilisateur.
 */
if (token) {
    fetch('/user', {
        method: 'GET',  // Méthode GET pour récupérer des données
        headers: {
            'Content-Type': 'application/json',  // Spécifier que le corps de la requête est en JSON
            'Authorization': `Bearer ${token}`,  // Inclure le token d'authentification dans l'en-tête
        },
        credentials: 'include',  // Inclure les cookies pour gérer l'authentification
    })
    .then(response => response.json())  // Convertir la réponse en JSON
    .then(data => {
        // Traitement des données ici
    })
    .catch(error => {
        console.error('Erreur:', error);  // Afficher l'erreur si la requête échoue
    });
} else {
    console.log('Token non trouvé dans les cookies');  // Afficher un message si le token n'est pas trouvé
}
