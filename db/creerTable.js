const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
}); 

function ajouterTable () {
    
     const query = `CREATE TABLE images_annoncesval (
  image_id INTEGER NOT NULL,
  annonceval_id INTEGER NOT NULL,
  PRIMARY KEY (image_id, annonceval_id),
  FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE,
  FOREIGN KEY (annonceval_id) REFERENCES annoncesval (id) ON DELETE CASCADE
);`;

                     db.run(query, function (err) {
                        if (err) {
                            console.error("Erreur lors de l'ajout de la table :", err.message);
                        } else {
                            console.log(`Table ajouté avec succès`);
                        }
                    });
}

ajouterTable();