const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function generateList(items, actionPath, buttonText) {
    return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${items.map(item => `
            <div class="bg-white shadow-lg rounded-lg p-6">
                <h3 class="text-xl font-semibold mb-2">${item.titre}</h3>
                <p class="text-gray-700 mb-4">${item.description}</p>
                <p class="text-gray-600 mb-4">Catégorie : ${item.categorie}</p>
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
                        <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">${buttonText}</button>
                    </form>
                </div>
            </div>
        `).join('')}
        </div>`;
}

function showAdminAnnonce(annoncesFinal, flash, role) {
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
                    <h1 class="text-3xl font-bold text-center mb-8">Supprimer une annonce</h1>
                    <section>`;

    if (annoncesFinal.length === 0) {
        html += `
          <div class="bg-white shadow-md rounded-lg p-6 text-center">
            <p class="text-gray-700">Aucune annonce à supprimer.</p>
          </div>`;
    } else {
        html += `
         <section class="bg-white shadow-lg rounded-lg p-6 mb-8 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto">
          <form method="post" action="/supprimer-annonce" class="flex flex-col items-center">
            <label for="id" class="block text-lg font-medium mb-2">ID annonce :</label>
            <input type="text" id="id" name="id" class="border border-gray-300 p-2 rounded w-1/2 mb-4" required>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Supprimer</button>
          </form>
         </section>
          ${generateList(annoncesFinal, '/supprimer-annonce', 'Supprimer')}
        `;
    }

    html += `
                    </section>
                  </div>
                </div>
                ${footerView()}`;

    return html;
}

module.exports = showAdminAnnonce;
