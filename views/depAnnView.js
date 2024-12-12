const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depAnnView (rows) {

    if (!Array.isArray(rows)) {
        rows = [];
    }
  console.log('row depot : ', rows);
  let html = `${headerView()}
    <h1>Vos annonces</h1>
<ul>`;

if (rows.length === 0) {
    html += `<p>Vous n'avez publié aucune annonce</p>`;
} else {
    rows.forEach(annonce => {
        console.log('annonce', annonce);
    console.log('id annonce', annonce.id);
    html += `<li>${annonce.titre} - ${annonce.description} - ${annonce.prix} € 
                 <a href="/modifier-annonce/${annonce.id}"><button>Modifier</button></a>
                 <form method="POST" action="/supprimer-annonce-user/${annonce.id}" style="display:inline;">
                    <button type="submit">Supprimer</button>
                 </form>
             </li>`;
  });
}

html += `
</ul>
${footerView()}`;
return html;
}

module.exports = depAnnView;