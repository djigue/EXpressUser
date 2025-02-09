// Importation des vues d'entête et de pied de page
const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * Génère la vue pour la page des annonces de loisirs.
 * @param {Array} annonces - Tableau d'annonces à afficher, chaque annonce ayant des propriétés telles que titre, description, etc.
 * @param {Object} [flash={}] - Objet contenant les messages flash pour les notifications (succès ou erreur).
 * @param {string} role - Le rôle de l'utilisateur (admin, user, etc.) utilisé pour personnaliser l'entête de la page.
 * @returns {string} HTML généré pour la page des annonces de loisirs.
 */
function loisirsView(annonces, flash = {}, role) {
    // Initialisation du HTML avec l'entête dynamique basée sur le rôle de l'utilisateur
    let html = `${headerView(role)}
        <div class="bg-zinc-200 min-h-screen py-8">
            <div id="notifications" class="fixed top-4 right-4 z-50 max-w-xs"></div>
            <script>
                // Initialisation des messages flash pour les notifications
                const flash = {
                    success: "${flash.success || ''}",
                    error: "${flash.error || ''}"
                };
            </script>
            <!-- Inclusion du script pour gérer les notifications -->
            <script src="/scripts/notif.js"></script>
            
            <div class="container mx-auto">
                <!-- Titre et lien pour revenir en arrière -->
                <div class="flex flex-col items-center mb-4">
                    <h1 class="text-3xl font-bold text-center mb-8">Annonces Loisirs</h1>
                    <a href="/annonce" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>
                </div>
                <!-- Grid pour afficher les annonces -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    // Parcours du tableau d'annonces pour générer le HTML pour chaque annonce
    annonces.forEach(annonce => {
        const { annonce_id, titre, categorie, description, prix, images = [] } = annonce;
        html += `
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="p-4">
                    <h2 class="text-xl font-bold text-gray-800">${titre || 'Titre indisponible'}</h2>
                    <h3 class="text-sm text-gray-500">Catégorie: ${categorie || 'Non spécifiée'}</h3>
                </div>
                <!-- Image de l'annonce -->
                <div class="w-full h-48 bg-gray-100 flex items-center justify-center">
                    ${images.length > 0 
                        ? `<img src="/images/${images[0]}" alt="Image de l'annonce ${titre || ''}" class="object-cover h-full w-full">`
                        : '<p class="text-gray-500">Aucune image disponible</p>'
                    }
                </div>
                <!-- Description et prix de l'annonce -->
                <div class="p-4">
                    <p class="text-gray-700">${description || 'Description indisponible'}</p>
                    <p class="text-lg font-semibold text-indigo-600 mt-2">${prix ? `${prix} €` : 'Prix non spécifié'}</p>
                    <div class="mt-4 flex justify-between items-center">
                        <!-- Lien vers la page de détail de l'annonce -->
                        <a href="/annonce-voir/${annonce.annonce_id}?categorie=${encodeURIComponent(categorie || '')}" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Voir</a>
                        <!-- Formulaire pour ajouter l'annonce au panier -->
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

    // Si aucune annonce n'est trouvée, afficher un message
    if (annonces.length === 0) {
        html += `<p class="text-center text-gray-600">Aucune annonce trouvée.</p>`;
    }

    // Fin du grid et du contenu de la page, ajout du pied de page
    html += `
                </div>
            </div>
        </div>
        ${footerView()}
    `;
    
    // Retourner le HTML généré
    return html;
}

// Exportation de la fonction loisirsView pour l'utiliser ailleurs dans l'application
module.exports = loisirsView;
