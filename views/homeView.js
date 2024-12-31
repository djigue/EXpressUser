const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function homeView(rows, flash = {}, role) {
    let html = `${headerView(role)}
    <div id="notifications" class="fixed top-10 right-10 z-50 max-w-xs"></div>
    <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>
    <script src="/scripts/notif.js"></script>
    
    <div class="min-h-screen bg-gray-100 py-10 flex justify-center">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-center mb-6">Bienvenue chez Express User</h1>
            <p class="text-center mb-8 text-lg text-gray-700">BLA BLA BLA</p>
            
            <ul class="space-y-6">
                <!-- Génération des annonces -->
                ${rows.map(annonce => `
                    <li class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start space-y-4">
                        <strong class="text-xl font-semibold">${annonce.titre}</strong>
                        <p class="text-gray-700">${annonce.description}</p>
                        <span class="text-lg font-medium text-green-600">${annonce.prix} €</span>
                        ${role === 'admin' || role === 'user' ? 
                            `<a href="/annonce-voir/${annonce.id}">
                                <button class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    Voir
                                </button>
                             </a>` : ''}
                    </li>`).join('')}
                
                <!-- Afficher un message si aucune annonce n'est trouvée -->
                ${rows.length === 0 ? '<p class="text-center text-gray-500">Aucune annonce trouvée.</p>' : ''}
            </ul>
        </div>
    </div>

    ${footerView()}`;
    
    return html;
}

module.exports = homeView;
