// Importation des modules nécessaires
const panierView = require('../views/panierView'); // Vue pour afficher le panier
const db = require('../db/db'); // Module pour l'accès à la base de données
const jwt = require('jsonwebtoken'); // Module pour travailler avec JSON Web Tokens (JWT)
const secretKey = 'bon'; // Clé secrète pour JWT
const bcrypt = require('bcrypt'); // Module pour le hachage des mots de passe

/**
 * Affiche le panier de l'utilisateur avec les annonces et leur total
 * @param {object} req - Objet de la requête
 * @param {object} res - Objet de la réponse
 */
function showPanier(req, res) {
    const user_id = req.cookies.id; // Récupère l'ID de l'utilisateur depuis les cookies
    const role = req.cookies.role; // Récupère le rôle de l'utilisateur depuis les cookies

    // Vérifie si l'utilisateur est connecté, sinon redirige vers la page de connexion
    if (!user_id) {
        req.session.flash = { error: "Vous devez être connecté pour accéder à votre panier." }; // Message d'erreur
        return res.redirect('/login'); // Redirection vers la page de connexion
    }

    // Requête SQL pour récupérer les annonces et leur quantité dans le panier
    const query = `
        SELECT 
            a.id AS annonce_id, a.titre, a.prix, a.description, a.categorie, p.quantite, 
            i.url AS image_url
        FROM panier p
        JOIN annonces a ON p.annonces_id = a.id
        LEFT JOIN images_annonces ia ON ia.annonce_id = a.id
        LEFT JOIN images i ON ia.image_id = i.id
        WHERE p.user_id = ?;
    `;

    // Requête SQL pour récupérer le total du panier
    const totalQuery = `
        SELECT SUM(p.prix * c.quantite) AS total_panier
        FROM panier c
        JOIN annonces p ON c.annonces_id = p.id
        WHERE c.user_id = ?;
    `;

    // Exécution de la requête pour récupérer les annonces dans le panier
    db.all(query, [user_id], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération du panier:', err.message); // Log de l'erreur
            req.session.flash = { error: "Erreur lors de la récupération du panier." }; // Message d'erreur
            return res.redirect('/annonce'); // Redirection en cas d'erreur
        }
        console.log("Données récupérées pour le panier :", rows); // Log des données récupérées

        // Organiser les annonces et leurs images dans un objet
        const annonces = rows.reduce((acc, row) => {
            const annonceId = row.annonce_id; // ID de l'annonce
            if (!acc[annonceId]) {
                acc[annonceId] = {
                    id: annonceId, // ID de l'annonce
                    titre: row.titre, // Titre de l'annonce
                    prix: row.prix, // Prix de l'annonce
                    description: row.description, // Description de l'annonce
                    categorie: row.categorie, // Catégorie de l'annonce
                    quantite: row.quantite, // Quantité dans le panier
                    images: [], // Liste des images de l'annonce
                };
            }
            // Ajoute l'URL de l'image si elle existe
            if (row.image_url) {
                acc[annonceId].images.push(row.image_url);
            }
            return acc;
        }, {});

        // Exécution de la requête pour récupérer le total du panier
        db.get(totalQuery, [user_id], (err, totalRow) => {
            if (err) {
                console.error("Erreur lors du calcul du total :", err.message); // Log de l'erreur
                req.session.flash = { error: "Erreur lors du calcul du total." }; // Message d'erreur
                return res.redirect('/panier'); // Redirection en cas d'erreur
            }

            // Conversion de l'objet des annonces en tableau
            const annoncesArray = Object.values(annonces);
            console.log("annArray control : ", annoncesArray); // Log du tableau des annonces
            const totalPanier = totalRow?.total_panier || 0; // Calcul du total du panier
            const flash = res.locals.flash || {}; // Récupération des messages flash (erreur/succès)

            // Envoi de la vue panier avec les données récupérées et le total
            return res.send(panierView(annoncesArray, totalPanier, flash, role));
        });
    });
}

/**
 * Traite l'ajout d'une annonce au panier de l'utilisateur
 * @param {object} req - Objet de la requête
 * @param {object} res - Objet de la réponse
 */
function traitPanier(req, res) {
    const { annonces_id, quantite } = req.body; // Récupère les données du corps de la requête
    const user_id = req.cookies.id; // Récupère l'ID de l'utilisateur depuis les cookies
  
    // Vérifie si l'utilisateur est connecté
    if (!user_id) {
        console.log('ID utilisateur manquant');
        req.session.flash = { error: "ID utilisateur manquant." }; // Message d'erreur
        return res.redirect('/login'); // Redirige vers la page de connexion
    }

    // Vérifie si l'ID de l'annonce est fourni
    if (!annonces_id) {
        req.session.flash = { error: "ID annonce manquant." }; // Message d'erreur
        return res.redirect('/annonce'); // Redirige vers la page des annonces
    }
  
    // Requête SQL pour ajouter ou mettre à jour une annonce dans le panier
    const query = `
      INSERT INTO panier (user_id, annonces_id, quantite)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, annonces_id) DO UPDATE SET
        quantite = quantite + excluded.quantite;
    `;
  
    db.run(query, [user_id, annonces_id, quantite || 1], function (err) { // Ajoute ou met à jour le panier
      if (err) {
        req.session.flash = { error: "Erreur lors de l'ajout au panier." }; // Message d'erreur
        return res.redirect('/annonce'); // Redirige en cas d'erreur
      }
      req.session.flash = { success: "L'annonce a bien été ajoutée au panier." }; // Message de succès
      return res.redirect('/annonce'); // Redirige vers la page des annonces
    });
}

