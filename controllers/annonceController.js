const annonceView = require ('../views/annonceView');
const depotView = require ('../views/depotView');
const depAnnView = require('../views/depAnnView');
const modifView = require ('../views/modifView');
const annonceVoirView = require ('../views/annonceVoirView');
const immoView = require ('../views/immoView');
const vehiculeView = require ('../views/vehiculeView');
const maisonView = require ('../views/maisonView');
const elecView = require ('../views/elecView');
const vetView = require ('../views/vetView');
const loisirsView = require ('../views/loisirsView');
const autresView = require ('../views/autresView');
const db = require ('../db/db');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const bcrypt = require('bcrypt');

function showAnnonce(req, res){
    const role =req.cookies.role;
    const query = `SELECT 
                        annonces.id AS annonce_id, 
                        annonces.titre, 
                        annonces.description, 
                        annonces.categorie,
                        annonces.prix,
                        (SELECT images.url 
                         FROM images 
                         INNER JOIN images_annonces ON images.id = images_annonces.image_id 
                         WHERE images_annonces.annonce_id = annonces.id 
                         LIMIT 1) AS image_url
                    FROM 
                        annonces
                    ORDER BY 
                        annonces.id;`
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        const annonces = rows.reduce((acc, row) => {
            const { annonce_id, titre, description, prix, categorie, image_url } = row;

            if (!acc[annonce_id]) {
                acc[annonce_id] = {
                    id: annonce_id,
                    titre,
                    description,
                    prix,
                    categorie,
                    images: [],
                };
            }
    
            if (image_url) {
                acc[annonce_id].images.push(image_url);
            }
    
            return acc;
        }, {});
    
        const annoncesArray = Object.values(annonces);
    
       
        if (!annoncesArray || annoncesArray.length === 0) {
            if (!res.headersSent) {
                return res.send('<html><body><h1>Aucune annonces trouvé.</h1></body></html>');
            }
            return;
        }
        
        const categoriesQuery = `SELECT DISTINCT categorie FROM annonces`;
        db.all(categoriesQuery, (err, categoriesRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des catégories :', err.message);
                return res.status(500).send('Erreur interne du serveur');
            }

            const categories = categoriesRows.map(row => row.categorie);

        const flash = res.locals.flash || {};
        return res.send(annonceView(annoncesArray, flash, role));   
        });  
    });
  }

function showDepot (req, res) {  
    const role =req.cookies.role;
    const flash = res.locals.flash || {};
    const htmlContent = depotView(flash, role); 
    return res.send(htmlContent);
}

