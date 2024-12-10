const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
}); 

function ajouterProduit(nom, description, prix, quantite) {
    const insertQuery = `
        INSERT INTO produits (nom, description, prix, quantite)
        VALUES (?, ?, ?, ?)
    `;
    db.run(insertQuery, [nom, description, prix, quantite], function (err) {
        if (err) {
            console.error("Erreur lors de l'ajout du produit :", err.message);
        } else {
            console.log(`Produit ajouté avec succès (nom : ${nom})`);
        }
    });
}

// const produits =[
//     {nom: "Lame du Chaos", description: "paire d'épées assez pratique quand on sait les utiliser", prix: "50000", quantité: "1"},
//     {nom: "Donuts", description: "petits beignets rond cuit dans l'huile", prix: "2", quantité: "500"},
//     {nom: "Sèche cheveux", description: "ustesile indispansable pour certaines mise en plis", prix: "49.99", quantité: "100"},
//     {nom: "Skate", description: "Plance à roulette pour être une terreur dans les rues de ta ville", prix: "99.99", quantité: "100"},
//     {nom: "Saxophone", description: "Instrument de musique idéal pour le jazz et casser les oreilles de ta famille", prix: "149.99", quantité: "20"},
//     {nom: "Sucette", description: "Accessoire indispensable pour faire fermer leurs gueules aux bébés", prix: "9.99", quantité: "1000"},
//     {nom: "Botte secrète", description: "Indispensable pour éviter de passer pour un imbécile surtout quand on est très con", prix: "8.422", quantité: "16132"},
//     {nom: "Corne d'abondance", description: "Pour manger ce qu'on veut et en quantité énorme dès qu'on en a envie", prix: "999.99", quantité: "3"}
// ]

// produits.forEach((produit) => {
//     ajouterProduit(produit.nom, produit.description, produit.prix, produit.quantité);
// })

ajouterProduit("Bâton magique","Outil qui permet de faire ce qu'on veut","10000000","1");

