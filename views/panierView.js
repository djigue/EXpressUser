const db = require('../db/db');

function panierView(req, res) {
    const user_id = req.cookies.id; 

    const query = `
        SELECT p.nom, p.prix, c.quantite
        FROM panier c
        JOIN produits p ON c.produit_id = p.id 
        WHERE c.user_id = ?
    `;

    db.all(query, [user_id], (err, rows) => {
        if (err) {
            return res.status(500).send("Erreur lors de la récupération du panier.");
        }

        let html = `
            <html>
                <body>
                    <h1>Votre panier</h1>
                    <ul>
        `;

        rows.forEach(produit => {
            html += `<li>${produit.nom} - ${produit.prix} € x ${produit.quantite}</li>`;
        });

        if (rows.length === 0) {
            html += `<p>Votre panier est vide.</p>`;
        }

        html += `
                    </ul>
                </body>
            </html>
        `;

        res.send(html); 
    });
}

module.exports = panierView;
