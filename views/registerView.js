// Importation des vues d'entête et de pied de page
const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * Génère la vue pour la page d'inscription.
 * @param {Object} [flash={}] - Objet contenant les messages flash pour les notifications (succès ou erreur).
 * @param {string} role - Le rôle de l'utilisateur (admin, user, etc.) utilisé pour personnaliser l'entête de la page.
 * @returns {string} HTML généré pour la page d'inscription.
 */
function registerView(flash = {}, role) {
    console.log("registerView role : ", role); // Debug pour vérifier le rôle de l'utilisateur
    
    // Génération du HTML pour la page d'inscription
    return `${headerView(role)}
    <!-- Section des notifications (messages flash) -->
    <div id="notifications" class="fixed top-10 right-10 z-50 max-w-xs"></div>
    <script>
        // Initialisation des messages flash pour les notifications
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>
    <!-- Inclusion du script pour gérer les notifications -->
    <script src="/scripts/notif.js"></script>

    <!-- Conteneur principal de la page d'inscription -->
    <div class="min-h-screen bg-zinc-200 py-10 flex justify-center">
        <div class="container mx-auto px-4">
            <!-- Titre de la page -->
            <h1 class="text-3xl font-bold text-center mb-6">Inscrivez-vous</h1>
            
            <!-- Formulaire d'inscription -->
            <div class="bg-white shadow-lg rounded-lg p-8 w-full sm:w-96">
                <form method="post" action="/register" class="space-y-6">
                    <!-- Champ pour le nom -->
                    <div>
                        <label for="name" class="block text-lg font-medium text-gray-700 mb-2">Nom :</label>
                        <input type="text" id="name" name="name" class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>

                    <!-- Champ pour le mot de passe -->
                    <div>
                        <label for="password" class="block text-lg font-medium text-gray-700 mb-2">Mot de passe :</label>
                        <input type="password" id="password" name="password" class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>

                    <!-- Bouton d'enregistrement -->
                    <div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            S'enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    ${footerView()}`;
}

// Exportation de la fonction registerView pour l'utiliser ailleurs dans l'application
module.exports = registerView;
