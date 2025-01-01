const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function homeView(annoncesArray, flash = {}, role) {
    let html = `${headerView(role)}
    <div id="notifications" class="fixed top-10 right-10 z-50 max-w-xs"></div>
    <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>
    <script src="/scripts/notif.js"></script>
    
   <div class="min-h-screen bg-zinc-200 py-10 flex justify-center">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-center mb-6">Bienvenue chez Express User</h1>
            <p class="text-center mb-8 text-lg text-gray-700">BLA BLA BLA</p>
      
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Génération des annonces -->
                ${annoncesArray.map(annonce => `
                    <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start space-y-4">
                        <strong class="text-xl font-semibold">${annonce.titre}</strong>
                        <h2 class="text-sm text-gray-500">Catégorie : ${annonce.categorie}</h2>
                        <div class="images-container flex space-x-4 mb-4 flex-wrap gap-2">
                        ${annonce.images.map(image => `
                            <img src="/images/${image}" alt="Image de l'annonce ${annonce.titre}" class="max-w-[150px] rounded-lg shadow">
                        `).join('')}
                    </div>
                        <p class="text-gray-700">${annonce.description}</p>
                        <span class="text-lg font-medium text-green-600">${annonce.prix} €</span>
                        ${role === 'admin' || role === 'user' ? 
                            `<a href="/annonce-voir/${annonce.id}">
                                <button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Voir
                                </button>
                             </a>` : ''}
                    </div>`).join('')}
                
                <!-- Afficher un message si aucune annonce n'est trouvée -->
                ${annoncesArray.length === 0 ? '<p class="text-center text-gray-500">Aucune annonce trouvée.</p>' : ''}
            </div>
        </div>
    </div>

    ${footerView()}`;
    
    return html;
}

module.exports = homeView;
