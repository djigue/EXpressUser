const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
}); 

function ajouterTable () {
    
     const query = `CREATE TABLE panier (
        user_id INTEGER NOT NULL,
        annonces_id INTEGER NOT NULL,
        quantite INTEGER DEFAULT 1,
        PRIMARY KEY (user_id, annonces_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (annonces_id) REFERENCES annonces (id) ON DELETE CASCADE
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