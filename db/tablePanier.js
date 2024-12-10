const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
}); 

function creeTable(nomTable) {
    const Query = `
        CREATE TABLE panier (
    user_id INTEGER NOT NULL,
    produit_id INTEGER NOT NULL,
    quantite INTEGER DEFAULT 1,
    PRIMARY KEY (user_id, produit_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);`

    db.run(Query, function (err) {
        if (err) {
            console.error("Erreur lors de la création de la table :", err.message);
        } else {
            console.log(`Table (nom : ${nomTable}) crée avec succès`);
        }
    });
}

creeTable('Panier');