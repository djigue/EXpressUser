/**
 * @function getCookie
 * @description Fonction pour obtenir la valeur d'un cookie par son nom (id).
 * @param {string} id - Le nom du cookie à récupérer.
 * @returns {string|null} - La valeur du cookie ou null si le cookie n'est pas trouvé.
 */
function getCookie(id) {
    const value = '; ' + document.cookie;  // Ajouter un préfixe pour faciliter la recherche
    const parts = value.split('; ' + id + '=');  // Séparer la chaîne en utilisant le nom du cookie
    if (parts.length === 2) {  // Si le cookie existe
        return parts.pop().split(';').shift();  // Retourner la valeur du cookie
    }
    return null;  // Si le cookie n'existe pas, retourner null
}

/**
 * @description Ajouter un gestionnaire d'événements pour chaque formulaire avec un id commençant par "panier-".
 * Cet événement empêche le comportement par défaut, récupère les données du formulaire et envoie une requête pour ajouter un produit au panier.
 */
document.querySelectorAll('form[id^="panier-"]').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Empêcher le comportement par défaut du formulaire

        const formData = new FormData(this);  // Récupérer les données du formulaire
        const user_id = getCookie('id');  // Récupérer l'id de l'utilisateur depuis le cookie
        const produit_id = formData.get('produit_id');  // Récupérer l'id du produit depuis les données du formulaire
        const quantite = parseInt(formData.get('quantite'));  // Récupérer la quantité et la convertir en entier

        // Vérifier si l'utilisateur est connecté
        if (!user_id) {
            alert("Utilisateur non connecté. Veuillez vous connecter.");
            window.location.href = '/login';  // Rediriger vers la page de connexion
            return;
        }

        // Vérifier si la quantité est valide
        if (quantite <= 0 || isNaN(quantite)) {
            alert('Veuillez entrer une quantité valide.');
            return;
        }

        // Envoyer la requête POST pour ajouter le produit au panier
        fetch('/panier', {
            method: 'POST',
            body: JSON.stringify({ user_id, produit_id, quantite }),  // Les données à envoyer au serveur
            headers: {
                'Content-Type': 'application/json',  // Spécifier que le corps de la requête est en JSON
                'Accept': 'application/json'  // Spécifier que la réponse attendue est en JSON
            },
            credentials: 'include'  // Inclure les cookies pour gérer l'authentification
        })
        .then(response => {
            console.log("Statut de la réponse :", response.status);  // Afficher le statut de la réponse
            console.log("Type de contenu :", response.headers.get('Content-Type'));  // Afficher le type de contenu de la réponse
            return response.text();  // Retourner le corps de la réponse sous forme de texte
        })
        .then(text => {
            console.log("Réponse brute :", text);  // Afficher la réponse brute
            return JSON.parse(text);  // Convertir la réponse en JSON
        })
        .then(data => {
            console.log("Données reçues :", data);  // Afficher les données reçues
            if (data.success) {
                alert('Produit ajouté au panier avec succès !');
            } else {
                alert(data.message || 'Une erreur est survenue.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);  // Afficher l'erreur si la requête échoue
            alert('Erreur lors de l\'ajout au panier.');
        });
    });
});
