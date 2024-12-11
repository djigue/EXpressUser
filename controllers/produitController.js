const productView = require ('../views/productView');
const panierView = require ('../views/panierView');
const db = require ('../db/db');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const bcrypt = require('bcrypt');

function showProduct(req, res) {
    const query = 'SELECT * FROM produits'; 

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits:', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        if (!rows || rows.length === 0) {
            if (!res.headersSent) {
                return res.send('<html><body><h1>Aucun produit trouvé.</h1></body></html>');
            }
            return;
        }

        const htmlContent = productView(rows);
        if (!res.headersSent) {
            return res.send(htmlContent);
        }
    });
}

function showPanier (req,res) {
    console.log("bien arrivé sur /panier");
    const user_id = req.cookies.id; 
    console.log(req.cookies.id);
    if (!user_id) {
        return res.status(401).send("Vous devez être connecté pour accéder à votre panier.");
    }
    const query = `SELECT p.nom, p.prix, c.quantite
                   FROM panier c
                   JOIN produits p ON c.produit_id = p.id 
                   WHERE c.user_id = ?; `
    console.log("Exécution de la requête pour récupérer le panier avec user_id:", user_id)
    db.all(query, [user_id], (err, rows) => {
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

        const htmlContent = panierView(rows);
        if (!res.headersSent) {
            return res.send(htmlContent);
        }
    });
 }

function traitPanier(req, res) {
    console.log('Requête reçue sur /panier');
    const { user_id, produit_id, quantite } = req.body;

    console.log('Données reçues :', { user_id, produit_id, quantite }); 
  
    if (!user_id || !produit_id) {
        console.log('ID utilisateur ou ID produit manquant');
        return res.status(400).json({ success: false, message: "L'ID utilisateur et l'ID produit sont obligatoires." });
    }
  
    const query = `
      INSERT INTO panier (user_id, produit_id, quantite)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, produit_id) DO UPDATE SET
        quantite = quantite + excluded.quantite;
    `;
  
    db.run(query, [user_id, produit_id, quantite || 1], function (err) {
      if (err) {
        console.error("Erreur lors de l'ajout au panier :", err.message);
        return res.status(500).json({ message: "Erreur interne du serveur." });
      }
      res.json({ message: "Produit ajouté au panier avec succès !" });
    });
  }

  module.exports = {showProduct, showPanier, traitPanier}