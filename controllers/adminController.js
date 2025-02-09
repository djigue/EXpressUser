const db = require ('../db/db');  // Connexion à la base de données
const adminView = require('../views/adminView');  // Vue pour l'administration
const adminUserView = require('../views/adminUserView');  // Vue pour la gestion des utilisateurs
const adminAnnonceView = require('../views/adminAnnonceView');  // Vue pour les annonces
const adminAnnoncevalView = require('../views/adminAnnoncevalView');  // Vue pour les annonces validées

// Affiche la vue de suppression
// @function showDelete
function showDelete (req,res) {
    res.send(deleteView());  // Envoie la vue de suppression
}

// Affiche la page principale de l'administration avec le nombre d'utilisateurs, d'annonces, et d'annonces validées
// @function showAdmin
function showAdmin (req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur
    const flash = res.locals.flash || {};  // Récupère les messages flash
    const queryUsers = 'SELECT COUNT(*) AS total_users FROM users';  // Compte le nombre d'utilisateurs

    db.get(queryUsers, (err, row) => {
        if (err) {
            console.error('Erreur lors de la récupération du nombre d\'utilisateurs :', err.message);
            return res.status(500).send('Erreur interne du serveur');
        }

        const totalUsers = row ? row.total_users : 0;

        const queryAnnonces = 'SELECT COUNT(*) AS total_annonces FROM annonces';  // Compte le nombre d'annonces
        db.get(queryAnnonces, (err, row) => {
            if (err) {
                console.error('Erreur lors de la récupération du nombre d\'annonce :', err.message);
                return res.status(500).send('Erreur interne du serveur');
            }

            const totalAnnonces = row ? row.total_annonces : 0;

            const queryAnnoncesval = 'SELECT COUNT(*) AS total_annoncesval FROM annoncesval';  // Compte les annonces validées
            db.get(queryAnnoncesval, (err, row) => {
                if (err) {
                    console.error('Erreur lors de la récupération du nombre d\'annoncesval :', err.message);
                    return res.status(500).send('Erreur interne du serveur');
                }

                const totalAnnoncesval = row ? row.total_annoncesval : 0;

                // Envoie la vue d'administration avec les résultats des requêtes
                res.send(adminView(totalUsers, totalAnnonces, totalAnnoncesval, flash, role));
            });
        });
    });
}

// Affiche la page de gestion des utilisateurs avec les informations des utilisateurs
// @function showAdminUser
function showAdminUser (req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur
    const flash = res.locals.flash || {};  // Récupère les messages flash

    db.all('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err);
            return res.status(500).send('Erreur lors de la récupération des utilisateurs');
        }
        // Envoie la vue des utilisateurs avec les informations nécessaires
        res.send(adminUserView(users, flash, role));
    });
}

// Affiche la page des annonces avec les images associées
// @function showAdminAnnonce
function showAdminAnnonce (req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur
    db.all(`
        SELECT annonces.*, images.url 
        FROM annonces 
        LEFT JOIN images_annonces ON annonces.id = images_annonces.annonce_id 
        LEFT JOIN images ON images.id = images_annonces.image_id
    `, (err, annoncesWithImages) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces:', err);
            return res.status(500).send('Erreur lors de la récupération des annonces');
        }
        
        // Regroupe les annonces par ID et associe les images correspondantes
        const annoncesGrouped = annoncesWithImages.reduce((acc, row) => {
            const annonceId = row.id;

            if (!acc[annonceId]) {
                acc[annonceId] = {
                    ...row, 
                    images: [] 
                };
            }

            if (row.url) {
                acc[annonceId].images.push(row.url);
            }

            return acc;
        }, {});

        const annoncesFinal = Object.values(annoncesGrouped);
        const flash = res.locals.flash;  // Récupère les messages flash
        // Envoie la vue des annonces avec les images associées
        res.send(adminAnnonceView(annoncesFinal, flash, role));
    });
}

