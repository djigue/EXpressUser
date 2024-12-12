const db = require ('../db/db');
const deleteView = require ('../views/deleteView');
const adminView = require('../views/adminView');

function showDelete (req,res) {
    res.send(deleteView());
 }

 function traitDelete(req, res) {
    const {id} = req.body;

    if (!id) {
        return res.status(400).send("id manquant.");
    }

    const query = `DELETE FROM users WHERE id= ?`;

    db.run(query, [id], (err) => {
        if (err) {
            console.error("Erreur lors de la recherche de l'utilisateur :", err.message);
            return res.status(500).send("Erreur interne du serveur.");
        }

        if (this.changes === 0) {
            return res.status(401).send("Aucun utilisateur avec cet ID.");
        }else {
            res.send("Suppession réussie !");
        }
    });
}

function showAdmin (req, res) {
    db.all('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err);
            return res.status(500).send('Erreur lors de la récupération des utilisateurs');
        }

        db.all('SELECT * FROM produits', (err, produits) => {
            if (err) {
                console.error('Erreur lors de la récupération des produits:', err);
                return res.status(500).send('Erreur lors de la récupération des produits');
            }

        db.all('SELECT * FROM annonces', (err, annonces) => {
            if (err) {
                console.error('Erreur lors de la récupération des annonces:', err);
                return res.status(500).send('Erreur lors de la récupération des annonces');
            }

        db.all('SELECT * FROM annoncesval', (err, annoncesval) => {
            if (err) {
                console.error('Erreur lors de la récupération des annonces en attente:', err);
                return res.status(500).send('Erreur lors de la récupération des annonces en attente');
            }

        res.send(adminView(users, produits, annonces, annoncesval));

                });
            });
        });
    }); 
}

function suppUser(req, res) {
    const userId = req.params.id || req.body.id;
    if (!userId) {
        return res.status(400).send('ID utilisateur manquant.');
    }

    const deleteAnnoncesValQuery = 'DELETE FROM annoncesval WHERE user_id = ?';
    db.run(deleteAnnoncesValQuery, [userId], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression des annonces dans annoncesval:", err.message);
            return res.status(500).send('Erreur lors de la suppression des annonces val.');
        }

        const deleteAnnoncesQuery = 'DELETE FROM annonces WHERE user_id = ?';
        db.run(deleteAnnoncesQuery, [userId], function (err) {
            if (err) {
                console.error("Erreur lors de la suppression des annonces:", err.message);
                return res.status(500).send('Erreur lors de la suppression des annonces.');
            }

            const deleteDepotQuery = 'DELETE FROM depot WHERE user_id = ?';
            db.run(deleteDepotQuery, [userId], function (err) {
                if (err) {
                    console.error("Erreur lors de la suppression des entrées dans depot:", err.message);
                    return res.status(500).send('Erreur lors de la suppression des entrées dans depot.');
                }

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
                    res.redirect('/admin');
                });
            });
        });
    });
}


function suppProd (req, res) {
    const produitId = req.params.id || req.body.id;

    if (!produitId) {
        return res.status(400).send('ID produit manquant.');
    }

    const query ='DELETE FROM produits WHERE id = ?';

    db.run(query, [produitId], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors de la suppression du produit.');
        }

        if (this.changes === 0) {
            return res.status(404).send('Produit non trouvé.');
        }
        console.log('id prod :', produitId)
        res.redirect('/admin');
    })
}; 

function suppAnn (req, res) {
    const annonceId = req.params.id || req.body.id;
    console.log("ID reçu :", annonceId);
    if (!annonceId) {
        return res.status(400).send('ID annonce manquant.');
    }

    const query = 'DELETE FROM annonces WHERE id = ?'
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
        res.redirect('/admin');
    })
};     

function validAnnonce (req, res) {
    const annonceId = req.params.id || req.body.id;

    if (!annonceId) {
        return res.status(400).send("ID annonce manquant.");
    }

    db.serialize(() => {
        
        const queryGetUserId = `
            SELECT user_id FROM annoncesval WHERE id = ?;
        `;
        
        db.get(queryGetUserId, [annonceId], (err, row) => {
            if (err) {
                console.error("Erreur lors de la récupération de l'ID utilisateur :", err.message);
                return res.status(500).send("Erreur interne du serveur.");
            }

            if (!row) {
                return res.status(404).send("Annonce non trouvée.");
            }

            const userId = row.user_id;

            const queryInsertAnnonce = `
                INSERT INTO annonces (titre, description, prix, date_creation, user_id)
                SELECT titre, description, prix, date_creation, user_id
                FROM annoncesval
                WHERE id = ?;
            `;

            db.run(queryInsertAnnonce, [annonceId], function (err) {
                if (err) {
                    console.error("Erreur lors de l'insertion dans annonces :", err.message);
                    return res.status(500).send("Erreur lors de la validation de l'annonce.");
                }

                const newAnnonceId = this.lastID;

                const queryInsertDepot = `
                    INSERT INTO depot (user_id, annonce_id)
                    VALUES (?, ?);
                `;

                db.run(queryInsertDepot, [userId, newAnnonceId], function (err) {
                    if (err) {
                        console.error("Erreur lors de l'insertion dans depot :", err.message);
                        return res.status(500).send("Erreur lors de la validation de l'annonce.");
                    }

                    const queryDeleteAnnoncesVal = `
                        DELETE FROM annoncesval WHERE id = ?;
                    `;

                    db.run(queryDeleteAnnoncesVal, [annonceId], function (err) {
                        if (err) {
                            console.error("Erreur lors de la suppression de l'annonce dans annoncesval :", err.message);
                            return res.status(500).send("Erreur lors de la validation de l'annonce.");
                        }

                        console.log(`Annonce ID ${annonceId} validée avec succès.`);
                        res.redirect("/admin");
                    });
                });
            });
        });
    });
}



module.exports = {showDelete, traitDelete, showAdmin, suppUser, suppProd, suppAnn, validAnnonce};