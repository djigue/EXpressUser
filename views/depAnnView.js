const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depAnnView (rows) {

    if (!Array.isArray(rows)) {
        rows = [];
    }

  let html = `${headerView()}
    <h1>Vos annonces</h1>
<ul>`;

if (rows.length === 0) {
    html += `<p>Vous n'avez publié aucune annonce</p>`;
} else {
    rows.forEach(annonce => {
    html += `<li>${annonce.titre} - ${annonce.description} - ${annonce.prix} € 
                 <a href="/modifier-annonce/${annonce.id}"><button>Modifier</button></a>
                 <a href="/supprimer-annonce/${annonce.id}"><button>supprimer</button></a>
             </li>`;
  });
}

html += `
</ul>
${footerView()}`;

return html;
}

module.exports = depAnnView;