const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function showAdminUser(users, flash, role) {
    let html = `${headerView(role)}
                <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
                <script>
                  const flash = {
                  success: "${flash.success || ''}",
                  error: "${flash.error || ''}"
                  };
                </script>
                <script src="/scripts/notif.js"></script>
                <div class="min-h-screen bg-zinc-200 py-10 flex justify-center">
                  <div class="container mx-auto px-4">
                    <h1 class="text-3xl font-bold text-center mb-8">Supprimer un utilisateur</h1>
                    <section class="bg-white shadow-lg rounded-lg p-6 mb-8 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto">
                        <form method="post" action="/supprimer-utilisateur" class="flex flex-col items-center">
                            <label for="user-id" class="text-lg font-medium mb-2 w-full">ID utilisateur :</label>
                            <input type="text" id="user-id" name="id" class="border border-gray-300 p-2 rounded w-2/3 mb-4" required>
                            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Supprimer</button>
                        </form>
                    </section>
                    <section>
                      <h2 class="text-2xl font-semibold mb-4 text-center">Liste des utilisateurs :</h2>
                      <div class="space-y-4">
                        ${users.length === 0 ? `<p class="text-center text-gray-700">Aucun utilisateur à afficher.</p>` : ''}
                        <div class="flex flex-wrap justify-center">
                          ${users.map(user => `
                            <div class="bg-white p-4 shadow-md rounded-lg flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mx-2 mb-4">
                              <div>
                                  <p class="text-xl font-semibold">${user.username}</p>
                                  <p class="text-gray-600">ID: <strong>${user.id}</strong></p>
                              </div>
                              <form id="supp-${user.id}" action="/supprimer-utilisateur/${user.id}" method="POST" class="ml-4">
                                  <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Supprimer</button>
                              </form>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
                ${footerView()}`;

    return html;
}

module.exports = showAdminUser;
