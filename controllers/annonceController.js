const annonceView = require ('../views/annonceView');
const depotView = require ('../views/depotView');
const depAnnView = require('../views/depAnnView');
const modifView = require ('../views/modifView');
const db = require ('../db/db');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const bcrypt = require('bcrypt');

function showAnnonce(req, res){
    const query = `SELECT *
                   FROM annonces; `
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération du panier:', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }
        console.log("Données reçues du panier :", rows);
        if (!rows || rows.length === 0) {
            if (!res.headersSent) {
                return res.send('<html><body><h1>Aucun produit trouvé.</h1></body></html>');
            }
            return;
        }

        const htmlContent = annonceView(rows);
        if (!res.headersSent) {
            return res.send(htmlContent);
        }
    });
  }

function showDepot (req, res) {
    res.send(depotView());
}

function showDepAnn(req, res) {
    console.log("Bien arrivé sur /depot");
    const user_id = req.cookies.id;
    console.log("user_id:", user_id);

    if (!user_id) {
        return res.status(401).send("Vous devez être connecté pour accéder à cette page.");
    }

    const queryAnnoncesVal = `
        SELECT a.id, a.titre, a.description, a.prix
        FROM annoncesval a
        WHERE a.user_id = ?`;

    const queryAnnonces = `
        SELECT a.id, a.titre, a.description, a.prix
        FROM annonces a
        JOIN depot d ON a.id = d.annonce_id
        WHERE d.user_id = ?
    `;

    db.all(queryAnnonces, [user_id], (errAnnonces, annonces) => {
        if (errAnnonces) {
            console.error("Erreur lors de la récupération des annonces:", err.message);
            return res.status(500).send('Erreur interne du serveur');
        }

    db.all(queryAnnoncesVal, [user_id], (errAnnoncesVal, annoncesVal) => {
        if (errAnnoncesVal) {
            console.error("Erreur lors de la récupération des annonces:", err.message);
            return res.status(500).send('Erreur interne du serveur');
        }

        const htmlContent = depAnnView(annonces, annoncesVal);
        return res.send(htmlContent); 
    });
    });
}


 function traitDepot (req, res) {
    console.log('Requête reçue sur /depot');
    const {titre, description, prix} = req.body;
    const user_id = req.cookies.id;

    console.log('Données reçues :', {titre, description, prix, user_id});

    if (!titre || !description || !prix) {
        console.log('Champs manquants');
        return res.status(400).json({ success: false, message: "Tous les champs du formulaires sont obligatoires." });
    }  

    if (!user_id) {
        return res.status(401).json({ success: false, message: "Vous devez être connecté pour ajouter une annonce." });
    }

    const queryAnnonces = `
      INSERT INTO annoncesval (titre, description, prix, user_id)
      VALUES (?, ?, ?, ?)
    `;
  
    db.run(queryAnnonces, [titre, description, prix, user_id], function (err) {
      if (err) {
        console.error("Erreur lors de l'ajout de l'annonce :", err.message);
        return res.status(500).json({ message: "Erreur interne du serveur." });
      }

      //const annonce_id = this.lastID;

    //   const queryDepot = `
    //         INSERT INTO depot (user_id, annonce_id)
    //         VALUES (?, ?)
    //     `;

    //    db.run(queryDepot, [user_id, annonce_id], function(err) {
    //         if (err) {
    //             console.error("Erreur lors de l'ajout de l'entrée dans la table depot :", err.message);
    //             return res.status(500).json({ message: "Erreur lors de l'ajout à la table depot." });
    //         }

    //    console.log(`Annonce ajoutée avec succès, et l'utilisateur ${user_id} l'a déposée.`);
    //    return res.status(200).json({ success: true, redirectUrl: '/depot' });
    //    })
     })
 }

 function traitSupp (req, res) {
    const annonce_id = req.params.id;

    const query = `DELETE FROM annonces WHERE id = ?`;
    db.run(query, [annonce_id], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression de l'annonce:", err.message);
            return res.status(500).send('Erreur interne du serveur');
        }

        console.log(`Annonce ${annonce_id} supprimée avec succès.`);
        return res.redirect('/depot'); 
    });
 }

 function traitModif(req, res) {
    const annonce_id = req.params.id;  
    const { titre, description, prix } = req.body;  

    if (!annonce_id || !titre || !description || !prix) {
        return res.status(400).send('Données manquantes');
    }

    const queryGetUserId = `SELECT user_id FROM annonces WHERE id = ?`;
    db.get(queryGetUserId, [annonce_id], (err, row) => {
        if (err) {
            console.error("Erreur lors de la récupération de user_id :", err.message);
            return res.status(500).send('Erreur interne du serveur lors de la récupération de user_id.');
        }

        if (!row) {
            return res.status(404).send('Annonce non trouvée.');
        }

        const user_id = row.user_id;  

        const queryInsertAnnonce = `
            INSERT INTO annoncesval (titre, description, prix, user_id, date_creation)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);
        `;
        
        db.run(queryInsertAnnonce, [titre, description, prix, user_id], function (err) {
            if (err) {
                console.error("Erreur lors de l'insertion dans annonces:", err.message);
                return res.status(500).send('Erreur interne du serveur lors de l\'insertion.');
            }

            const newAnnonceId = this.lastID;  

            
            const queryDeleteAnnonceVal = `DELETE FROM annonces WHERE id = ?`;

            db.run(queryDeleteAnnonceVal, [annonce_id], function (err) {
                if (err) {
                    console.error("Erreur lors de la suppression de l'annonce dans annoncesval:", err.message);
                    return res.status(500).send('Erreur interne du serveur lors de la suppression.');
                }

                console.log(`Annonce ${annonce_id} mise à jour et supprimée de annoncesval avec succès.`);
                return res.redirect('/depot');  // Redirige vers la page de dépôt après la mise à jour
            });
        });
    });
}


function showModif (req, res) {
    console.log('params.id', req.params.id);
    const annonce_id = req.params.id;
    console.log('annonce_id : ', annonce_id );
    const query = `SELECT * FROM annonces WHERE id = ?`;

    db.get(query, [annonce_id], (err, row) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'annonce:", err.message);
            return res.status(500).send('Erreur interne du serveur');
        }
        console.log('données recup' , row);
        if (!row) {
            return res.status(404).send('Annonce non trouvée');
        }else {
            return res.send(modifView(row));
        }
    });
}
 
 

 module.exports = { showAnnonce, showDepot, traitDepot, showDepAnn, traitSupp, traitModif, showModif};