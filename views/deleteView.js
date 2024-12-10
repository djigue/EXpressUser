const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function deleteView() {
    return `${headerView()}
            <h1>Supprimer</h1>
            <form method="post" action="/delete">
                <label for="id">ID : </label>
                <input type="text" id="id" name="id">
                <br>
                <button type="submit">Supprimer</button>
            </form>
            ${footerView()}`;
}

module.exports = deleteView;