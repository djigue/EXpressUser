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
    const flash = req.session.flash || {};
    delete req.session.flash;
    console.log("bien arrivé sur /panier");
    const user_id = req.cookies.id; 
    if (!user_id) {
        return res.status(401).send("Vous devez être connecté pour accéder à votre panier.");
    }
    const query = `SELECT a.id, a.titre, a.prix, a.description, p.quantite
                   FROM panier p
                   JOIN annonces a ON p.annonces_id = a.id
                   WHERE p.user_id = ?; `
    console.log("Exécution de la requête pour récupérer le panier avec user_id:", user_id);

    const totalQuery = `
        SELECT SUM(p.prix * c.quantite) AS total_panier
        FROM panier c
        JOIN annonces p ON c.annonces_id = p.id
        WHERE c.user_id = ?;
    `;

    db.all(query, [user_id], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération du panier:', err.message);
            return res.status(500).send('Erreur interne du serveur');
        }

            db.get(totalQuery, [user_id], (err, totalRow) => {
                if (err) {
                    console.error("Erreur lors du calcul du total :", err.message);
                    return res.status(500).send("Erreur interne du serveur");
                }

            const totalPanier = totalRow?.total_panier || 0;
    
                console.log("Total général du panier :", totalPanier);
    
        if (!rows || rows.length === 0) {    
            req.session.flash = { error: "Aucune annonce trouvée" };
            return res.redirect('/annonce')
        }

        const htmlContent = panierView(rows, totalPanier, res.locals.flash);
         return res.send(htmlContent);
      });
    });
 }

function traitPanier(req, res) {
    console.log('Requête reçue sur /panier');
    const {annonces_id, quantite } = req.body;
    const user_id = req.cookies.id; 

    console.log('Données reçues :', { user_id, annonces_id, quantite }); 
  
    if (!user_id || !annonces_id) {
        console.log('ID utilisateur ou ID annonce manquant');
        return res.status(400).json({ success: false, message: "L'ID utilisateur et l'ID annonce sont obligatoires." });
    }
  
    const query = `
      INSERT INTO panier (user_id, annonces_id, quantite)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, annonces_id) DO UPDATE SET
        quantite = quantite + excluded.quantite;
    `;
  
    db.run(query, [user_id, annonces_id, quantite || 1], function (err) {
      if (err) {
        console.error("Erreur lors de l'ajout au panier :", err.message);
        return res.status(500).json({ message: "Erreur interne du serveur." });
      }
      req.session.flash = { success: "L'annonce a bien été ajoutée au panier." };
      return res.redirect('/annonce'); 
    });
  }

  function panierSupp(req, res) {
    console.log("Entrée dans panierSupp");
    const annonce_id = req.params.id; // ID de l'annonce à supprimer
    const user_id = req.cookies.id;  // Assurez-vous que l'ID de l'utilisateur est bien dans les cookies
    console.log("user_id:", user_id);
    // Vérifier que l'ID de l'utilisateur et l'ID de l'annonce existent
    if (!user_id || !annonce_id) {
        req.session.flash = { error: "L'utilisateur ou l'annonce est introuvable." };
        return res.redirect('/panier');
    }

    const query = `DELETE FROM panier WHERE user_id = ? AND annonces_id = ?`;
    console.log("Exécution de la requête DELETE avec user_id:", user_id, "et annonce_id:", annonce_id);
    // Exécution de la requête de suppression dans la base de données
    db.run(query, [user_id, annonce_id], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression de l'annonce:", err.message);
            req.session.flash = { error: "Erreur lors de la suppression de l'annonce du panier." };
            return res.redirect('/panier');
        }

        if (this.changes === 0) {  // Si aucune ligne n'a été supprimée
            req.session.flash = { error: "L'annonce n'a pas été trouvée dans votre panier." };
            return res.redirect('/panier');
        }

        console.log(`Annonce ${annonce_id} supprimée du panier avec succès.`);
        req.session.flash = { success: "L'annonce a été supprimée du panier." };
        return res.redirect('/panier'); 
    });
}

function panierMoins(req, res) {
    const annonce_id = req.params.id;
    const user_id = req.cookies.id;

    // Assurez-vous que l'ID de l'utilisateur et l'ID de l'annonce existent
    if (!user_id || !annonce_id) {
        req.session.flash = { error: "L'utilisateur ou l'annonce est introuvable." };
        return res.redirect('/panier');
    }

    // Requête pour diminuer la quantité de 1 dans le panier
    const query = `UPDATE panier SET quantite = quantite - 1 WHERE user_id = ? AND annonces_id = ? AND quantite > 1`;

    db.run(query, [user_id, annonce_id], function(err) {
        if (err) {
            console.error("Erreur lors de la mise à jour de la quantité:", err.message);
            req.session.flash = { error: "Erreur lors de la mise à jour de la quantité." };
            return res.redirect('/panier');
        }

        if (this.changes === 0) {
            req.session.flash = { error: "La quantité ne peut pas être diminuée." };
            return res.redirect('/panier');
        }

        req.session.flash = { success: "La quantité de l'annonce a été diminuée." };
        return res.redirect('/panier');
    });
}

function panierPlus(req, res) {
    const annonce_id = req.params.id;
    const user_id = req.cookies.id;

    // Assurez-vous que l'ID de l'utilisateur et l'ID de l'annonce existent
    if (!user_id || !annonce_id) {
        req.session.flash = { error: "L'utilisateur ou l'annonce est introuvable." };
        return res.redirect('/panier');
    }

    // Requête pour diminuer la quantité de 1 dans le panier
    const query = `UPDATE panier SET quantite = quantite + 1 WHERE user_id = ? AND annonces_id = ?`;

    db.run(query, [user_id, annonce_id], function(err) {
        if (err) {
            console.error("Erreur lors de la mise à jour de la quantité:", err.message);
            req.session.flash = { error: "Erreur lors de la mise à jour de la quantité." };
            return res.redirect('/panier');
        }

        if (this.changes === 0) {
            req.session.flash = { error: "La quantité ne peut pas être augmenté." };
            return res.redirect('/panier');
        }

        req.session.flash = { success: "La quantité de l'annonce a été augmenté." };
        return res.redirect('/panier');
    });
}

  module.exports = {showProduct, showPanier, traitPanier, panierSupp, panierMoins, panierPlus}