function loginView() {
    return `
    <html>
        <body>
            <form method="post" action="/login">
                <label for="name">Nom : </label>
                <input type="text" id="name" name="name">
                <br>
                <label for="mdp">Mot de passe : </label>
                <input type="password" id="password" name="password">
                <br>
                <button type="submit">Se connecter</button>
            </form>
        </body>
    </html>`;
}

module.exports = loginView;