const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depAnnView (annonces, annoncesVal, flash = {}) {
let html = `${headerView()}`;

    if (flash.success) {
        html += `<div style="color: green; margin-bottom: 10px;">${flash.success}</div>`;
    }

    if (flash.error) {
        html += `<div style="color: red; margin-bottom: 10px;">${flash.error}</div>`;
    }

    html += `<h2>Vos annonces</h2>
             <ul>`;

if (annonces.length === 0) {
    html += `<p>Vous n'avez publié aucune annonce</p>`;
} else {
    annonces.forEach(annonce => {

    html += `<li>${annonce.titre} - ${annonce.description} - ${annonce.prix} € 
                 <a href="/modifier-annonce/${annonce.id}"><button>Modifier</button></a>
                 <form method="POST" action="/supprimer-annonce-user/${annonce.id}" style="display:inline;">
                    <button type="submit">Supprimer</button>
                 </form>
             </li>
              `;
        });
}

    html += `</ul>
             <br>
             <h2>Vos annonces en cours de validation</h2>
             <ul>`;
             if (annoncesVal.length === 0) {
                html += `<p>Vous n'avez aucune annonce en cours de validation</p>`;
            } else {
                annoncesVal.forEach(annonceVal => {
                html += `<li>${annonceVal.titre} - ${annonceVal.description} - ${annonceVal.prix} € </li>`;
                });
            }
    html += `</ul>
            ${footerView()}`;
return html;
}

module.exports = depAnnView;