const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function userView(user,annoncesArray, flash = {}, role) {
    let html = `
      ${headerView(role)}
      <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
      <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
      </script>
      <script src="/scripts/notif.js"></script>`

      if (role === 'user' || role === 'admin'){
    html += ` 
          <h1 class="text-2xl font-bold mb-4 text-center">Bienvenue, ${user.username}!</h1>
          <p class="text-gray-700 mb-6 text-center">ID utilisateur : <span class="font-semibold">${user.id}</span></p>`
      } 

    html +=`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      

      ${footerView()}
    `;
    return html;
  };
  
  module.exports = userView;
  