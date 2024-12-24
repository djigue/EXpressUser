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

function showAdminAnnonce (annoncesFinal, flash, role) {
    let html = `${headerView(role)}
                <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
                <script>
                  const flash = {
                  success: "${flash.success || ''}",
                  error: "${flash.error || ''}"
                  };
                </script>
                <script src="/scripts/notif.js"></script><section>
                <h1>Supprimer une annonce :</h1>
                <section>
                <form method="post" action="/supprimer-annonce">
                  <label for="id">ID annonce : </label>
                  <input type="text" id="id" name="id">
                  <button type="submit">Supprimer</button>
                </form>
                ${generateList(annoncesFinal, '/supprimer-annonce', 'Supprimer')}
               </section>
               ${footerView()}`;

    return html;
}

module.exports = showAdminAnnonce;