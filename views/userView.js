const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function userView(user, flash = {}, role) {
    return `
      ${headerView(role)}
      <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
      <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
      </script>
      <script src="/scripts/notif.js"></script>
      <div class="min-h-screen bg-zinc-200 flex items-center justify-center py-10">
        <div class="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
          <h1 class="text-2xl font-bold mb-4 text-center">Bienvenue, ${user.username}!</h1>
          <p class="text-gray-700 mb-6 text-center">ID utilisateur : <span class="font-semibold">${user.id}</span></p>
          <form method="post" action="/logout" class="flex justify-center">
            <button 
              type="submit" 
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 shadow">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
      ${footerView()}
    `;
  };
  
  module.exports = userView;
  

module.exports = userView;