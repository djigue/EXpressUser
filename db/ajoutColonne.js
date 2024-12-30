const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur lors de l'ouverture de la base de données :", err.message);
        return;
    }
    console.log("Connexion à la base de données réussie.");
});

function ajoutColonne() {
    
        const addColumnQuery = `
            ALTER TABLE annoncesval 
            ADD COLUMN categorie TEXT;
        `;

        db.run(addColumnQuery, (err) => {
            if (err) {
                if (err.message.includes("duplicate column name")) {
                    console.log("La colonne 'categorie' existe déjà.");
                } else {
                    console.error("Erreur lors de l'ajout de la colonne :", err.message);
                }
            } else {
                console.log("La colonne 'categorie' a été ajoutée avec succès.");
            }
        });
}

ajoutColonne();

// Exemple d'utilisation
// addCategoryColumnToAnnoncesTable('./ma_base_de_donnees.db');