// Affiche la page des annonces en attente de validation avec les images associées
// @function showAdminAnnonceval
function showAdminAnnonceval (req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur

    const query = `
        SELECT annoncesval.*, images.url
        FROM annoncesval
        LEFT JOIN images_annoncesval ON annoncesval.id = images_annoncesval.annonceval_id
        LEFT JOIN images ON images.id = images_annoncesval.image_id
    `;

    db.all(query, (err, annoncesvalWithImages) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces en attente:', err);
            return res.status(500).send('Erreur lors de la récupération des annonces en attente');
        }

        // Regroupe les annonces en attente de validation par ID et associe les images
        const annoncesvalGrouped = annoncesvalWithImages.reduce((acc, row) => {
            const annonceId = row.id;

            if (!acc[annonceId]) {
                acc[annonceId] = {
                    ...row, 
                    images: [] 
                };
            }

            if (row.url) {
                acc[annonceId].images.push(row.url);
            }

            return acc;
        }, {});

        const annoncesvalFinal = Object.values(annoncesvalGrouped);
        const flash = res.locals.flash;  // Récupère les messages flash
        // Envoie la vue des annonces en attente de validation avec les images
        res.send(adminAnnoncevalView(annoncesvalFinal, flash, role));
    });
}

// Traite la suppression d'un utilisateur
// @function traitDelete
function traitDelete(req, res) {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send("ID manquant.");
    }

    const query = `DELETE FROM users WHERE id = ?`;

    db.run(query, [id], (err) => {
        if (err) {
            console.error("Erreur lors de la suppression de l'utilisateur :", err.message);
            return res.status(500).send("Erreur interne du serveur.");
        }

        if (this.changes === 0) {
            return res.status(401).send("Aucun utilisateur avec cet ID.");
        } else {
            res.send("Suppression réussie !");
        }
    });
}

// Supprime un utilisateur et toutes ses données associées (annonces, dépôts)
// @function suppUser
function suppUser(req, res) {
    const userId = req.params.id || req.body.id;
    if (!userId) {
        return res.status(400).send('ID utilisateur manquant.');
    }

    // Suppression des annonces validées associées à l'utilisateur
    const deleteAnnoncesValQuery = 'DELETE FROM annoncesval WHERE user_id = ?';
    db.run(deleteAnnoncesValQuery, [userId], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression des annonces dans annoncesval:", err.message);
            return res.status(500).send('Erreur lors de la suppression des annonces val.');
        }

        // Suppression des annonces de l'utilisateur
        const deleteAnnoncesQuery = 'DELETE FROM annonces WHERE user_id = ?';
        db.run(deleteAnnoncesQuery, [userId], function (err) {
            if (err) {
                console.error("Erreur lors de la suppression des annonces:", err.message);
                return res.status(500).send('Erreur lors de la suppression des annonces.');
            }

            // Suppression des entrées dans le dépôt associées à l'utilisateur
            const deleteDepotQuery = 'DELETE FROM depot WHERE user_id = ?';
            db.run(deleteDepotQuery, [userId], function (err) {
                if (err) {
                    console.error("Erreur lors de la suppression des entrées dans depot:", err.message);
                    return res.status(500).send('Erreur lors de la suppression des entrées dans depot.');
                }

                // Suppression de l'utilisateur
                const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
                db.run(deleteUserQuery, [userId], function (err) {
                    if (err) {
                        console.error("Erreur lors de la suppression de l'utilisateur:", err.message);
                        return res.status(500).send('Erreur lors de la suppression de l\'utilisateur.');
                    }

                    if (this.changes === 0) {
                        return res.status(404).send('Utilisateur non trouvé.');
                    }

                    console.log(`Utilisateur ${userId} et ses annonces supprimés avec succès.`);
                    req.session.flash = { success: "L'utilisateur a bien été supprimé." };
                    res.redirect('/admin/user');
                });
            });
        });
    });
};


/**
 * Supprime une annonce de la base de données.
 * @function suppAnn
 * @param {Object} req - L'objet de la requête HTTP.
 * @param {Object} res - L'objet de la réponse HTTP.
 * @returns {Object} - La réponse HTTP avec un statut et un message appropriés.
 */
function suppAnn(req, res) {
    const annonceId = req.params.id || req.body.id;
    console.log("ID reçu :", annonceId);
    if (!annonceId) {
        return res.status(400).send('ID annonce manquant.');
    }

    const query = 'DELETE FROM annonces WHERE id = ?';
    db.run(query, [annonceId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors de la suppression de l\'annonce.');
        }

        if (this.changes === 0) {
            console.error("Aucune annonce trouvée avec l'ID :", annonceId);
            return res.status(404).send('Annonce non trouvée.');
        }
        console.log(`Annonce supprimée avec succès : ID ${annonceId}`);
        req.session.flash = { success: "L'annonce a bien été supprimée." };
        res.redirect('/admin/annonce');
    });
}

