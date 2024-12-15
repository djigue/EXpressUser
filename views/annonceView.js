const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function AnnonceView(rows, flash) {
    let html = `${headerView()}
                <h1>Liste des annonces</h1>
                <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>
    <script src="/scripts/notif.js"></script>
                <ul>`;

        rows.forEach(annonce => {
            html += `
            <li>
                <strong>${annonce.titre}</strong> - ${annonce.description} - <strong>${annonce.prix} €</strong>
                <form id="panier-${annonce.id}" action="/panier" method="POST">
                    <input type="hidden" name="annonces_id" value="${annonce.id}" />
                    <label>Quantité :</label>
                    <input type="number" name="quantite" value="1" min="1" />
                    <button type="submit">Ajouter au panier</button>
                </form>
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
