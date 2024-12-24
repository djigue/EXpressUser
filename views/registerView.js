const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function registerView(flash = {}, role) {
    console.log("registerView role : ", role);
    return `${headerView(role)}
    <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
       </script>;
       <script src="/scripts/notif.js"></script>
            <h1>Inscrivez-vous :</h1>
            <form method="post" action="/register">
                <label for="name">Nom : </label>
                <input type="text" id="name" name="name">
                <br>
                <label for="password">Mot de passe : </label>
                <input type="password" id="password" name="password">
                <br>
                <button type="submit">S'enregistrer'</button>
            </form>
            ${footerView()}`;
}

module.exports = registerView;