// Importation des vues d'entête et de pied de page
const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * Génère la vue de la page d'accueil avec la liste des annonces.
 * @param {Array} annoncesArray - Tableau contenant les annonces à afficher.
 * @param {Object} [flash={}] - Objet contenant les messages de notification (succès, erreur).
 * @param {string} role - Rôle de l'utilisateur (admin, user, etc.), utilisé pour afficher certains éléments conditionnels.
 * @returns {string} HTML généré pour la page d'accueil.
 */
function homeView(annoncesArray, flash = {}, role) {
    // Initialisation du contenu HTML avec l'entête dynamique (basé sur le rôle de l'utilisateur)
    let html = `${headerView(role)}
    
    <!-- Notification système -->
    <div id="notifications" class="fixed top-10 right-10 z-50 max-w-xs"></div>
    <script>
        // Initialisation des messages flash pour les notifications
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>
    <!-- Inclusion du script de gestion des notifications -->
    <script src="/scripts/notif.js"></script>
    
    <!-- Contenu principal de la page -->
    <div class="min-h-screen bg-zinc-200 py-10 flex justify-center">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-center mb-6">Bienvenue chez Express User</h1>
            <p class="text-center mb-8 text-lg text-gray-700">BLA BLA BLA</p>
      
            <!-- Grid de cartes pour afficher les annonces -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Génération des cartes d'annonces -->
                ${annoncesArray.map(annonce => `
                    <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start space-y-4">
                        <strong class="text-xl font-semibold">${annonce.titre}</strong>
                        <h2 class="text-sm text-gray-500">Catégorie : ${annonce.categorie}</h2>
                        
                        <!-- Affichage des images de l'annonce -->
                        <div class="images-container flex space-x-4 mb-4 flex-wrap gap-2">
                        ${annonce.images.map(image => `
                            <img src="/images/${image}" alt="Image de l'annonce ${annonce.titre}" class="max-w-[150px] rounded-lg shadow">
                        `).join('')}
                        </div>
                        
                        <p class="text-gray-700">${annonce.description}</p>
                        <span class="text-lg font-medium text-green-600">${annonce.prix} €</span>
                        
                        <!-- Affichage du bouton "Voir" uniquement pour les utilisateurs avec rôle admin ou user -->
                        ${role === 'admin' || role === 'user' ? 
                            `<a href="/annonce-voir/${annonce.id}">
                                <button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Voir
                                </button>
                             </a>` : ''}
                    </div>`).join('')}
                
                <!-- Message à afficher si aucune annonce n'est trouvée -->
                ${annoncesArray.length === 0 ? '<p class="text-center text-gray-500">Aucune annonce trouvée.</p>' : ''}
            </div>
        </div>
    </div>

    ${footerView()}`;
    
    // Retour du HTML généré pour la page d'accueil
    return html;
}

// Exportation de la fonction homeView
module.exports = homeView;
