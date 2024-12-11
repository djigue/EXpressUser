const annonceView = require ('../views/annonceView');
const depotView = require ('../views/depotView');
const depAnnView = require('../views/depAnnView');
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

    const query = `
        SELECT a.titre, a.description, a.prix
        FROM depot d
        JOIN annonces a ON d.annonce_id = a.id
        WHERE d.user_id = ?;
    `;
    
    db.all(query, [user_id], (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des annonces:", err.message);
            return res.status(500).send('Erreur interne du serveur');
        }

        console.log("Données récupérées du dépôt :", rows);

        if (!rows || rows.length === 0) {
            return res.send('<html><body><h1>Aucune annonce trouvée.</h1></body></html>');
        }

        const htmlContent = depAnnView(rows);
        return res.send(htmlContent); 
    });
}

 function traitDepot (req, res) {
    console.log('Requête reçue sur /panier');
    const {titre, description, prix} = req.body;

    console.log('Données reçues :', {titre, description, prix});

    if (!titre || !description || !prix) {
        console.log('Champs manquants');
        return res.status(400).json({ success: false, message: "Tous les champs du formulaires sont obligatoires." });
    }

    const user_id = req.cookies.id;  

    if (!user_id) {
        return res.status(401).json({ success: false, message: "Vous devez être connecté pour ajouter une annonce." });
    }

    const queryAnnonces = `
      INSERT INTO annonces (titre, description, prix)
      VALUES (?, ?, ?)
    `;
  
    db.run(queryAnnonces, [titre, description, prix], function (err) {
      if (err) {
        console.error("Erreur lors de l'ajout de l'annonce :", err.message);
        return res.status(500).json({ message: "Erreur interne du serveur." });
      }

      const annonce_id = this.lastID;

      const queryDepot = `
            INSERT INTO depot (user_id, annonce_id)
            VALUES (?, ?)
        `;

       db.run(queryDepot, [user_id, annonce_id], function(err) {
            if (err) {
                console.error("Erreur lors de l'ajout de l'entrée dans la table depot :", err.message);
                return res.status(500).json({ message: "Erreur lors de l'ajout à la table depot." });
            }

       console.log(`Annonce ajoutée avec succès, et l'utilisateur ${user_id} l'a déposée.`);
       return res.status(200).json({ success: true, redirectUrl: '/depot' });
       })
    })
 }
 

 module.exports = { showAnnonce, showDepot, traitDepot, showDepAnn};