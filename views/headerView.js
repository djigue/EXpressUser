function showHeader(role, currentPage) {
  let html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              clifford: '#da373d',
            }
          }
        }
      }

      // JavaScript pour afficher/masquer le menu mobile
      function toggleMenu() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
      }
    </script>
    <title>Express User</title>
  </head>
  <body class="bg-zinc-200 flex flex-col justify-between min-h-screen h-max">
    <header>
      <nav class="bg-zinc-300 py-4">
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div class="relative flex items-center justify-between h-16">
            <!-- Bouton pour menu mobile -->
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button type="button" onclick="toggleMenu()" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            <!-- Menu principal pour les grands écrans -->
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                <!-- Liens de menu avec ajout de la classe active basée sur currentPage -->
                ${role === 'user' || role === 'admin' ? `
                  <a href="/user" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'user' ? 'bg-blue-500 text-white' : ''}">Accueil</a>
                  <a href="/annonce" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'annonce' ? 'bg-blue-500 text-white' : ''}">Voir les annonces</a>
                  <a href="/depot/formulaire" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'depot/formulaire' ? 'bg-blue-500 text-white' : ''}">Déposer une annonce</a>
                  <a href="/depot" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'depot' ? 'bg-blue-500 text-white' : ''}">Voir vos annonces</a>
                  <a href="/panier" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'panier' ? 'bg-blue-500 text-white' : ''}">Voir le panier</a>
                ` : ''}
                ${role !== 'user' && role !== 'admin' ? `
                  <a href="/login" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'login' ? 'bg-blue-500 text-white' : ''}">Se connecter</a>
                  <a href="/register" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'register' ? 'bg-blue-500 text-white' : ''}">S'inscrire</a>
                ` : ''}
                ${role === 'admin' ? `
                  <a href="/admin" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'admin' ? 'bg-blue-500 text-white' : ''}">Page Admin</a>
                  <a href="/admin/user" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'admin/user' ? 'bg-blue-500 text-white' : ''}">Supprimer un utilisateur</a>
                  <a href="/admin/annonce" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'admin/annonce' ? 'bg-blue-500 text-white' : ''}">Supprimer une annonce</a>
                  <a href="/admin/annonceval" class="text-gray-600 hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'admin/annonceval' ? 'bg-blue-500 text-white' : ''}">Valider une annonce</a>
                ` : ''}
                ${role === 'admin' || role === 'user' ? `
                  <form method="post" action="/logout">
                    <button type="submit" class="text-gray-600 hover:bg-red-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Se déconnecter</button>
                  </form>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <!-- Menu mobile -->
      <div class="sm:hidden" id="mobile-menu" class="hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          ${role === 'user' || role === 'admin' ? `
            <a href="/user" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'user' ? 'bg-blue-500 text-white' : ''}">Accueil</a>
            <a href="/annonce" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'annonce' ? 'bg-blue-500 text-white' : ''}">Voir les annonces</a>
            <a href="/depot/formulaire" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'depot/formulaire' ? 'bg-blue-500 text-white' : ''}">Déposer une annonce</a>
            <a href="/depot" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'depot' ? 'bg-blue-500 text-white' : ''}">Voir vos annonces</a>
            <a href="/panier" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'panier' ? 'bg-blue-500 text-white' : ''}">Voir le panier</a>
          ` : ''}
          ${role !== 'user' && role !== 'admin' ? `
            <a href="/login" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'login' ? 'bg-blue-500 text-white' : ''}">Se connecter</a>
            <a href="/register" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'register' ? 'bg-blue-500 text-white' : ''}">S'inscrire</a>
          ` : ''}
          ${role === 'admin' ? `
            <a href="/admin" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'admin' ? 'bg-blue-500 text-white' : ''}">Page Admin</a>
            <a href="/admin/user" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'admin/user' ? 'bg-blue-500 text-white' : ''}">Supprimer un utilisateur</a>
            <a href="/admin/annonce" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'admin/annonce' ? 'bg-blue-500 text-white' : ''}">Supprimer une annonce</a>
            <a href="/admin/annonceval" class="text-gray-600 hover:bg-blue-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'admin/annonceval' ? 'bg-blue-500 text-white' : ''}">Valider une annonce</a>
          ` : ''}
          ${role === 'admin' || role === 'user' ? `
            <form method="post" action="/logout">
              <button type="submit" class="text-gray-600 hover:bg-red-500 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Se déconnecter</button>
            </form>
          ` : ''}
        </div>
      </div>
    </header>
  </body>
</html>`;
  return html;
}

module.exports = showHeader;
