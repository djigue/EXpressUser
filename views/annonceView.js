const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function AnnonceView(rows) {
    let html = `${headerView()}
                <h1>Liste des annonces</h1>
                <ul>`;

        rows.forEach(annonce => {
            html += `
            <li>
                <strong>${annonce.titre}</strong> - ${annonce.description} - <strong>${annonce.prix} €</strong>
                
            </li>`;
        });

        if (rows.length === 0) {
            html += `<p>Aucune annonces trouvées.</p>`;
        }

            html += `
            </ul>
            ${footerView()}`;

    return html;
}

module.exports = AnnonceView;
