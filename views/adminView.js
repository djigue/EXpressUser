const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function generateList(items, actionPath, buttonText) {
    return `
        <ul>
        ${items.map(item => `
            <li>${item.id} - ${item.nom || item.titre || item.username || ''}- ${item.description || ''} ${item.date || ''}
                <form method="POST" action="${actionPath}/${item.id}" style="display:inline;">
                    <button type="submit">${buttonText}</button>
                </form>
            </li>
        `).join('')}
        </ul>`;
}

function adminView(users = [], produits = [], annonces = [], annoncesval = [], flash = {}) {
    let html = `
        ${headerView()}
         <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
        <script>
             const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
        </script>
        <script src="/scripts/notif.js"></script>
       <h1>Bienvenue admin ! <br>Que voulez-vous faire ?</h1>
        
        <section>
            <h2>Supprimer un utilisateur :</h2>
            <form method="post" action="/supprimer-utilisateur">
                <label for="id">ID utilisateur : </label>
                <input type="text" id="id" name="id">
                <button type="submit">Supprimer</button>
            </form>
            ${generateList(users, '/supprimer-utilisateur', 'Supprimer')}
        </section>
        <section>
            <h2>Supprimer un produit :</h2>
            <form method="post" action="/supprimer-produit">
                <label for="id">ID produit : </label>
                <input type="text" id="id" name="id">
                <button type="submit">Supprimer</button>
               ${generateList(produits, '/supprimer-produit', 'Supprimer')}
            </form>
        </section>

        <section>
            <h2>Supprimer une annonce :</h2>
            <form method="post" action="/supprimer-annonce">
                <label for="id">ID annonce : </label>
                <input type="text" id="id" name="id">
                <button type="submit">Supprimer</button>
            </form>
            ${generateList(annonces, '/supprimer-annonce', 'Supprimer')}
        </section>

        <section>
            <h2>Valider une annonce :</h2>
            ${generateList(annoncesval, '/valider-annonce', 'Valider')}
        </section>
        <form method="post" action="/logout">
              <button type="submit">Se déconnecter</button>
          </form>
        ${footerView()}
    `;
    return html;
}

module.exports = adminView;
