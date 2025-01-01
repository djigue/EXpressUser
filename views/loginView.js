const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function loginView(flash = {}, role) {
    return `${headerView(role)}
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
            <h1 class="text-3xl font-bold text-center mb-6">Connectez-vous</h1>
            
            <div class="bg-white shadow-lg rounded-lg p-8 w-full sm:w-96">
                <form method="post" action="/login" class="space-y-6">
                    <!-- Nom -->
                    <div>
                        <label for="name" class="block text-lg font-medium text-gray-700 mb-2">Nom :</label>
                        <input type="text" id="name" name="name" class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>

                    <!-- Mot de passe -->
                    <div>
                        <label for="password" class="block text-lg font-medium text-gray-700 mb-2">Mot de passe :</label>
                        <input type="password" id="password" name="password" class="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    </div>

                    <!-- Bouton de connexion -->
                    <div>
                        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Se connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    ${footerView()}`;
}

module.exports = loginView;
