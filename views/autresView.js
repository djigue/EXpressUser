const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * @function
 * @brief Génère une vue affichant une liste d'annonces "Autres" avec options de filtrage et d'ajout au panier.
 * @param {Array} annonces Liste des annonces à afficher.
 * @param {Object} flash Messages flash facultatifs (succès ou erreur).
 * @param {string} role Le rôle de l'utilisateur, utilisé pour afficher l'en-tête approprié.
 * @returns {string} Retourne une chaîne HTML représentant la page des annonces "Autres".
 */
function autresView(annonces, flash = {}, role) {
    let html = `${headerView(role)} <!-- En-tête de la page, avec le rôle de l'utilisateur -->
        <div class="bg-zinc-200 min-h-screen py-8">
            <div id="notifications" class="fixed top-4 right-4 z-50 max-w-xs"></div> <!-- Notifications -->
            <script>
                const flash = {
                    success: "${flash.success || ''}",
                    error: "${flash.error || ''}"
                };
            </script>
            <script src="/scripts/notif.js"></script> <!-- Script pour afficher les notifications -->
            <div class="container mx-auto">
            <div class="flex flex-col items-center mb-4">
                <h1 class="text-3xl font-bold text-center mb-8">Annonces Autres</h1>
                <a href="/annonce" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour </a> <!-- Lien retour -->
            </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">`;

    // Boucle pour générer une carte pour chaque annonce
    annonces.forEach(annonce => {
        const { annonce_id, titre, categorie, description, prix, images = [] } = annonce;
        html += `
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="p-4">
                    <h2 class="text-xl font-bold text-gray-800">${titre}</h2>
                    <h3 class="text-sm text-gray-500">Catégorie: ${categorie}</h3>
                </div>
                <div class="w-full h-48 bg-gray-100 flex items-center justify-center">
                    ${images.length > 0 
                        ? `<img src="/images/${images[0]}" alt="Image de l'annonce ${titre || ''}" class="object-cover h-full w-full">`
                        : '<p class="text-gray-500">Aucune image disponible</p>' // Si aucune image, afficher un message
                    }
                </div>
                <div class="p-4">
                    <p class="text-gray-700">${description || 'Description indisponible'}</p>
                    <p class="text-lg font-semibold text-indigo-600 mt-2">${prix ? `${prix} €` : 'Prix non spécifié'}</p> <!-- Affichage du prix -->
                    <div class="mt-4 flex justify-between items-center">
                        <a href="/annonce-voir/${annonce.annonce_id}?categorie=${encodeURIComponent(categorie || '')}" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Voir</a> <!-- Lien pour voir l'annonce détaillée -->
                        <form id="panier-${annonce_id}" action="/panier" method="POST" class="flex items-center">
                            <input type="hidden" name="annonces_id" value="${annonce_id}">
                            <label for="quantite-${annonce_id}" class="text-gray-600 mr-2">Quantité :</label>
                            <input id="quantite-${annonce_id}" type="number" name="quantite" value="1" min="1" class="w-16 border-gray-300 rounded"> <!-- Champ de quantité -->
                            <button type="submit" class="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Ajouter au panier</button> <!-- Bouton d'ajout au panier -->
                        </form>
                    </div>
                </div>
            </div>
        `;
    });

    // Message si aucune annonce n'est trouvée
    if (annonces.length === 0) {
        html += `<p class="text-center text-gray-600">Aucune annonce trouvée.</p>`;
    }

    // Fin de la structure HTML avec le pied de page
    html += `
                </div>
            </div>
        </div>
        ${footerView()} <!-- Pied de page -->
    `;
    return html; // Retourne le HTML généré pour la page des annonces "Autres"
}

module.exports = autresView; // Exporte la fonction pour l'utiliser ailleurs dans l'application