function showDepAnn(req, res) {
    const user_id = req.cookies.id;
    const role =req.cookies.role;
    if (!user_id) {
        req.session.flash = { error: "Vous devez être connecté pour accéder à cette page." };
        return res.redirect('/login');
    }

    const queryAnnoncesval = `
        SELECT 
                   annoncesval.id AS annonceval_id, 
                   annoncesval.titre, 
                   annoncesval.description, 
                   annoncesval.prix,
                   images.url AS image_url
                   FROM 
                       annoncesval
                   LEFT JOIN 
                       images_annoncesval ON annoncesval.id = images_annoncesval.annonceval_id
                   LEFT JOIN 
                       images ON images_annoncesval.image_id = images.id
                   WHERE
                       annoncesval.user_id = ?
                   ORDER BY 
                       annoncesval.id;`;

    const queryAnnonces = `
                  SELECT 
                    annonces.id AS annonce_id, 
                    annonces.titre, 
                    annonces.description, 
                    annonces.prix,
                    images.url AS image_url
                   FROM 
                    annonces
                   LEFT JOIN 
                    depot ON annonces.id = depot.annonce_id
                   LEFT JOIN 
                    images_annonces ON annonces.id = images_annonces.annonce_id
                   LEFT JOIN 
                    images ON images_annonces.image_id = images.id
                   WHERE
                    depot.user_id = ?
                   ORDER BY 
                    annonces.id;
    `;

    db.all(queryAnnonces, [user_id], (errAnnonces, annonces) => {
        if (errAnnonces) {
            console.error("Erreur lors de la récupération des annonces:", errAnnonces.message);
            req.session.flash = { error: "Erreur interne du serveur." };
            return res.redirect('/depot');
        }

        const groupedAnnonces = annonces.reduce((acc, row) => {
            const { annonce_id, titre, description, prix, image_url } = row;
    
            if (!acc[annonce_id]) {
                acc[annonce_id] = {
                    id: annonce_id,
                    titre,
                    description,
                    prix,
                    images: []
                };
            }
    
            if (image_url) {
                acc[annonce_id].images.push(image_url);  
            }
    
            return acc;
        }, {});
    
        const annoncesArray = Object.values(groupedAnnonces);

    db.all(queryAnnoncesval, [user_id], (errAnnoncesVal, annoncesval) => {
        if (errAnnoncesVal) {
            console.error("Erreur lors de la récupération des annonces:", errAnnoncesVal.message);
            req.session.flash = { error: "Erreur interne du serveur." };
            return res.redirect('/depot');
        }
        const groupedAnnoncesval = annoncesval.reduce((acc, row) => {
            const { annonceval_id, titre, description, prix, image_url } = row;
    
            if (!acc[annonceval_id]) {
                acc[annonceval_id] = {
                    id: annonceval_id,
                    titre,
                    description,
                    prix,
                    images: []
                };
            }
    
            if (image_url) {
                acc[annonceval_id].images.push(image_url);  
            }
    
            return acc;
        }, {});
    
        
        const annoncesvalArray = Object.values(groupedAnnoncesval);
        const flash = res.locals.flash || {};
        const htmlContent = depAnnView(annoncesArray, annoncesvalArray, flash, role);
        return res.send(htmlContent); 
    });
    });
}

 function traitDepot (req, res) {
    const {titre, description, prix, categorie, imagesUser} = req.body;
    const user_id = req.cookies.id;

    if (!titre || !description || !prix || !categorie) {
        console.log('Champs manquants');
        req.session.flash = { error: "Tous les champs du formulaire sont obligatoires." };
        return res.redirect('/depot/formulaire');
    }  

    if (!user_id) {
        req.session.flash = { error: "Vous devez être connecté pour ajouter une annonce." };
        return res.redirect('/login');
    }

    const queryAnnonces = `
      INSERT INTO annoncesval (titre, description, prix, categorie, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.run(queryAnnonces, [titre, description, prix, categorie, user_id], function (err) {
      if (err) {
        console.error("Erreur lors de l'ajout de l'annonce :", err.message);
        req.session.flash = { error: "Erreur lors de l'ajout de l'annonce." };
        return res.redirect('/depot/formulaire');
      }
      const annoncevalId = this.lastID;

      const images = [];
      if (req.files) {
          req.files.forEach(file => {
              images.push(file.filename);
          });
      }

      if (imagesUser) {
          images.push(imagesUser);
      }

      if (images.length > 3){
        req.session.flash = { error: "Vous ne pouvez mettre que 3 images dans votre annonces." };
        return res.redirect('/depot/formulaire');
      }

      if (images.length > 0) {
          const queryImages = 'INSERT INTO images (url) VALUES (?)';
          const queryImagesAnnVal = `INSERT INTO images_annoncesval (image_id, annonceval_id) VALUES (?, ?)`;
          
          images.forEach((imageUrl) => {
            db.run(queryImages, [imageUrl], function (err) {
                if (err) {
                    console.error("Erreur lors de l'ajout de l'image :", err.message);
                    req.session.flash = { error: "Erreur lors de l'ajout de l'image." };
                     return res.redirect('/depot/formulaire');
                }

                const imageId = this.lastID;
                db.run(queryImagesAnnVal, [imageId, annoncevalId], function (err) {
                    if (err) {
                        console.error("Erreur lors de l'association de l'image à l'annonce :", err.message);
                        req.session.flash = { error: "Erreur lors de l'association de l'image à l'annonce." };
                        return res.redirect('/depot/formulaire');
                    }
                });
            });
          });
        };

      req.session.flash = { success: "L'annonce a bien été enregistré, elle est en attente de validation." };
      return res.redirect('/depot');
    });
 }

 function traitSupp (req, res) {
    const annonce_id = req.params.id;

    const query = `DELETE FROM annonces WHERE id = ?`;
    db.run(query, [annonce_id], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression de l'annonce:", err.message);
            req.session.flash = { error: "Erreur lors de la suppression de l'annonce." };
            return res.status(500).send('Erreur interne du serveur');
        }
       
        req.session.flash = { success : "L'annonce a été supprimée." };
        return res.redirect('/depot'); 
    });
 }

 function traitModif(req, res) {
    const annonce_id = req.params.id;
    const { titre, description, prix } = req.body;
    const images = req.files?.map(file => file.filename) || [];
    console.log("Images téléchargées :", images);

    const queryGetExistImages = `SELECT image_id FROM images_annonces WHERE annonce_id = ?`;
    db.all(queryGetExistImages, [annonce_id], (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des images existantes :", err.message);
            req.session.flash = { error: "Erreur interne du serveur." };
            return res.redirect(`/modifier-annonce/${annonce_id}`);
        }

        const existImages = rows.map(row => row.image_id);
        console.log("Images existantes :", existImages);

        if (!annonce_id || !titre || !description || !prix) {
            req.session.flash = { error: "Tous les champs du formulaire sont obligatoires." };
            return res.redirect(`/modifier-annonce/${annonce_id}`);
        }

        const queryGetUserId = `SELECT user_id FROM annonces WHERE id = ?`;
        db.get(queryGetUserId, [annonce_id], (err, row) => {
            if (err) {
                console.error("Erreur lors de la récupération de l'utilisateur :", err.message);
                req.session.flash = { error: "Erreur interne du serveur." };
                return res.redirect(`/modifier-annonce/${annonce_id}`);
            }

            if (!row) {
                req.session.flash = { error: "Annonce introuvable." };
                return res.redirect(`/modifier-annonce/${annonce_id}`);
            }

            const user_id = row.user_id;

            const queryInsertAnnonceVal = `
                INSERT INTO annoncesval (titre, description, prix, user_id, date_creation)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);
            `;
            db.run(queryInsertAnnonceVal, [titre, description, prix, user_id], function (err) {
                if (err) {
                    console.error("Erreur lors de l'insertion dans annoncesval :", err.message);
                    req.session.flash = { error: "Erreur interne du serveur." };
                    return res.redirect(`/modifier-annonce/${annonce_id}`);
                }

                const annoncevalId = this.lastID;

                if (images.length > 3) {
                    req.session.flash = { error: "Vous ne pouvez ajouter que 3 images maximum." };
                    return res.redirect(`/modifier-annonce/${annonce_id}`);
                }

                // Fonction pour insérer une image et lier avec l'annonce
                const insertImageAndLink = (imageUrl, callback) => {
                    const queryCheckImageExist = `SELECT id FROM images WHERE url = ?`;
                    db.get(queryCheckImageExist, [imageUrl], (err, row) => {
                        if (err) {
                            console.error("Erreur lors de la vérification de l'existence de l'image :", err.message);
                            callback(err);
                            return;
                        }

                        let imageId;
                        if (row) {
                            imageId = row.id;  // Si l'image existe déjà, on récupère son ID.
                            console.log("Image existante :", imageId);
                            return callback(null, imageId);
                        } else {
                            const queryInsertImage = `INSERT INTO images (url) VALUES (?)`;
                            db.run(queryInsertImage, [imageUrl], function (err) {
                                if (err) {
                                    console.error("Erreur lors de l'insertion de l'image :", err.message);
                                    callback(err);
                                    return;
                                }
                                imageId = this.lastID;  // Si l'image n'existe pas, on l'insère et récupère l'ID.
                                console.log("Image insérée :", imageId);
                                return callback(null, imageId);
                            });
                        }
                    });
                };

                let errors = false;

                // Lier les images existantes
                existImages.forEach((imageId, index) => {
                    const queryLinkImage = `
                        INSERT INTO images_annoncesval (image_id, annonceval_id)
                        VALUES (?, ?);
                    `;
                    db.run(queryLinkImage, [imageId, annoncevalId], (err) => {
                        if (err) {
                            console.error("Erreur lors de l'insertion de l'image existante :", err.message);
                            errors = true;
                        }
                        if (index === existImages.length - 1 && !errors) {
                            processNewImages();
                        }
                    });
                });

                // Lier les nouvelles images téléchargées
                const processNewImages = () => {
                    let errors = false;
                    let remainingImages = images.length;
                    images.forEach((imageUrl, index) => {
                        insertImageAndLink(imageUrl, (err, imageId) => {
                            if (err) {
                                errors = true;
                            } else {
                                const queryLinkImage = `
                                    INSERT INTO images_annoncesval (image_id, annonceval_id)
                                    VALUES (?, ?);
                                `;
                                db.run(queryLinkImage, [imageId, annoncevalId], (err) => {
                                    if (err) {
                                        console.error("Erreur lors de l'insertion de l'image liée :", err.message);
                                        errors = true;
                                    }
                                    remainingImages--;
                                    if (remainingImages === 0) {
                                        finalizeModification(errors);
                                    }
                                });
                            }
                        });
                    });
                };

                const finalizeModification = (errors) => {
                    if (errors) {
                        req.session.flash = { error: "Erreur lors de la gestion des images." };
                        return res.redirect(`/modifier-annonce/${annonce_id}`);
                    }

                    const queryDeleteAnnonce = `DELETE FROM annonces WHERE id = ?`;
                    db.run(queryDeleteAnnonce, [annonce_id], function (err) {
                        if (err) {
                            console.error("Erreur lors de la suppression de l'annonce :", err.message);
                            req.session.flash = { error: "Erreur interne du serveur." };
                            return res.redirect(`/modifier-annonce/${annonce_id}`);
                        }

                        req.session.flash = { success: "Annonce modifiée avec succès et en attente de validation." };
                        if (!res.headersSent) {
                            res.redirect('/depot');
                        }
                    });
                };

                // Si il y a des images téléchargées, on commence par les traiter
                if (images.length > 0) {
                    processNewImages();
                } else {
                    finalizeModification(false);
                }
            });
        });
    });
}

function showModif (req, res) {
    const role =req.cookies.role;
    const annonce_id = req.params.id;
    const queryAnnonce = `SELECT * FROM annonces WHERE id = ?`;
    const queryImages = `SELECT i.id, i.url 
                         FROM images i
                         INNER JOIN images_annonces ia ON i.id = ia.image_id
                         WHERE ia.annonce_id = ?`;
    
    db.get(queryAnnonce, [annonce_id], (err, annonce) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'annonce:", err.message);
            req.session.flash = { error: "Erreur interne du serveur" };
            return res.redirect ('/depot');
        }
        
        if (!annonce) {
            req.session.flash = { error: "Annonce non trouvée" };
            return res.redirect ('/depot');
        };
        
    
    db.all(queryImages, [annonce_id], (err, images) => {
        if (err) {
            console.error("Erreur lors de la récupération des images:", err.message);
            req.session.flash = { error: "Erreur interne du serveur" };
            return res.redirect ('/depot');
        }       
            const flash = res.locals.flash || {};
            return res.send(modifView(annonce, images, flash, role));
       
        }); 
    });  
}

function showAnnonceVoir(req, res) {
    const role = req.cookies.role;
    const annonce_id = req.params.id;
    const categorie = req.query.categorie || null; 
    console.log("cat recup : ", categorie);
    console.log("annonce_id : ", annonce_id);

    if (!annonce_id) {
        return res.redirect('/annonce');
    }

    const queryAnnonce = `SELECT * FROM annonces WHERE id = ?`;
    const queryImages = `SELECT i.id, i.url 
                         FROM images i
                         INNER JOIN images_annonces ia ON i.id = ia.image_id
                         WHERE ia.annonce_id = ?`;

    db.get(queryAnnonce, [annonce_id], (err, annonce) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'annonce:", err.message);
            req.session.flash = { error: "Erreur interne du serveur" };
            return res.redirect('/annonce');
        }

        if (!annonce) {
            req.session.flash = { error: "Annonce non trouvée" };
            return res.redirect('/annonce');
        }

        const queryNextAnnonce = categorie
            ? `SELECT id FROM annonces WHERE id > ? AND categorie = ? ORDER BY id ASC LIMIT 1`
            : `SELECT id FROM annonces WHERE id > ? ORDER BY id ASC LIMIT 1`;

        const queryPrevAnnonce = categorie
            ? `SELECT id FROM annonces WHERE id < ? AND categorie = ? ORDER BY id DESC LIMIT 1`
            : `SELECT id FROM annonces WHERE id < ? ORDER BY id DESC LIMIT 1`;

        db.all(queryImages, [annonce_id], (err, images) => {
            if (err) {
                console.error("Erreur lors de la récupération des images:", err.message);
                req.session.flash = { error: "Erreur interne du serveur" };
                return res.redirect('/annonce');
            }

            db.get(queryNextAnnonce, categorie ? [annonce_id, categorie] : [annonce_id], (err, nextAnnonce) => {
                if (err) {
                    console.error("Erreur lors de la récupération de l'annonce suivante:", err.message);
                    req.session.flash = { error: "Erreur interne du serveur" };
                    return res.redirect('/annonce');
                }

                db.get(queryPrevAnnonce, categorie ? [annonce_id, categorie] : [annonce_id], (err, prevAnnonce) => {
                    if (err) {
                        console.error("Erreur lors de la récupération de l'annonce précédente:", err.message);
                        req.session.flash = { error: "Erreur interne du serveur" };
                        return res.redirect('/annonce');
                    }

                    const nextAnnonceId = nextAnnonce ? nextAnnonce.id : null;
                    const prevAnnonceId = prevAnnonce ? prevAnnonce.id : null;
                    const flash = res.locals.flash || {};
                    return res.send(
                        annonceVoirView(annonce, images, flash, role, nextAnnonceId, prevAnnonceId, categorie)
                    );
                });
            });
        });
    });
}

function suppImage (req, res) {
    const image_id = req.params.id;
    console.log("requete : ", req.params);

    const queryAnnonceId = `
        SELECT ia.annonce_id 
        FROM images_annonces ia 
        WHERE ia.image_id = ?
    `;

    db.get(queryAnnonceId, [image_id], (err, row) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'annonce associée:", err.message);
            req.session.flash = { error: "Erreur interne du serveur." };
            return res.status(500).send("Erreur interne du serveur.");
        }

        if (!row) {
            req.session.flash = { error: "Annonce associée non trouvée." };
            return res.redirect('/depot');
        }

        const annonce_id = row.annonce_id;

        const querySuppRel = `
            DELETE FROM images_annonces WHERE image_id = ?;
        `;
        db.run(querySuppRel, [image_id], function (err) {
            if (err) {
                console.error("Erreur lors de la suppression de la relation image-annonce:", err.message);
                req.session.flash = { error: "Erreur interne du serveur." };
                return res.status(500).send("Erreur interne du serveur.");
            }

        const querySuppImage = `DELETE FROM images WHERE id = ?`;
        db.run(querySuppImage, [image_id], function (err) {
        if (err) {
            console.error("Erreur lors de la suppression de l'image:", err.message);
            req.session.flash = { error: "Erreur lors de la suppression de l'image." };
            return res.status(500).send('Erreur interne du serveur');
        }
       
        req.session.flash = { success : "L'image a été supprimée." };
        return res.redirect(`/modifier-annonce/${annonce_id}`); 
    });
  });
 });
}
 
function showImmo(req, res) {
    const role = req.cookies.role;
    const queryAnnonces = `SELECT  annonces.id AS annonce_id, 
                                   annonces.titre, 
                                   annonces.description, 
                                   annonces.categorie, 
                                   annonces.prix
                            FROM annonces 
                            WHERE categorie = "immobilier"`;

    db.all(queryAnnonces, (err, annonces) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err.message);
            return res.status(500).send('Erreur interne du serveur');
        }

        const queryImages = `SELECT 
                                 images.url AS image_url, 
                                 images_annonces.annonce_id
                             FROM images 
                             INNER JOIN images_annonces 
                             ON images.id = images_annonces.image_id`;

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                return res.status(500).send('Erreur interne du serveur');
            }

            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            const annoncesImages = annonces.map(annonce => ({
                ...annonce,
                images: imagesByAnnonce[annonce.annonce_id] || []
            }));
console.log("images showimmo : ", annoncesImages);
            const flash = res.locals.flash || {};
            res.send(immoView(annoncesImages, flash, role));
        });
    });
}

function showVehicule(req, res) {
    const role = req.cookies.role;
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "véhicules"`;

    db.all(queryAnnonces, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        const queryImages = `SELECT 
                                 images.url AS image_url, 
                                 images_annonces.annonce_id
                             FROM images 
                             INNER JOIN images_annonces 
                             ON images.id = images_annonces.image_id`;

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};
            return res.send(vehiculeView(annonces, flash, role));
        });
    });
}