/**
 * Supprime une annonce du panier de l'utilisateur
 * @param {object} req - Objet de la requête
 * @param {object} res - Objet de la réponse
 */
function panierSupp(req, res) {
    const annonce_id = req.params.id; // Récupère l'ID de l'annonce à supprimer
    const user_id = req.cookies.id;  // Récupère l'ID de l'utilisateur
  
    // Vérifie si l'utilisateur est connecté
    if (!user_id) {
        req.session.flash = { error: "Id utilisateur manquant" }; // Message d'erreur
        return res.redirect('/login'); // Redirige vers la page de connexion
    }

    // Vérifie si l'ID de l'annonce est fourni
    if (!annonce_id) {
        console.log('ID annonce manquant');
        req.session.flash = { error: "ID annonce manquant." }; // Message d'erreur
        return res.redirect('/panier'); // Redirige vers la page du panier
    }

    // Requête SQL pour supprimer une annonce du panier
    const query = `DELETE FROM panier WHERE user_id = ? AND annonces_id = ?`;
    db.run(query, [user_id, annonce_id], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression de l'annonce:", err.message); // Log de l'erreur
            req.session.flash = { error: "Erreur lors de la suppression de l'annonce du panier." }; // Message d'erreur
            return res.redirect('/panier'); // Redirige en cas d'erreur
        }

        if (this.changes === 0) { // Si aucune ligne n'a été supprimée
            req.session.flash = { error: "L'annonce n'a pas été trouvée dans votre panier." }; // Message d'erreur
            return res.redirect('/panier'); // Redirige vers le panier
        }

        req.session.flash = { success: "L'annonce a été supprimée du panier." }; // Message de succès
        return res.redirect('/panier'); // Redirige vers le panier
    });
}

/**
 * Diminue la quantité d'une annonce dans le panier
 * @param {object} req - Objet de la requête
 * @param {object} res - Objet de la réponse
 */
function panierMoins(req, res) {
    const annonce_id = req.params.id; // Récupère l'ID de l'annonce
    const user_id = req.cookies.id; // Récupère l'ID de l'utilisateur

    // Vérifie si l'utilisateur est connecté
    if (!user_id) {
        req.session.flash = { error: "Id utilisateur manquant." }; // Message d'erreur
        return res.redirect('/login'); // Redirige vers la page de connexion
    }

    // Vérifie si l'ID de l'annonce est fourni
    if (!annonce_id) {
        console.log('ID annonce manquant');
        req.session.flash = { error: "ID annonce manquant." }; // Message d'erreur
        return res.redirect('/panier'); // Redirige vers le panier
    }

    // Requête SQL pour diminuer la quantité d'une annonce dans le panier
    const query = `UPDATE panier SET quantite = quantite - 1 WHERE user_id = ? AND annonces_id = ? AND quantite > 1`;
    db.run(query, [user_id, annonce_id], function(err) {
        if (err) {
            console.error("Erreur lors de la mise à jour de la quantité:", err.message); // Log de l'erreur
            req.session.flash = { error: "Erreur lors de la mise à jour de la quantité." }; // Message d'erreur
            return res.redirect('/panier'); // Redirige en cas d'erreur
        }

        if (this.changes === 0) { // Si aucune ligne n'a été modifiée
            req.session.flash = { error: "La quantité ne peut pas être diminuée." }; // Message d'erreur
            return res.redirect('/panier'); // Redirige vers le panier
        }

        req.session.flash = { success: "La quantité de l'annonce a été diminuée." }; // Message de succès
        return res.redirect('/panier'); // Redirige vers le panier
    });
}

/**
 * Augmente la quantité d'une annonce dans le panier
 * @param {object} req - Objet de la requête
 * @param {object} res - Objet de la réponse
 */
function panierPlus(req, res) {
    const annonce_id = req.params.id; // Récupère l'ID de l'annonce
    const user_id = req.cookies.id; // Récupère l'ID de l'utilisateur

    // Vérifie si l'utilisateur est connecté
    if (!user_id) {
        req.session.flash = { error: "Id utilisateur manquant." }; // Message d'erreur
        return res.redirect('/login'); // Redirige vers la page de connexion
    }

    // Vérifie si l'ID de l'annonce est fourni
    if (!annonce_id) {
        console.log('ID annonce manquant');
        req.session.flash = { error: "ID annonce manquant." }; // Message d'erreur
        return res.redirect('/panier'); // Redirige vers le panier
    }

    // Requête SQL pour augmenter la quantité d'une annonce dans le panier
    const query = `UPDATE panier SET quantite = quantite + 1 WHERE user_id = ? AND annonces_id = ?`;
    db.run(query, [user_id, annonce_id], function(err) {
        if (err) {
            console.error("Erreur lors de la mise à jour de la quantité:", err.message); // Log de l'erreur
            req.session.flash = { error: "Erreur lors de la mise à jour de la quantité." }; // Message d'erreur
            return res.redirect('/panier'); // Redirige en cas d'erreur
        }

        if (this.changes === 0) { // Si aucune ligne n'a été modifiée
            req.session.flash = { error: "La quantité ne peut pas être augmentée." }; // Message d'erreur
            return res.redirect('/panier'); // Redirige vers le panier
        }

        req.session.flash = { success: "La quantité de l'annonce a été augmentée." }; // Message de succès
        return res.redirect('/panier'); // Redirige vers le panier
    });
}

// Exporte les fonctions pour les utiliser dans d'autres fichiers
module.exports = { showPanier, traitPanier, panierSupp, panierMoins, panierPlus };
