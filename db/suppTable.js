const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
}); 

function suppTable(nomTable) {
    const Query = `
        DROP TABLE IF EXISTS ${nomTable}`

    db.run(Query, function (err) {
        if (err) {
            console.error("Erreur lors de la suppression de la table :", err.message);
        } else {
            console.log(`Table (nom : ${nomTable}) supprimée avec succès`);
        }
    });
}

suppTable('Panier');