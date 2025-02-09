const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * @function
 * @brief Génère la vue d'administration de l'interface principale pour l'administrateur, affichant des statistiques sur les utilisateurs, les annonces et les annonces à valider.
 * @param {number} totalUsers Le nombre total d'utilisateurs inscrits.
 * @param {number} totalAnnonces Le nombre total d'annonces disponibles.
 * @param {number} totalAnnoncesval Le nombre d'annonces à valider.
 * @param {Object} flash Objet contenant des messages de notification (succès ou erreur), facultatif.
 * @param {string} role Le rôle de l'utilisateur, utilisé pour afficher l'en-tête approprié.
 * @returns {string} Retourne une chaîne HTML représentant la vue d'administration.
 */
function adminView(totalUsers, totalAnnonces, totalAnnoncesval, flash = {}, role) {
    let html = `
        ${headerView(role)} <!-- Affiche l'en-tête selon le rôle de l'utilisateur -->
        <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div> <!-- Zone pour les notifications -->
        <script>
             const flash = { <!-- Définit les messages flash pour succès ou erreur -->
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
        </script>
        <script src="/scripts/notif.js"></script> <!-- Script pour afficher les notifications -->
        <div class="min-h-screen bg-zinc-200 py-10">
            <div class="container mx-auto px-4">
                <h1 class="text-3xl font-bold text-center mb-8">Bienvenue admin !</h1> <!-- Titre principal de la page -->
                <h2 class="text-xl text-center mb-8">Que voulez-vous faire ?</h2> <!-- Sous-titre indiquant les actions disponibles -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> <!-- Grille pour disposer les sections -->
                    <!-- Section pour afficher le nombre total d'utilisateurs inscrits -->
                    <section class="bg-white shadow-md rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-4">Il y a ${totalUsers} utilisateurs inscrits</h3>
                        <button class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            <a href="admin/user" class="block text-center">Supprimer un utilisateur</a> <!-- Lien vers la page de suppression d'utilisateur -->
                        </button>
                    </section>
                    <!-- Section pour afficher le nombre total d'annonces -->
                    <section class="bg-white shadow-md rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-4">Il y a ${totalAnnonces} annonces</h3>
                        <button class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                            <a href="admin/annonce" class="block text-center">Supprimer une annonce</a> <!-- Lien vers la page de suppression d'annonce -->
                        </button>
                    </section>
                    <!-- Section pour afficher le nombre d'annonces à valider -->
                    <section class="bg-white shadow-md rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-4">Il y a ${totalAnnoncesval} annonces à valider</h3>
                        <button class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                            <a href="admin/annonceval" class="block text-center">Valider une annonce</a> <!-- Lien vers la page de validation des annonces -->
                        </button>
                    </section>
                </div>
            </div>
        </div>
        ${footerView()} <!-- Affiche le pied de page -->
    `;
    return html; // Retourne le code HTML généré
}

module.exports = adminView; // Exporte la fonction pour l'utiliser ailleurs dans l'application
