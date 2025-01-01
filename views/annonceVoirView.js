const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function AnnonceVoirView(annonce, images, flash = {}, role, nextAnnonceId, prevAnnonceId, categorie) {
    const categorieQuery = categorie ? `?categorie=${encodeURIComponent(categorie)}` : '';

    let html = `
        ${headerView(role)}
        <section class="bg-zinc-200 min-h-screen py-10 px-4">
            <div class="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <!-- Titre de l'annonce -->
                <h1 class="text-3xl font-semibold text-gray-900 mb-6">${annonce.titre}</h1>
                <h2 class="text-sm text-gray-500 mb-4">Catégorie : ${annonce.categorie}</h2>

                <!-- Image de l'annonce (responsive) -->
                <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${images.length > 0
                        ? images.map((image) => `
                            <div class="image-container mb-4">
                                <img src="/images/${image.url}" alt="Image ${image.id}" class="w-full rounded-lg shadow-md">
                                <input type="hidden" name="existImages[]" value="${image.id}">
                            </div>
                        `).join('')
                        : '<p class="text-gray-600 italic">Aucune image associée à cette annonce.</p>'
                    }
                </div>

                <!-- Description de l'annonce -->
                <div class="text-gray-800 text-lg mb-6">
                    ${annonce.description}
                </div>

                <!-- Prix -->
                <div class="text-2xl font-bold text-gray-900 mb-6">
                    <strong>${annonce.prix} €</strong>
                </div>

                <!-- Formulaire panier -->
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

                <!-- Liens de navigation -->
                <div class="flex space-x-4 mb-6">`
                 if (categorie === 'immobilier'){
        html +=`  <a href="/immobilier" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`
                 }else if (categorie === 'véhicules'){
        html +=`   <a href="/vehicule" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`
                 }else if (categorie === 'maison'){
        html +=`  <a href="/maison" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`
                 }else if (categorie === 'vetements'){
        html +=`  <a href="/vetements" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`
                 }else if (categorie === 'electronique'){
        html +=`  <a href="/elec" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`
                 }else if (categorie === 'loisirs'){
        html +=`  <a href="/loisirs" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`
                 }else if (categorie === 'autres'){
        html +=`  <a href="/autres" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour</a>`
                 }else {
        html +=`  <a href="/annonce"  class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Retour </a>`
                 }
        html +=`    ${prevAnnonceId ? `
                        <a href="/annonce-voir/${prevAnnonceId}${categorieQuery}" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Annonce précédente</a>
                    ` : `<span class="text-gray-500">Il n'y a pas d'autre annonce.</span>`}
                    ${nextAnnonceId ? `
                        <a href="/annonce-voir/${nextAnnonceId}${categorieQuery}" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Annonce suivante</a>
                    ` : `<span class="text-gray-500">Il n'y a pas d'autre annonce.</span>`}
                </div>
            </div>
        </section>
        ${footerView()}`;

    return html;
}

module.exports = AnnonceVoirView;
