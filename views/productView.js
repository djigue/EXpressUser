function produitView(rows) {
    let html = `
        <html>
            <body>
                <h1>Liste des produits</h1>
                <ul>
    `;

    rows.forEach(produit => {
        html += `
            <li>
                <strong>${produit.nom}</strong> - ${produit.description} - <strong>${produit.prix} €</strong>
                <form id="panier-${produit.id}">
                    <input type="hidden" name="produit_id" value="${produit.id}" />
                    <label>Quantité :</label>
                    <input type="number" name="quantite" value="1" min="1" />
                    <button type="submit">Ajouter au panier</button>
                </form>
            </li>
        `;
    });

    if (rows.length === 0) {
        html += `<p>Aucun produit trouvé.</p>`;
    }

    html += `
            </ul>
            <a href="/panier">Voir le panier</a>
            <script src="/fetchPanier.js"></script>
        </body>
    </html>
    `;

    return html;
}

module.exports = produitView;
