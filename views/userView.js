// Importation des vues d'entête et de pied de page
const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * Génère la vue pour la page utilisateur, affichant les informations de l'utilisateur et ses annonces.
 * @param {Object} user - L'objet utilisateur contenant ses informations (par exemple, username et id).
 * @param {Array} annoncesArray - Tableau d'annonces à afficher.
 * @param {Object} [flash={}] - Objet contenant les messages flash pour les notifications (succès ou erreur).
 * @param {string} role - Le rôle de l'utilisateur (admin, user, etc.) utilisé pour personnaliser l'affichage.
 * @returns {string} HTML généré pour la page utilisateur.
 */
function userView(user, annoncesArray, flash = {}, role) {
    // Début de la construction du HTML pour la vue utilisateur
    let html = `
      ${headerView(role)} <!-- Inclusion de l'entête avec le rôle de l'utilisateur -->
      <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div> <!-- Section pour les notifications -->
      <script>
        // Initialisation des messages flash pour les notifications
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
      </script>
      <script src="/scripts/notif.js"></script> <!-- Inclusion du script pour gérer les notifications -->
    `;

    // Si l'utilisateur est 'user' ou 'admin', afficher un message de bienvenue avec l'ID utilisateur
    if (role === 'user' || role === 'admin') {
        html += ` 
          <h1 class="text-2xl font-bold mb-4 text-center">Bienvenue, ${user.username}!</h1>
          <p class="text-gray-700 mb-6 text-center">ID utilisateur : <span class="font-semibold">${user.id}</span></p>
        `;
    }

    // Ajout des annonces dans un layout en grille
    html += `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Génération des annonces -->
        ${annoncesArray.map(annonce => `
            <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start space-y-4">
                <strong class="text-xl font-semibold">${annonce.titre}</strong>
                <h2 class="text-sm text-gray-500">Catégorie : ${annonce.categorie}</h2>
                <div class="images-container flex space-x-4 mb-4 flex-wrap gap-2">
                    <!-- Génération des images de l'annonce -->
                    ${annonce.images.map(image => `
                        <img src="/images/${image}" alt="Image de l'annonce ${annonce.titre}" class="max-w-[150px] rounded-lg shadow">
                    `).join('')}
                </div>
                <p class="text-gray-700">${annonce.description}</p>
                <span class="text-lg font-medium text-green-600">${annonce.prix} €</span>
                <!-- Bouton 'Voir' pour les rôles 'admin' et 'user' -->
                ${role === 'admin' || role === 'user' ? 
                    `<a href="/annonce-voir/${annonce.id}">
                        <button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Voir
                        </button>
                    </a>` : ''
                }
            </div>`).join('')}
        
        <!-- Afficher un message si aucune annonce n'est trouvée -->
        ${annoncesArray.length === 0 ? '<p class="text-center text-gray-500">Aucune annonce trouvée.</p>' : ''}
    </div>
    </div>
  </div>
  ${footerView()} <!-- Inclusion du pied de page -->
  `;
  
  return html;
}

// Exportation de la fonction userView pour l'utiliser ailleurs dans l'application
module.exports = userView;
