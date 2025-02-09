const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * @function
 * @brief Génère une liste d'annonces sous forme de code HTML.
 * @param {Array} items Liste des objets d'annonces à afficher.
 * Chaque objet d'annonce devrait contenir les propriétés suivantes : titre, categorie, description, images.
 * @param {string} actionPath Chemin d'action pour le formulaire de soumission. Ce chemin détermine l'URL d'action (par exemple, pour valider une annonce).
 * @param {string} buttonText Texte à afficher sur le bouton de validation de chaque annonce.
 * @returns {string} Retourne une chaîne HTML qui représente la liste des annonces à afficher.
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
                        <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600">${buttonText}</button>
                    </form>
                </div>
            </div>
        `).join('')}
        </div>`;
}

/**
 * @function
 * @brief Affiche la vue pour l'administration des annonces à valider.
 * @param {Array} annoncesvalFinal Liste des annonces qui doivent être validées.
 * Chaque annonce doit contenir des informations telles que le titre, la catégorie, la description et les images.
 * @param {Object} flash Objet contenant des messages de notification à afficher, comme des messages de succès ou d'erreur.
 * @param {string} role Le rôle de l'utilisateur, utilisé pour personnaliser l'affichage de l'en-tête.
 * @returns {string} Retourne une chaîne HTML qui représente la page d'administration pour valider les annonces.
 */
function showAdminAnnonceval(annoncesFinal, flash, role) {
    let html = `${headerView(role)} <!-- Affiche l'en-tête selon le rôle de l'utilisateur -->
               <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
               <script>
                  const flash = {
                    success: "${flash.success || ''}",
                    error: "${flash.error || ''}"
                  };
               </script>
               <script src="/scripts/notif.js"></script> <!-- Script pour les notifications -->
               <div class="min-h-screen bg-zinc-200 py-10">
                 <div class="container mx-auto px-4">
                   <h1 class="text-3xl font-bold text-center mb-8">Supprimer une annonce</h1>
                   <section>`;

    // Si aucune annonce n'est à valider, affiche un message indiquant qu'il n'y en a pas
    if (annoncesFinal.length === 0) {
        html += `
          <div class="bg-white shadow-md rounded-lg p-6 text-center">
            <p class="text-gray-700">Il n'y a aucune annonce à supprimer.</p>
          </div>`;
    } else {
        // Affiche la liste des annonces à valider en utilisant la fonction generateList
        html += `${generateList(annoncesFinal, '/supprimer-annonce', 'Supprimer')}`;
    }

    html += `
                   </section>
                 </div>
               </div>
               ${footerView()}`; // Affiche le pied de page

    return html; // Retourne le code HTML généré
}

// Exporte la fonction pour qu'elle puisse être utilisée ailleurs dans l'application
module.exports = showAdminAnnonceval;
