const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
}); 

function ajouterTable () {
     const query = `CREATE TABLE annonces (
                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                     titre TEXT NOT NULL,
                     description TEXT NOT NULL,
                     prix REAL NOT NULL,
                     date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
                     )`;


                     db.run(query, function (err) {
                        if (err) {
                            console.error("Erreur lors de l'ajout de la table :", err.message);
                        } else {
                            console.log(`Table ajouté avec succès`);
                        }
                    });
}

ajouterTable();