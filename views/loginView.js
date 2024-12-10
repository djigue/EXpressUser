const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function loginView() {
    return `${headerView()}
            <h1>Connectez-vous :</h1>
            <form method="post" action="/login">
                <label for="name">Nom : </label>
                <input type="text" id="name" name="name">
                <br>
                <label for="mdp">Mot de passe : </label>
                <input type="password" id="password" name="password">
                <br>
                <button type="submit">Se connecter</button>
            </form>
            ${footerView()}`;
}

module.exports = loginView;