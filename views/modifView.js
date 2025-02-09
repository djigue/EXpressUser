// Importation des vues d'entête et de pied de page
const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * Génère la vue pour la page de modification d'une annonce.
 * @param {Object} annonce - L'annonce à modifier, contenant des informations comme le titre, la description, le prix, etc.
 * @param {Array} images - Liste des images associées à l'annonce, chaque image ayant une URL et un identifiant.
 * @param {Object} [flash={}] - Objet contenant les messages flash pour les notifications (succès ou erreur).
 * @param {string} role - Le rôle de l'utilisateur (admin, user, etc.) utilisé pour personnaliser l'entête de la page.
 * @returns {string} HTML généré pour la page de modification de l'annonce.
 */
function modifView(annonce, images, flash = {}, role) {
    // Initialisation du HTML avec l'entête dynamique basée sur le rôle de l'utilisateur
    let html = `
      ${headerView(role)}
      <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
      <script>
        // Initialisation des messages flash pour les notifications
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
      </script>
      <!-- Inclusion du script pour gérer les notifications -->
      <script src="/scripts/notif.js"></script>
      <div class="min-h-screen bg-zinc-200 py-10">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold text-center mb-8">Modifier l'annonce</h1>
          
          <!-- Section pour afficher et gérer les images associées -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-4">Images associées</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              ${
                images.length > 0
                  ? images
                      .map(
                        (image) => `
                    <div class="bg-white shadow-md rounded-lg p-4 text-center">
                      <img src="/images/${image.url}" alt="Image ${image.id}" class="w-full h-32 object-cover rounded-md mb-4">
                      <form method="POST" name="suppImage" action="/supprimer-image/${image.id}" onsubmit="return confirm('Voulez-vous vraiment supprimer cette image ?')" class="mt-2">
                        <input type="hidden" name="suppImage" value="supprimer_image">
                        <button type="submit" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Supprimer</button>
                      </form>
                      <input type="hidden" name="existImages[]" value="${image.id}">
                    </div>
                  `
                      )
                      .join("")
                  : '<p class="text-gray-700">Aucune image associée à cette annonce.</p>'
              }
            </div>
          </div>
  
          <!-- Formulaire pour modifier l'annonce -->
          <div class="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <form method="POST" name="modifAnn" action="/modifier-annonce/${annonce.id}" enctype="multipart/form-data">
              <input type="hidden" name="annonce_id" value="${annonce.id}">
              
              <!-- Champ pour modifier le titre -->
              <div class="mb-4">
                <label for="titre" class="block text-gray-700 font-medium mb-2">Titre :</label>
                <input type="text" id="titre" name="titre" value="${annonce.titre}" required class="w-full border-gray-300 rounded-lg p-2">
              </div>

              <!-- Champ pour modifier la catégorie -->
              <div class="mb-4">
                <label for="categorie" class="block text-gray-700 font-medium mb-2">categorie :</label>
                <input type="text" id="categorie" name="categorie" value="${annonce.categorie}" required class="w-full border-gray-300 rounded-lg p-2">
              </div>
  
              <!-- Champ pour modifier la description -->
              <div class="mb-4">
                <label for="description" class="block text-gray-700 font-medium mb-2">Description :</label>
                <textarea id="description" name="description" rows="4" required class="w-full border-gray-300 rounded-lg p-2">${annonce.description}</textarea>
              </div>
  
              <!-- Champ pour modifier le prix -->
              <div class="mb-4">
                <label for="prix" class="block text-gray-700 font-medium mb-2">Prix :</label>
                <input type="number" id="prix" name="prix" value="${annonce.prix}" required class="w-full border-gray-300 rounded-lg p-2">
              </div>
  
              <!-- Champ pour ajouter des nouvelles images -->
              <div class="mb-4">
                <label for="imagesUser" class="block text-gray-700 font-medium mb-2">Ajouter des images :</label>
                <input type="file" id="imagesUser" name="imagesUser" multiple accept="image/*" class="w-full border-gray-300 rounded-lg p-2">
              </div>
  
              <!-- Bouton de soumission pour modifier l'annonce -->
              <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Modifier</button>
            </form>
          </div>
        </div>
      </div>
      ${footerView()}
    `;
  
    // Retourner le HTML généré
    return html;
}

// Exportation de la fonction modifView pour l'utiliser ailleurs dans l'application
module.exports = modifView;
