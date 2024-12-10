function deleteView() {
    return `
    <html>
        <body>
            <form method="post" action="/delete">
                <label for="id">ID : </label>
                <input type="text" id="id" name="id">
                <br>
                <button type="submit">Supprimer</button>
            </form>
        </body>
    </html>`;
}

module.exports = deleteView;