const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function registerView() {
    return `${headerView()}
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