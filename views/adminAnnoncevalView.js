const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function generateList(items, actionPath, buttonText) {
    return `
        <ul>
        ${items.map(item => `
            <li>
                ${item.categorie} - ${item.id} - ${item.titre} - ${item.description}
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

function showAdminAnnonceval(annoncesvalFinal, flash, role) {
    let html =`${headerView(role)}
               <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
               <script>
                  const flash = {
                  success: "${flash.success || ''}",
                  error: "${flash.error || ''}"
                  };
               </script>
               <script src="/scripts/notif.js"></script><section> 
               <h1>Valider une annonce :</h1>
               <section>`
               if (annoncesvalFinal.length === 0) {
        html +=`<div><p>Il n'y aucune annonces a valider</p></div>`
               } else {  
        html +=`${generateList(annoncesvalFinal, '/valider-annonce', 'Valider')}`
               }
        html +=`</section> 
               ${footerView()}`;
    return html;
}

module.exports = showAdminAnnonceval;