function showMaison(req, res) {
    const role = req.cookies.role;
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "maison et jardin"`;

    db.all(queryAnnonces, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        const queryImages = `SELECT 
                                 images.url AS image_url, 
                                 images_annonces.annonce_id
                             FROM images 
                             INNER JOIN images_annonces 
                             ON images.id = images_annonces.image_id`;

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};
            return res.send(maisonView(annonces, flash, role));
        });
    });
}

function showElec(req, res) {
    const role = req.cookies.role;
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "electronique"`;

    db.all(queryAnnonces, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        const queryImages = `SELECT 
                                 images.url AS image_url, 
                                 images_annonces.annonce_id
                             FROM images 
                             INNER JOIN images_annonces 
                             ON images.id = images_annonces.image_id`;

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};
            return res.send(elecView(annonces, flash, role));
        });
    });
}

function showVet(req, res) {
    const role = req.cookies.role;
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "vetements"`;

    db.all(queryAnnonces, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        const queryImages = `SELECT 
                                 images.url AS image_url, 
                                 images_annonces.annonce_id
                             FROM images 
                             INNER JOIN images_annonces 
                             ON images.id = images_annonces.image_id`;

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};
            return res.send(vetView(annonces, flash, role));
        });
    });
}

function showLoisirs(req, res) {
    const role = req.cookies.role;
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "loisirs"`;

    db.all(queryAnnonces, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        const queryImages = `SELECT 
                                 images.url AS image_url, 
                                 images_annonces.annonce_id
                             FROM images 
                             INNER JOIN images_annonces 
                             ON images.id = images_annonces.image_id`;

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};
            return res.send(loisirsView(annonces, flash, role));
        });
    });
}

function showAutres(req, res) {
    const role = req.cookies.role;
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "autres"`;

    db.all(queryAnnonces, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des annonces :', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        const queryImages = `SELECT 
                                 images.url AS image_url, 
                                 images_annonces.annonce_id
                             FROM images 
                             INNER JOIN images_annonces 
                             ON images.id = images_annonces.image_id`;

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};
            return res.send(autresView(annonces, flash, role));
        });
    });
}


 module.exports = { showAnnonce, showDepot, traitDepot, showDepAnn, traitSupp, traitModif,
                    showModif, suppImage, showAnnonceVoir, showImmo, showVehicule, showMaison, showElec, showVet, showLoisirs, showAutres};