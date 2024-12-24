const panierView = require ('../views/panierView');
const db = require ('../db/db');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const bcrypt = require('bcrypt');

function showPanier (req,res) {
    console.log("Panier avant affichage:", req.session.panier);
    const user_id = req.cookies.id; 
    const role =req.cookies.role;

    if (!user_id) {
        req.session.flash = { error: "Vous devez être connecté pour accéder à votre panier." };
        return res.redirect('/login')
    }
    const query = `SELECT a.id, a.titre, a.prix, a.description, p.quantite
                   FROM panier p
                   JOIN annonces a ON p.annonces_id = a.id
                   WHERE p.user_id = ?; `

    const totalQuery = `
        SELECT SUM(p.prix * c.quantite) AS total_panier
        FROM panier c
        JOIN annonces p ON c.annonces_id = p.id
        WHERE c.user_id = ?;
    `;

    db.all(query, [user_id], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération du panier:', err.message);
            req.session.flash = { error: "Erreur lors de la récupération du panier." };
            return res.redirect('/annonce')
        }

            db.get(totalQuery, [user_id], (err, totalRow) => {
                if (err) {
                    console.error("Erreur lors du calcul du total :", err.message);
                    req.session.flash = { error: "Erreur lors du clalcul du total." };
                    return res.redirect('/panier')
                }

            const totalPanier = totalRow?.total_panier || 0;
    
        // if (!rows || rows.length === 0) {    
        //     req.session.flash = { error: "Vous n'avez aucune annonce dans votre panier" };
        //     return res.redirect('/annonce')
        // }
        console.log("rows dans panierView:", rows);
        const flash = res.locals.flash || {};
        const htmlContent = panierView(rows, totalPanier, flash, role);
         return res.send(htmlContent);
      });
    });
 }

function traitPanier(req, res) {
    const {annonces_id, quantite } = req.body;
    const user_id = req.cookies.id; 
  
    if (!user_id) {
        console.log('ID utilisateur manquant');
        req.session.flash = { error: "ID utilisateur manquant." };
        return res.redirect('/login')
    }

    if (!annonces_id) {
        console.log('ID annonce manquant');
        req.session.flash = { error: "ID annonce manquant." };
        return res.redirect('/annonce')
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
        req.session.flash = { error: "Erreur lors de l'ajout au panier." };
        return res.redirect('/annonce')
      }
      req.session.flash = { success: "L'annonce a bien été ajoutée au panier." };
      
      return res.redirect('/annonce'); 
    });
  }

  function panierSupp(req, res) {
    const annonce_id = req.params.id; 
    const user_id = req.cookies.id;  
   
    if (!user_id) {
        req.session.flash = { error: "Id utilisateur manquant" };
        return res.redirect('/login');
    }

    if (!annonce_id) {
        console.log('ID annonce manquant');
        req.session.flash = { error: "ID annonce manquant." };
        return res.redirect('/panier')
    }

    const query = `DELETE FROM panier WHERE user_id = ? AND annonces_id = ?`;
    db.run(query, [user_id, annonce_id], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression de l'annonce:", err.message);
            req.session.flash = { error: "Erreur lors de la suppression de l'annonce du panier." };
            return res.redirect('/panier');
        }

        if (this.changes === 0) { 
            req.session.flash = { error: "L'annonce n'a pas été trouvée dans votre panier." };
            return res.redirect('/panier');
        }

        req.session.flash = { success: "L'annonce a été supprimée du panier." };
        return res.redirect('/panier'); 
    });
}

function panierMoins(req, res) {
    const annonce_id = req.params.id;
    const user_id = req.cookies.id;

    
    if (!user_id) {
        req.session.flash = { error: "Id utilisateur manquant." };
        return res.redirect('/login');
    }

    if (!annonce_id) {
        console.log('ID annonce manquant');
        req.session.flash = { error: "ID annonce manquant." };
        return res.redirect('/panier')
    }

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

    
    if (!user_id) {
        req.session.flash = { error: "Id utilisateur manquant." };
        return res.redirect('/login');
    }

    if (!annonce_id) {
        console.log('ID annonce manquant');
        req.session.flash = { error: "ID annonce manquant." };
        return res.redirect('/panier')
    }

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

  module.exports = {showPanier, traitPanier, panierSupp, panierMoins, panierPlus}