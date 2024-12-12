const sqlite3 = require('sqlite3').verbose();

// Connexion à la base de données
const db = new sqlite3.Database('../database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err.message);
    } else {
        console.log("Connexion à la base de données réussie.");
    }
});

// Fonction pour générer une annonce aléatoire
function generateAnnonce() {
    const titles = ["Vente de voiture", "Meubles d'occasion", "Appartement à louer", "Livres rares", "Bricolage", "Services à domicile", "Animaux à adopter"];
    const descriptions = [
        "Produit en très bon état, à ne pas manquer!",
        "Offre exceptionnelle pour une durée limitée.",
        "Profitez de cette occasion unique pour acheter.",
        "Un produit de qualité à petit prix.",
        "Venez découvrir ce bien immobilier magnifique.",
        "Offre spéciale, contactez-nous maintenant!",
        "Idéal pour ceux qui recherchent un objet rare."
    ];
    const prices = [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000];

    const title = titles[Math.floor(Math.random() * titles.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const price = prices[Math.floor(Math.random() * prices.length)];

    return {
        titre: title,
        description: description,
        prix: price
    };
}

// Insérer les 50 annonces dans la table 'annonces' et les relier à un utilisateur avec ID entre 16 et 23
function generateAndInsertAnnonces() {
    db.serialize(() => {
        // Pour chaque annonce, on génère une annonce et on l'insère dans la base de données
        for (let i = 0; i < 50; i++) {
            const annonce = generateAnnonce();
            const userId = Math.floor(Math.random() * (23 - 16 + 1)) + 16; // Génère un userId entre 16 et 23

            const query = `INSERT INTO annonces (titre, description, prix) VALUES (?, ?, ?)`;
            db.run(query, [annonce.titre, annonce.description, annonce.prix], function (err) {
                if (err) {
                    console.error("Erreur lors de l'insertion de l'annonce :", err.message);
                    return;
                }

                // Une fois l'annonce insérée, on récupère son id
                const annonceId = this.lastID; // ID de l'annonce insérée

                // Vérification si la liaison existe déjà avant de l'insérer
                const checkDepotQuery = `SELECT 1 FROM depot WHERE user_id = ? AND annonce_id = ? LIMIT 1`;
                db.get(checkDepotQuery, [userId, annonceId], (err, row) => {
                    if (err) {
                        console.error("Erreur lors de la vérification de la liaison :", err.message);
                        return;
                    }

                    if (!row) {
                        // Si la liaison n'existe pas déjà, on l'ajoute dans la table depot
                        const depotQuery = `INSERT INTO depot (user_id, annonce_id) VALUES (?, ?)`;
                        db.run(depotQuery, [userId, annonceId], function (err) {
                            if (err) {
                                console.error("Erreur lors de la liaison dans la table depot :", err.message);
                            } else {
                                console.log(`Annonce ${annonceId} insérée et liée à l'utilisateur ${userId}`);
                            }
                        });
                    } else {
                        console.log(`Annonce ${annonceId} est déjà liée à l'utilisateur ${userId}, donc pas d'ajout dans la table depot.`);
                    }
                });
            });
        }
    });
}

// Exécution de la fonction pour générer et insérer les annonces
generateAndInsertAnnonces();
