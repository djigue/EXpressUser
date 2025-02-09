const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * @function elecView
 * @brief Génère la page des annonces électroniques, avec une liste d'annonces et des options d'ajout au panier.
 * @param {Array} annonces Liste des annonces à afficher, contenant des objets avec des informations sur chaque annonce.
 * @param {Object} [flash={}] Messages flash facultatifs (succès ou erreur) à afficher sur la page.
 * @param {string} role Le rôle de l'utilisateur, utilisé pour afficher l'en-tête approprié.
 * @returns {string} Retourne une chaîne HTML représentant la page avec les annonces électroniques.
 */
function elecView(annonces, flash = {}, role) {
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
                    <h1 class="text-3xl font-bold text-center mb-8">Annonces Electroniques</h1>
                    <a href="/annonce" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Grille des annonces -->
    `;

    // Parcours des annonces pour générer chaque élément
    annonces.forEach(annonce => {
        const { annonce_id, titre, categorie, description, prix, images = [] } = annonce;
        html += `
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="p-4">
                    <h2 class="text-xl font-bold text-gray-800">${titre || 'Titre indisponible'}</h2>
                    <h3 class="text-sm text-gray-500">Catégorie: ${categorie || 'Non spécifiée'}</h3>
                </div>
                <div class="w-full h-48 bg-gray-100 flex items-center justify-center">
                    ${images.length > 0 
                        ? `<img src="/images/${images[0]}" alt="Image de l'annonce ${titre || ''}" class="object-cover h-full w-full">`
                        : '<p class="text-gray-500">Aucune image disponible</p>'
                    }
                </div>
                <div class="p-4">
                    <p class="text-gray-700">${description || 'Description indisponible'}</p>
                    <p class="text-lg font-semibold text-indigo-600 mt-2">${prix ? `${prix} €` : 'Prix non spécifié'}</p>
                    <div class="mt-4 flex justify-between items-center">
                        <!-- Lien pour voir les détails de l'annonce -->
                        <a href="/annonce-voir/${annonce.annonce_id}?categorie=${encodeURIComponent(categorie || '')}" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Voir</a>
                        <!-- Formulaire d'ajout au panier -->
                        <form id="panier-${annonce_id}" action="/panier" method="POST" class="flex items-center">
                            <input type="hidden" name="annonces_id" value="${annonce_id}">
                            <label for="quantite-${annonce_id}" class="text-gray-600 mr-2">Quantité :</label>
                            <input id="quantite-${annonce_id}" type="number" name="quantite" value="1" min="1" class="w-16 border-gray-300 rounded">
                            <button type="submit" class="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Ajouter au panier</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    });

    // Si aucune annonce n'est trouvée
    if (annonces.length === 0) {
        html += `<p class="text-center text-gray-600">Aucune annonce trouvée.</p>`;
    }

    html += `
                </div>
            </div>
        </div>
        ${footerView()} <!-- Pied de page -->
    `;
    return html; // Retourne le HTML généré pour la page des annonces électroniques
}

module.exports = elecView; // Exporte la fonction pour l'utiliser ailleurs dans l'application
