const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * @function
 * @brief Génère une vue affichant les détails d'une annonce avec des images, un formulaire pour l'ajout au panier et des liens pour naviguer entre les annonces.
 * @param {Object} annonce Les détails de l'annonce à afficher.
 * @param {Array} images Liste des images associées à l'annonce.
 * @param {Object} flash Messages flash facultatifs (succès ou erreur).
 * @param {string} role Le rôle de l'utilisateur, utilisé pour afficher l'en-tête approprié.
 * @param {number} nextAnnonceId L'ID de l'annonce suivante (si disponible).
 * @param {number} prevAnnonceId L'ID de l'annonce précédente (si disponible).
 * @param {string} categorie La catégorie de l'annonce, utilisée pour personnaliser le lien "Retour".
 * @returns {string} Retourne une chaîne HTML représentant la page détaillée de l'annonce.
 */
function AnnonceVoirView(annonce, images, flash = {}, role, nextAnnonceId, prevAnnonceId, categorie) {
    const categorieQuery = categorie ? `?categorie=${encodeURIComponent(categorie)}` : ''; // Crée une query string pour la catégorie

    // Début de la structure HTML, incluant l'en-tête dynamique
    let html = `
        ${headerView(role)} <!-- En-tête de la page avec le rôle de l'utilisateur -->
        <section class="bg-zinc-200 min-h-screen py-10 px-4">
            <div class="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <!-- Titre de l'annonce -->
                <h1 class="text-3xl font-semibold text-gray-900 mb-6">${annonce.titre}</h1>
                <h2 class="text-sm text-gray-500 mb-4">Catégorie : ${annonce.categorie}</h2>

                <!-- Affichage des images de l'annonce -->
                <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${images.length > 0
                        ? images.map((image) => `
                            <div class="image-container mb-4">
                                <img src="/images/${image.url}" alt="Image ${image.id}" class="w-full rounded-lg shadow-md">
                                <input type="hidden" name="existImages[]" value="${image.id}">
                            </div>
                        `).join('')
                        : '<p class="text-gray-600 italic">Aucune image associée à cette annonce.</p>' // Message si aucune image n'est disponible
                    }
                </div>

                <!-- Description de l'annonce -->
                <div class="text-gray-800 text-lg mb-6">
                    ${annonce.description}
                </div>

                <!-- Prix de l'annonce -->
                <div class="text-2xl font-bold text-gray-900 mb-6">
                    <strong>${annonce.prix} €</strong>
                </div>

                <!-- Formulaire pour ajouter au panier -->
                <div class="mb-6">
                    <form id="panier-${annonce.id}" action="/panier" method="POST" class="flex items-center space-x-4">
                        <input type="hidden" name="annonces_id" value="${annonce.id}" />
                        <div>
                            <label for="quantite" class="text-sm font-medium text-gray-700">Quantité :</label>
                            <input type="number" name="quantite" value="1" min="1" class="border border-gray-300 rounded-md p-2 mt-1" />
                        </div>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Ajouter au panier</button>
                    </form>
                </div>

                <!-- Liens de navigation (Retour, Annonce précédente et suivante) -->
                <div class="flex space-x-4 mb-6">`;

    // Lien Retour en fonction de la catégorie de l'annonce
    if (categorie) {
        html += `<a href="/${categorie}" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`;
    } else {
        html += `<a href="/annonce" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`;
    }

    // Lien vers l'annonce précédente
    html += prevAnnonceId ? `
        <a href="/annonce-voir/${prevAnnonceId}${categorieQuery}" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Annonce précédente</a>
    ` : `<span class="text-gray-500">Il n'y a pas d'autre annonce.</span>`;

    // Lien vers l'annonce suivante
    html += nextAnnonceId ? `
        <a href="/annonce-voir/${nextAnnonceId}${categorieQuery}" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Annonce suivante</a>
    ` : `<span class="text-gray-500">Il n'y a pas d'autre annonce.</span>`;

    html += `
                </div>
            </div>
        </section>
        ${footerView()} <!-- Pied de page -->
    `;

    return html; // Retourne le HTML généré pour la page d'annonce
}

module.exports = AnnonceVoirView; // Exporte la fonction pour l'utiliser ailleurs dans l'application
