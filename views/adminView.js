const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function adminView(totalUsers, totalAnnonces, totalAnnoncesval, flash = {}, role) {
    let html = `
        ${headerView(role)}
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
                <h1 class="text-3xl font-bold text-center mb-8">Bienvenue admin !</h1>
                <h2 class="text-xl text-center mb-8">Que voulez-vous faire ?</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <section class="bg-white shadow-md rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-4">Il y a ${totalUsers} utilisateurs inscrits</h3>
                        <button class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                            <a href="admin/user" class="block text-center">Supprimer un utilisateur</a>
                        </button>
                    </section>
                    <section class="bg-white shadow-md rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-4">Il y a ${totalAnnonces} annonces</h3>
                        <button class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                            <a href="admin/annonce" class="block text-center">Supprimer une annonce</a>
                        </button>
                    </section>
                    <section class="bg-white shadow-md rounded-lg p-6">
                        <h3 class="text-lg font-semibold mb-4">Il y a ${totalAnnoncesval} annonces à valider</h3>
                        <button class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                            <a href="admin/annonceval" class="block text-center">Valider une annonce</a>
                        </button>
                    </section>
                </div>
            </div>
        </div>
        ${footerView()}
    `;
    return html;
}

module.exports = adminView;