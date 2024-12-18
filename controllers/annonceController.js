const annonceView = require ('../views/annonceView');
const depotView = require ('../views/depotView');
const depAnnView = require('../views/depAnnView');
const modifView = require ('../views/modifView');
const db = require ('../db/db');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const bcrypt = require('bcrypt');

function showAnnonce(req, res){
    const flash = req.session.flash || {}; 
    delete req.session.flash; 
    const query = `SELECT 
                   annonces.id AS annonce_id, 
                   annonces.titre, 
                   annonces.description, 
                   annonces.prix,
                   images.url AS image_url
                   FROM 
                       annonces
                   LEFT JOIN 
                       images_annonces ON annonces.id = images_annonces.annonce_id
                   LEFT JOIN 
                       images ON images_annonces.image_id = images.id
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
            const { annonce_id, titre, description, prix, image_url } = row;
    console.log ("annonce id : ", annonce_id," image : ", image_url ) ;
            if (!acc[annonce_id]) {
                acc[annonce_id] = {
                    id: annonce_id,
                    titre,
                    description,
                    prix,
                    images: [],
                };
            }
    
            if (image_url) {
                acc[annonce_id].images.push(image_url);
            }
    
            return acc;
        }, {});
    
        const annoncesArray = Object.values(annonces);
    
       
        if (!annoncesArray || annoncesArray === 0) {
            if (!res.headersSent) {
                return res.send('<html><body><h1>Aucun produit trouvé.</h1></body></html>');
            }
            return;
        }
      
        const htmlContent = annonceView(annoncesArray, res.locals.flash);
        if (!res.headersSent) {
            return res.send(htmlContent);
        }
    });
  }

function showDepot (req, res) {
    const flash = req.session.flash || null; 
    if (flash) delete req.session.flash; 
    const htmlContent = depotView(flash); 
    return res.send(htmlContent);
}

function showDepAnn(req, res) {
    const flash = req.session.flash || {}; 
    delete req.session.flash; 
    const user_id = req.cookies.id;

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

        const htmlContent = depAnnView(annoncesArray, annoncesvalArray, res.locals.flash);
        return res.send(htmlContent); 
    });
    });
}

 function traitDepot (req, res) {
    const {titre, description, prix, imagesUser} = req.body;
    const user_id = req.cookies.id;

    if (!titre || !description || !prix) {
        console.log('Champs manquants');
        req.session.flash = { error: "Tous les champs du formulaire sont obligatoires." };
        return res.redirect('/depot/formulaire');
    }  

    if (!user_id) {
        req.session.flash = { error: "Vous devez être connecté pour ajouter une annonce." };
        return res.redirect('/login');
    }

    const queryAnnonces = `
      INSERT INTO annoncesval (titre, description, prix, user_id)
      VALUES (?, ?, ?, ?)
    `;
  
    db.run(queryAnnonces, [titre, description, prix, user_id], function (err) {
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

        console.log(`Annonce ${annonce_id} supprimée avec succès.`);
        console.log('req.session:', req.session); 
        req.session.flash = { success: "L'annonce a bien été supprimée." };
        return res.redirect('/depot'); 
    });
 }

 function traitModif(req, res) {
    const annonce_id = req.params.id;  
    const { titre, description, prix } = req.body;  

    if (!annonce_id || !titre || !description || !prix) {
        console.log('Champs manquants');
        req.session.flash = { error: "Tous les champs du formulaire sont obligatoires." };
        return res.redirect('/depot/formulaire');
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
                req.session.flash = { success: "L'annonce a bien été modifiée elle est en attente de validation." };
                return res.redirect('/depot');  
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