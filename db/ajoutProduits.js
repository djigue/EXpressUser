const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
}); 

function ajouterProduit(titre, description, prix) {
    const insertQuery = `
        INSERT INTO annonces (titre, description, prix)
        VALUES (?, ?, ?)
    `;
    db.run(insertQuery, [titre, description, prix], function (err) {
        if (err) {
            console.error("Erreur lors de l'ajout du produit :", err.message);
        } else {
            console.log(`Produit ajouté avec succès (nom : ${titre})`);
        }
    });
}

const produits = [
    { titre: 'Téléphone Samsung Galaxy S21', description: 'Téléphone presque neuf, excellent état, avec chargeur inclus.', prix: 699.99 },
    { titre: 'Vélo de montagne Rockrider', description: 'Vélo robuste idéal pour les randonnées en montagne, peu utilisé.', prix: 250.00 },
    { titre: 'Chaise de bureau ergonomique', description: 'Chaise confortable pour le télétravail, réglable en hauteur.', prix: 120.50 },
    { titre: 'MacBook Pro 2020', description: 'Ordinateur portable Apple en très bon état, parfait pour le travail ou les études.', prix: 1200.00 },
    { titre: 'Canapé 3 places en cuir', description: 'Canapé en cuir noir, quelques petites éraflures, très confortable.', prix: 450.00 },
    { titre: 'Cours de guitare', description: 'Donne cours particuliers de guitare pour débutants et intermédiaires.', prix: 25.00 },
    { titre: 'Appareil photo Canon EOS 250D', description: 'Appareil photo reflex avec objectif 18-55 mm, excellent état.', prix: 550.00 },
    { titre: 'Lave-vaisselle Bosch', description: 'Lave-vaisselle silencieux et performant, parfait pour une famille.', prix: 300.00 },
    { titre: 'Jeux de société - Dixit', description: 'Jeu complet avec toutes les cartes en parfait état, idéal pour les soirées entre amis.', prix: 20.00 },
    { titre: 'Montre connectée Fitbit Charge 5', description: 'Montre neuve, utilisée une seule fois, vendue avec emballage d’origine.', prix: 180.00 }
];


produits.forEach((produit) => {
    ajouterProduit(produit.titre, produit.description, produit.prix);
})

// ajouterProduit("Bâton magique","Outil qui permet de faire ce qu'on veut","10000000","1");

