const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function generateList(items, actionPath, buttonText) {
    return `
        <ul>
        ${items.map(item => `
            <li>
                ${item.id} - ${item.titre} - ${item.description}
                <div>
                    ${item.images ? item.images.map(image => `
                        <img src="/images/${image}" alt="Image de l'annonce" style="max-width: 100px; max-height: 100px;">
                    `).join('') : 'Aucune image'}
                </div>
                <form method="POST" action="${actionPath}/${item.id}" style="display:inline;">
                    <button type="submit">${buttonText}</button>
                </form>
            </li>
        `).join('')}
        </ul>`;
}


function adminView(users = [], annoncesFinal = [], annoncesvalFinal = [], flash = {}, role) {
    let html = `
    ${headerView(role)}
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
                <label for="user-id">ID utilisateur : </label>
                <input type="text" id="user-id" name="id">
                <button type="submit">Supprimer</button>
            </form>
            <ul>`
            users.forEach(user => {
                html += `
                <li>
                <strong>${user.id}</strong> - ${user.username}
            <form id="supp-${user.id}" action="/supprimer-utilisateur/${user.id}" method="POST">
                    <button type="submit">Supprimer</button>
                </form> `
            })
         html +=   `</ul> 
        </section>

        <section>
            <h2>Supprimer une annonce :</h2>
            <form method="post" action="/supprimer-annonce">
                <label for="id">ID annonce : </label>
                <input type="text" id="id" name="id">
                <button type="submit">Supprimer</button>
            </form>
            ${generateList(annoncesFinal, '/supprimer-annonce', 'Supprimer')}
        </section>

        <section>
            <h2>Valider une annonce :</h2>
            ${generateList(annoncesvalFinal, '/valider-annonce', 'Valider')}
        </section>
        <form method="post" action="/logout">
              <button type="submit">Se déconnecter</button>
          </form>
        ${footerView()}
    `;
    return html;
}

module.exports = adminView;
