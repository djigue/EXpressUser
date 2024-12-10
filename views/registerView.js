function registerView() {
    return `
    <html>
        <body>
            <form method="post" action="/register">
                <label for="name">Nom : </label>
                <input type="text" id="name" name="name">
                <br>
                <label for="password">Mot de passe : </label>
                <input type="password" id="password" name="password">
                <br>
                <button type="submit">S'enregistrer'</button>
            </form>
        </body>
    </html>`;
}

module.exports = registerView;