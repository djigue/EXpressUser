const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function loginView(flash = {}, role) {
    return `${headerView(role)}
    <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
       </script>;
       <script src="/scripts/notif.js"></script>
            <h1>Connectez-vous :</h1>
            <form method="post" action="/login">
                <label for="name">Nom : </label>
                <input type="text" id="name" name="name">
                <br>
                <label for="mdp">Mot de passe : </label>
                <input type="password" id="password" name="password">
                <br>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Se connecter</button>
            </form>
            ${footerView()}`;
}

module.exports = loginView;