/**
 * Valide une annonce et la transfère dans la table des annonces confirmées.
 * @function validAnnonce
 * @param {Object} req - L'objet de la requête HTTP.
 * @param {Object} res - L'objet de la réponse HTTP.
 * @returns {Object} - La réponse HTTP avec un statut et un message appropriés.
 */
function validAnnonce(req, res) {
    const annonceId = req.params.id || req.body.id;

    if (!annonceId) {
        return res.status(400).send("ID annonce manquant.");
    }

    db.serialize(() => {
        // Récupérer l'ID de l'utilisateur et la catégorie de l'annonce en attente
        const queryGetUserId = `
            SELECT user_id, categorie
            FROM annoncesval 
            WHERE id = ?;
        `;
        
        db.get(queryGetUserId, [annonceId], (err, row) => {
            if (err) {
                console.error("Erreur lors de la récupération de l'ID utilisateur :", err.message);
                return res.status(500).send("Erreur interne du serveur.");
            }

            if (!row) {
                return res.status(404).send("Annonce non trouvée.");
            }

            const {user_id: userId, categorie} = row;

            // Insérer l'annonce validée dans la table "annonces"
            const queryInsertAnnonce = `
                INSERT INTO annonces (titre, description, prix, date_creation, categorie, user_id)
                SELECT titre, description, prix, date_creation, ?, user_id
                FROM annoncesval
                WHERE id = ?;
            `;

            db.run(queryInsertAnnonce, [categorie, annonceId], function (err) {
                if (err) {
                    console.error("Erreur lors de l'insertion dans annonces :", err.message);
                    return res.status(500).send("Erreur lors de la validation de l'annonce.");
                }

                const newAnnonceId = this.lastID;

                // Récupérer les images associées à l'annonce
                const queryGetImages = `
                    SELECT url, id 
                    FROM images
                    WHERE id IN (
                    SELECT image_id 
                    FROM images_annoncesval 
                    WHERE annonceval_id = ?);
                `;
                db.all(queryGetImages, [annonceId], (err, images) => {
                    if (err) {
                        console.error("Erreur lors de la récupération des images :", err.message);
                        return res.status(500).send("Erreur lors de la validation de l'annonce.");
                    }

                    if (!images || images.length === 0) {
                        console.log("Aucune image trouvée pour cette annonceval.");
                    } else {
                        const queryInsertImages = `
                            INSERT INTO images_annonces (image_id, annonce_id)
                            VALUES (?, ?);
                        `;
                        // Insérer les images associées à l'annonce validée
                        images.forEach((image) => {
                            const imageId = image.id; 
                            console.log("imageId : ", imageId);
                            db.run(queryInsertImages, [imageId, newAnnonceId], (err) => {
                                if (err) {
                                    console.error("Erreur lors de l'insertion dans images_annonces :", err.message);
                                }
                            });
                        });
                    }

                    // Ajouter l'annonce validée dans la table "depot"
                    const queryInsertDepot = `
                        INSERT INTO depot (user_id, annonce_id)
                        VALUES (?, ?);
                    `;
                    
                    db.run(queryInsertDepot, [userId, newAnnonceId], function (err) {
                        if (err) {
                            console.error("Erreur lors de l'insertion dans depot :", err.message);
                            return res.status(500).send("Erreur lors de la validation de l'annonce.");
                        }

                        // Supprimer l'annonce de la table des annonces en attente
                        const queryDeleteAnnoncesVal = `
                            DELETE FROM annoncesval WHERE id = ?;
                        `;

                        db.run(queryDeleteAnnoncesVal, [annonceId], function (err) {
                            if (err) {
                                console.error("Erreur lors de la suppression de l'annonce dans annoncesval :", err.message);
                                return res.status(500).send("Erreur lors de la validation de l'annonce.");
                            }

                            console.log(`Annonce ID ${annonceId} validée avec succès.`);
                            req.session.flash = { success: "L'annonce a bien été validée." };
                            res.redirect("/admin/annonceval");
                        });
                    });
                });
            });
        });
    });
};

module.exports = {showDelete, traitDelete, showAdmin, showAdminUser, showAdminAnnonce, showAdminAnnonceval, suppUser, suppAnn, validAnnonce};
