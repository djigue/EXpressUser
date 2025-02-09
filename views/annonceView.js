const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

/**
 * @function
 * @brief Génère une vue affichant une liste d'annonces avec des options d'ajout au panier et des liens vers des catégories spécifiques.
 * @param {Array} annonces Liste des annonces à afficher.
 * @param {Object} flash Messages flash facultatifs (succès ou erreur).
 * @param {string} role Le rôle de l'utilisateur, utilisé pour afficher l'en-tête approprié.
 * @returns {string} Retourne une chaîne HTML représentant la page des annonces.
 */
function annonceView(annonces, flash = {}, role) {
    console.log("flash : ", flash); // Affiche les messages flash dans la console pour le débogage.

    // Début de la structure HTML, incluant l'en-tête dynamique
    let html = `${headerView(role)}
        <div class="bg-zinc-200 min-h-screen py-8">
           <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div> <!-- Zone pour les notifications flash -->
        <script>
             const flash = { // Définition des messages flash pour le frontend
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
        </script>
        <script src="/scripts/notif.js"></script> <!-- Script pour afficher les notifications -->
            <div class="container mx-auto">
                <h1 class="text-3xl font-bold text-center mb-8">Liste des annonces</h1> <!-- Titre principal -->
                
                <!-- Liens vers les différentes catégories d'annonces -->
                <div class="mb-8 flex flex-wrap justify-center gap-4">
                    <a href="/immobilier" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Immobilier</a>
                    <a href="/vehicule" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Vehicule</a>
                    <a href="/maison" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Maison et Jardin</a>
                    <a href="/elec" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Electronique</a>
                    <a href="/vetements" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Vetements</a>
                    <a href="/loisirs" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Loisirs</a>
                    <a href="/autres" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Autres</a>
                </div>
                
                <!-- Grille d'affichage des annonces -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    // Parcours des annonces pour générer leur HTML
    annonces.forEach(annonce => {
        html += `
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="p-4">
                    <h3 class="text-xl font-bold text-gray-800">${annonce.titre}</h3> <!-- Titre de l'annonce -->
                    <h2 class="text-sm text-gray-500">Catégorie : ${annonce.categorie}</h2> <!-- Catégorie de l'annonce -->
                </div>
                <div class="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <!-- Affichage de l'image ou message "Aucune image disponible" -->
                    ${annonce.images.length > 0 
                        ? `<img src="/images/${annonce.images[0]}" alt="Image de l'annonce ${annonce.titre}" class="object-cover h-full w-full">`
                        : '<p class="text-gray-500">Aucune image disponible</p>'
                    }
                </div>
                <div class="p-4">
                    <p class="text-gray-700">${annonce.description}</p> <!-- Description de l'annonce -->
                    <p class="text-lg font-semibold text-indigo-600 mt-2">${annonce.prix} €</p> <!-- Prix de l'annonce -->
                    
                    <!-- Formulaire d'ajout au panier -->
                    <div class="mt-4 flex justify-between items-center">
                        <a href="/annonce-voir/${annonce.id}" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Voir</a> <!-- Lien pour voir les détails de l'annonce -->
                        <form id="panier-${annonce.id}" action="/panier" method="POST" class="flex items-center">
                            <input type="hidden" name="annonces_id" value="${annonce.id}">
                            <label for="quantite-${annonce.id}" class="text-gray-600 mr-2">Quantité :</label>
                            <input id="quantite-${annonce.id}" type="number" name="quantite" value="1" min="1" class="w-16 border-gray-300 rounded"> <!-- Champ pour la quantité -->
                            <button type="submit" class="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Ajouter au panier</button> <!-- Bouton pour ajouter au panier -->
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

    // Fin du HTML, ajout du pied de page
    html += `
                </div>
            </div>
        </div>
        ${footerView()} <!-- Pied de page -->
    `;
    
    return html; // Retourne le HTML généré pour la page des annonces
}

module.exports = annonceView; // Exporte la fonction pour l'utiliser ailleurs dans l'application
