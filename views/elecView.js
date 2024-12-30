const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function elecView(annonces, flash = {}, role) {
    let html = `${headerView(role)}
        <div class="bg-zinc-200 min-h-screen py-8">
            <div id="notifications" class="fixed top-4 right-4 z-50 max-w-xs"></div>
            <script>
             const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
             };
            </script>
            <script src="/scripts/notif.js"></script>
            <div class="container mx-auto">
                <h1 class="text-3xl font-bold text-center mb-8">Annonces Immobilier</h1>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    annonces.forEach(annonce => {
        html += `
            <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                <div class="p-4">
                    <h2 class="text-xl font-bold text-gray-800">${annonce.titre}</h2>
                    <h3 class="text-sm text-gray-500">Catégorie: ${annonce.categorie}</h3>
                </div>
                <div class="w-full h-48 bg-gray-100 flex items-center justify-center">
                    ${annonce.images.length > 0 
                        ? `<img src="/images/${annonce.images[0]}" alt="Image de l'annonce ${annonce.titre}" class="object-cover h-full w-full">`
                        : '<p class="text-gray-500">Aucune image disponible</p>'
                    }
                </div>
                <div class="p-4">
                    <p class="text-gray-700">${annonce.description}</p>
                    <p class="text-lg font-semibold text-indigo-600 mt-2">${annonce.prix} €</p>
                    <div class="mt-4 flex justify-between items-center">
                        <a href="/annonce-voir/${annonce.annonce_id}" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Voir</a>
                         <form id="panier-${annonce.annonce_id}" action="/panier" method="POST" class="flex items-center">
                            <input type="hidden" name="annonces_id" value="${annonce.annonce_id}">
                            <label for="quantite-${annonce.annonce_id}" class="text-gray-600 mr-2">Quantité :</label>
                            <input id="quantite-${annonce.annonce_id}" type="number" name="quantite" value="1" min="1" class="w-16 border-gray-300 rounded">
                            <button type="submit" class="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Ajouter au panier</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    });

    if (annonces.length === 0) {
        html += `<p class="text-center text-gray-600">Aucune annonce trouvée.</p>`;
    }

    html += `
                </div>
            </div>
        </div>
        ${footerView()}
    `;
    return html;
}

module.exports = elecView;
