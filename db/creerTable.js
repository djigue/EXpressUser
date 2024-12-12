const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
}); 

function ajouterTable () {
//      const query = `CREATE TABLE depot (
//     user_id INTEGER NOT NULL,
//     annonce_id INTEGER NOT NULL,
//     PRIMARY KEY (user_id, annonce_id),
//     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//     FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE
// );`;
    
     const query = `CREATE TABLE annonces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  prix REAL NOT NULL,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`

                     db.run(query, function (err) {
                        if (err) {
                            console.error("Erreur lors de l'ajout de la table :", err.message);
                        } else {
                            console.log(`Table ajouté avec succès`);
                        }
                    });
}

ajouterTable();