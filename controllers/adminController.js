const db = require ('../db/db');
const deleteView = require ('../views/deleteView');
const adminView = require('../views/adminView');
const adminUserView =require('../views/adminUserView');
const adminAnnonceView = require('../views/adminAnnonceView');
const adminAnnoncevalView = require('../views/adminAnnoncevalView');

function showDelete (req,res) {
    
    res.send(deleteView());
 }

function showAdmin (req, res) {
    const role =req.cookies.role;
    // db.all('SELECT * FROM users', (err, users) => {
    //     if (err) {
    //         console.error('Erreur lors de la récupération des utilisateurs:', err);
    //         return res.status(500).send('Erreur lors de la récupération des utilisateurs');
    //     }

            // db.all(`
            //     SELECT annonces.*, images.url 
            //     FROM annonces 
            //     LEFT JOIN images_annonces ON annonces.id = images_annonces.annonce_id 
            //     LEFT JOIN images ON images.id = images_annonces.image_id
            // `, (err, annoncesWithImages) => {
            // if (err) {
            //     console.error('Erreur lors de la récupération des annonces:', err);
            //     return res.status(500).send('Erreur lors de la récupération des annonces');
            // }
            // const annoncesGrouped = annoncesWithImages.reduce((acc, row) => {
            //     const annonceId = row.id;
        
            //     if (!acc[annonceId]) {
            //       acc[annonceId] = {
            //         ...row, 
            //         images: [] 
            //       };
            //     }
            
            //     if (row.url) {
            //       acc[annonceId].images.push(row.url);
            //     }
            
            //     return acc;
            //   }, {});
            
            //   const annoncesFinal = Object.values(annoncesGrouped);

        //     const query = `
        //     SELECT annoncesval.*, images.url
        //     FROM annoncesval
        //     LEFT JOIN images_annoncesval ON annoncesval.id = images_annoncesval.annonceval_id
        //     LEFT JOIN images ON images.id = images_annoncesval.image_id
        //      `;

        // db.all(query, (err, annoncesvalWithImages) => {
        //     if (err) {
        //         console.error('Erreur lors de la récupération des annonces en attente:', err);
        //         return res.status(500).send('Erreur lors de la récupération des annonces en attente');
        //     }

        //     const annoncesvalGrouped = annoncesvalWithImages.reduce((acc, row) => {
        //         const annonceId = row.id;
            
        //         if (!acc[annonceId]) {
        //           acc[annonceId] = {
        //             ...row, 
        //             images: [] 
        //           };
        //         }
            
        //         if (row.url) {
        //           acc[annonceId].images.push(row.url);
        //         }
            
        //         return acc;
        //       }, {});
            
        //       const annoncesvalFinal = Object.values(annoncesvalGrouped);
              const flash = res.locals.flash || {};
        res.send(adminView(flash, role));

                //});
           // }); 
}

function showAdminUser (req, res) {
    const role =req.cookies.role;
    db.all('SELECT * FROM users', (err, users) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs:', err);
            return res.status(500).send('Erreur lors de la récupération des utilisateurs');
        }

        const flash = res.locals.flash || {};
        res.send (adminUserView(users, flash, role ));
    })

}

function showAdminAnnonce (req, res){
    const role = req.cookies.role
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
      const flash = res.locals.flash;
      res.send(adminAnnonceView(annoncesFinal, flash, role));
    });
}

function showAdminAnnonceval (req, res) {
    const role = req.cookies.role;

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
              const flash = res.locals.flash;
              res.send(adminAnnoncevalView(annoncesvalFinal, flash, role))
            })
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
                    req.session.flash = { success: "L'utilisateur a bien été supprimé." };
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
        req.session.flash = { success: "Le produit a bien été supprimée." };
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
        req.session.flash = { success: "L'annonce a bien été supprimée." };
        res.redirect('/admin');
    })
};     

function validAnnonce (req, res) {
    const annonceId = req.params.id || req.body.id;

    console.log('ID de l\'annonce à valider:', annonceId);

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

                const queryGetImages = `
                    SELECT url, id FROM images
                    WHERE id IN (SELECT image_id FROM images_annoncesval WHERE annonceval_id = ?);
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
                    console.log ("annonceId : ", newAnnonceId);
                   
                    images.forEach((image) => {
                        const imageId = image.id; 
                        console.log ("imageId : ", imageId);
                        db.run(queryInsertImages, [imageId, newAnnonceId], (err) => {
                            if (err) {
                                console.error("Erreur lors de l'insertion dans images_annonces :", err.message);
                            }
                        });
                    });

                    console.log(`Mise à jour des images réussie pour l'annonce ID: ${newAnnonceId}`);
                }
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
                            req.session.flash = { success: "L'annonce a bien été validée." };
                            res.redirect("/admin");
                        });
                    });
                });
            });
        });
    });
}


module.exports = {showDelete, traitDelete, showAdmin, showAdminUser,showAdminAnnonce,showAdminAnnonceval, suppUser, suppProd, suppAnn, validAnnonce};