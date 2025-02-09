const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * @function
 * @brief Génère une liste d'annonces HTML.
 * @param {Array} items Liste des annonces à afficher.
 * @param {string} actionPath Chemin d'action pour la soumission du formulaire (par exemple, validation d'annonce).
 * @param {string} buttonText Texte du bouton à afficher dans le formulaire.
 * @returns {string} Retourne un code HTML pour afficher la liste d'annonces.
 */
function generateList(items, actionPath, buttonText) {
    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${items.map(item => `
            <div class="bg-white shadow-lg rounded-lg p-6">
                <h3 class="text-xl font-semibold mb-2">${item.titre}</h3>
                <p class="text-gray-600 mb-4">Catégorie : ${item.categorie}</p>
                <p class="text-gray-700 mb-4">${item.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${item.images && item.images.length > 0 
                        ? item.images.map(image => `
                            <img src="/images/${image}" alt="Image de l'annonce" class="w-24 h-24 object-cover rounded-md">
                        `).join('') 
                        : '<p>Aucune image</p>'
                    }
                </div>
                <div class="flex justify-between">
                    <form method="POST" action="${actionPath}/${item.id}" style="display:inline;">
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">${buttonText}</button>
                    </form>
                </div>
            </div>
        `).join('')}
        </div>`;
}

/**
 * @function
 * @brief Affiche la vue pour l'administration des annonces à valider.
 * @param {Array} annoncesvalFinal Liste des annonces à valider.
 * @param {Object} flash Objet contenant les messages de notification (succès ou erreur).
 * @param {string} role Rôle de l'utilisateur (utilisé pour afficher l'en-tête).
 * @returns {string} Retourne le code HTML pour afficher la page des annonces à valider.
 */
function showAdminAnnonceval(annoncesvalFinal, flash, role) {
    let html = `${headerView(role)}
               <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
               <script>
                  const flash = {
                    success: "${flash.success || ''}",
                    error: "${flash.error || ''}"
                  };
               </script>
               <script src="/scripts/notif.js"></script>
               <div class="min-h-screen bg-zinc-200 py-10">
                 <div class="container mx-auto px-4">
                   <h1 class="text-3xl font-bold text-center mb-8">Valider une annonce</h1>
                   <section>`;

    // Si aucune annonce à valider
    if (annoncesvalFinal.length === 0) {
        html += `
          <div class="bg-white shadow-md rounded-lg p-6 text-center">
            <p class="text-gray-700">Il n'y a aucune annonce à valider.</p>
          </div>`;
    } else {
        // Affiche les annonces à valider
        html += `${generateList(annoncesvalFinal, '/valider-annonce', 'Valider')}`;
    }

    html += `
                   </section>
                 </div>
               </div>
               ${footerView()}`;

    return html;
}

// Exporte la fonction pour l'utiliser ailleurs dans l'application
module.exports = showAdminAnnonceval;
