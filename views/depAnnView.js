const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * @function
 * @brief Génère une vue affichant les annonces de l'utilisateur (publiées et en cours de validation).
 * @param {Array} annonces Liste des annonces publiées par l'utilisateur.
 * @param {Array} annoncesVal Liste des annonces en cours de validation.
 * @param {Object} flash Messages flash facultatifs (succès ou erreur).
 * @param {string} role Le rôle de l'utilisateur, utilisé pour afficher l'en-tête approprié.
 * @returns {string} Retourne une chaîne HTML représentant la page de gestion des annonces.
 */
function depAnnView(annonces, annoncesVal, flash = {}, role) {
    let html = `
        ${headerView(role)} <!-- En-tête de la page, avec le rôle de l'utilisateur -->
        <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div> <!-- Notifications -->
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>
    <script src="/scripts/notif.js"></script> <!-- Script pour afficher les notifications -->
    <div class="min-h-screen bg-zinc-200 py-10">
        <div class="container mx-auto px-4">
            <h2 class="text-2xl font-bold mb-6">Vos annonces</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">`;

    // Affichage des annonces publiées
    if (annonces.length === 0) {
        html += `<p class="text-gray-600 italic col-span-2">Vous n'avez publié aucune annonce</p>`;
    } else {
        annonces.forEach(annonce => {
            const images = annonce.images || []; // Vérifie si l'annonce a des images
            html += `
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-2">${annonce.titre}</h3>
                    <h2 class="text-lg font-semibold mb-2">${annonce.categorie}</h2>
                    <div class="images-container flex space-x-4 mb-4 flex-wrap gap-2">
                        ${images.map(image => `
                            <img src="/images/${image}" alt="Image de l'annonce ${annonce.titre}" class="max-w-[150px] rounded-lg shadow">
                        `).join('')}
                    </div>
                    <p class="text-gray-700 mb-4">${annonce.description}</p>
                    <p class="text-gray-900 font-bold mb-4">${annonce.prix} €</p>
                    <div class="flex space-x-4">
                        <a href="/modifier-annonce/${annonce.id}" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Modifier</a>
                        <form method="POST" action="/supprimer-annonce-user/${annonce.id}" class="inline">
                            <button type="submit" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Supprimer</button>
                        </form>
                    </div>
                </div>`;
        });
    }

    html += `
            </div>
            <h2 class="text-2xl font-bold mt-12 mb-6">Vos annonces en cours de validation</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">`;

    // Affichage des annonces en cours de validation
    if (annoncesVal.length === 0) {
        html += `<p class="text-gray-600 italic col-span-2">Vous n'avez aucune annonce en cours de validation</p>`;
    } else {
        annoncesVal.forEach(annonceVal => {
            const imagesval = annonceVal.images || []; // Vérifie si l'annonce a des images
            html += `
                <div class="bg-white shadow-md rounded-lg p-6">
                    <h2 class="text-lg font-semibold mb-2">${annonceVal.categorie}</h2>
                    <h3 class="text-lg font-semibold mb-2">${annonceVal.titre}</h3>
                    <p class="text-gray-700 mb-4">${annonceVal.description}</p>
                    <p class="text-gray-900 font-bold mb-4">${annonceVal.prix} €</p>
                    <div class="images-container flex space-x-4 mb-4 flex-wrap">
                        ${imagesval.map(imageval => `
                            <img src="/images/${imageval}" alt="Image de l'annonce ${annonceVal.titre}" class="max-w-[150px] rounded-lg shadow">
                        `).join('')}
                    </div>
                </div>`;
        });
    }

    html += `
            </div>
        </div>
    </div>
    ${footerView()} <!-- Pied de page -->
    `;
    return html; // Retourne le HTML généré pour la gestion des annonces
}

module.exports = depAnnView; // Exporte la fonction pour l'utiliser ailleurs dans l'application
