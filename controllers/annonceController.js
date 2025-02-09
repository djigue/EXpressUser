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

/**
 * Fonction pour afficher la liste des annonces
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
function showAnnonce(req, res){
    const role =req.cookies.role; // Récupération du rôle de l'utilisateur depuis les cookies
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

    // Exécution de la requête pour récupérer les annonces
    db.all(query, (err, rows) => {
        if (err) {
            // Gestion des erreurs si la récupération échoue
            console.error('Erreur lors de la récupération des annonces :', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }

        // Regroupement des annonces par id afin d'ajouter les images correspondantes
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

        // Si aucune annonce n'est trouvée, afficher un message d'erreur
        if (!annoncesArray || annoncesArray.length === 0) {
            if (!res.headersSent) {
                return res.send('<html><body><h1>Aucune annonces trouvé.</h1></body></html>');
            }
            return;
        }
        
        // Requête pour récupérer les catégories d'annonces
        const categoriesQuery = `SELECT DISTINCT categorie FROM annonces`;
        db.all(categoriesQuery, (err, categoriesRows) => {
            if (err) {
                // Gestion des erreurs lors de la récupération des catégories
                console.error('Erreur lors de la récupération des catégories :', err.message);
                return res.status(500).send('Erreur interne du serveur');
            }

            const categories = categoriesRows.map(row => row.categorie);

            const flash = res.locals.flash || {}; // Récupérer les messages flash
            // Envoi de la vue avec les annonces et le rôle utilisateur
            return res.send(annonceView(annoncesArray, flash, role));   
        });  
    });
}

/**
 * Fonction pour afficher la page de dépôt d'annonces
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
function showDepot (req, res) {  
    const role = req.cookies.role; // Récupération du rôle de l'utilisateur depuis les cookies
    const flash = res.locals.flash || {}; // Récupération des messages flash
    const htmlContent = depotView(flash, role); // Génération du contenu HTML pour le dépôt
    return res.send(htmlContent); // Envoi du contenu HTML en réponse
}

/**
 * Fonction pour afficher les annonces personnelles validées et en attente de validation
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
function showDepAnn(req, res) {
    const user_id = req.cookies.id; // Récupérer l'ID utilisateur depuis les cookies
    const role = req.cookies.role; // Récupérer le rôle de l'utilisateur depuis les cookies

    // Vérifier si l'utilisateur est connecté
    if (!user_id) {
        req.session.flash = { error: "Vous devez être connecté pour accéder à cette page." };
        return res.redirect('/login');
    }

    // Requête pour récupérer les annonces validées par l'utilisateur
    const queryAnnoncesval = `
        SELECT 
            annoncesval.id AS annonceval_id, 
            annoncesval.titre, 
            annoncesval.description,
            annoncesval.categorie, 
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

    // Requête pour récupérer les annonces en dépôt par l'utilisateur
    const queryAnnonces = `
        SELECT 
            annonces.id AS annonce_id, 
            annonces.titre, 
            annonces.description, 
            annonces.categorie,
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

    // Récupération des annonces en dépôt
    db.all(queryAnnonces, [user_id], (errAnnonces, annonces) => {
        if (errAnnonces) {
            console.error("Erreur lors de la récupération des annonces:", errAnnonces.message);
            req.session.flash = { error: "Erreur interne du serveur." };
            return res.redirect('/depot');
        }

        // Regroupement des annonces par ID
        const groupedAnnonces = annonces.reduce((acc, row) => {
            const { annonce_id, titre, description, categorie, prix, image_url } = row;

            if (!acc[annonce_id]) {
                acc[annonce_id] = {
                    id: annonce_id,
                    titre,
                    description,
                    categorie,
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

        // Récupération des annonces validées
        db.all(queryAnnoncesval, [user_id], (errAnnoncesVal, annoncesval) => {
            if (errAnnoncesVal) {
                console.error("Erreur lors de la récupération des annonces validées:", errAnnoncesVal.message);
                req.session.flash = { error: "Erreur interne du serveur." };
                return res.redirect('/depot');
            }

            // Regroupement des annonces validées par ID
            const groupedAnnoncesval = annoncesval.reduce((acc, row) => {
                const { annonceval_id, titre, description, categorie, prix, image_url } = row;

                if (!acc[annonceval_id]) {
                    acc[annonceval_id] = {
                        id: annonceval_id,
                        titre,
                        description,
                        categorie,
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
            const flash = res.locals.flash || {}; // Récupérer les messages flash (s'il y en a)
            const htmlContent = depAnnView(annoncesArray, annoncesvalArray, flash, role); // Générer le HTML pour la page
            return res.send(htmlContent); // Renvoyer la réponse HTML
        });
    });
}

/**
 * Fonction pour traiter l'ajout d'une nouvelle annonce
 * @param {Object} req - Requête HTTP
 * @param {Object} res - Réponse HTTP
 */
function traitDepot(req, res) {
    const { titre, description, prix, categorie, imagesUser } = req.body;
    const user_id = req.cookies.id; // Récupérer l'ID utilisateur depuis les cookies

    // Vérifier que tous les champs sont remplis
    if (!titre || !description || !prix || !categorie) {
        req.session.flash = { error: "Tous les champs du formulaire sont obligatoires." };
        return res.redirect('/depot/formulaire');
    }

    // Vérifier si l'utilisateur est connecté
    if (!user_id) {
        req.session.flash = { error: "Vous devez être connecté pour ajouter une annonce." };
        return res.redirect('/login');
    }

    // Requête pour insérer l'annonce dans la base de données
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

        const annoncevalId = this.lastID; // Récupérer l'ID de l'annonce insérée
        const images = new Set(); // Utiliser un Set pour éviter les doublons

        // Ajouter les fichiers images téléchargés
        if (req.files) {
            req.files.forEach(file => {
                if (isValidImage(file.filename)) { // Vérifier si l'image est valide
                    images.add(file.filename);
                }
            });
        }

        // Ajouter les images soumises par l'utilisateur
        if (imagesUser && isValidImage(imagesUser)) {
            images.add(imagesUser);
        }

        // Limiter le nombre d'images à 3
        if (images.size > 3) {
            req.session.flash = { error: "Vous ne pouvez mettre que 3 images dans votre annonce." };
            return res.redirect('/depot/formulaire');
        }

        if (images.size > 0) {
            const queryImages = 'INSERT INTO images (url) VALUES (?)';
            const queryImagesAnnVal = `
                INSERT INTO images_annoncesval (image_id, annonceval_id) VALUES (?, ?)
            `;

            // Insérer chaque image dans la base de données
            Array.from(images).forEach((imageUrl) => {
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
        }

        req.session.flash = { success: "L'annonce a bien été enregistrée, elle est en attente de validation." };
        return res.redirect('/depot');
    });
}

/**
 * Vérifie si un fichier image a une extension valide.
 * 
 * @param {string} filename - Le nom du fichier à vérifier.
 * @returns {boolean} - Retourne `true` si l'extension est valide, sinon `false`.
 */
function isValidImage(filename) {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return validExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

/**
 * Supprime une annonce en fonction de son ID et redirige l'utilisateur.
 * 
 * @param {Object} req - L'objet de requête (request).
 * @param {Object} res - L'objet de réponse (response).
 * @returns {void} - Redirige l'utilisateur après la suppression ou renvoie une erreur en cas d'échec.
 */
function traitSupp(req, res) {
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

/**
 * Modifie une annonce en fonction de son ID, met à jour les informations et gère les images.
 * 
 * @param {Object} req - L'objet de requête contenant les données du formulaire et les images téléchargées.
 * @param {Object} res - L'objet de réponse permettant de renvoyer la réponse après traitement.
 * @returns {void} - Effectue la modification de l'annonce et des images associées, ou renvoie une erreur.
 */
function traitModif(req, res) {
    const annonce_id = req.params.id;
    const { titre, categorie, description, prix } = req.body;
    const images = req.files?.map(file => file.filename) || [];
    console.log("Images téléchargées :", images);

    // Récupérer les images existantes associées à l'annonce
    const queryGetExistImages = `SELECT image_id FROM images_annonces WHERE annonce_id = ?`;
    db.all(queryGetExistImages, [annonce_id], (err, rows) => {
        if (err) {
            console.error("Erreur lors de la récupération des images existantes :", err.message);
            req.session.flash = { error: "Erreur interne du serveur." };
            return res.redirect(`/modifier-annonce/${annonce_id}`);
        }

        const existImages = rows.map(row => row.image_id);
        console.log("Images existantes :", existImages);

        // Vérifier si tous les champs sont remplis
        if (!annonce_id || !categorie || !titre || !description || !prix) {
            req.session.flash = { error: "Tous les champs du formulaire sont obligatoires." };
            return res.redirect(`/modifier-annonce/${annonce_id}`);
        }

        // Récupérer l'ID de l'utilisateur associé à l'annonce
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

            // Insérer une nouvelle entrée dans la table `annoncesval` pour la validation
            const queryInsertAnnonceVal = `
                INSERT INTO annoncesval (titre, categorie, description, prix, user_id, date_creation)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
            `;
            db.run(queryInsertAnnonceVal, [titre, categorie, description, prix, user_id], function (err) {
                if (err) {
                    console.error("Erreur lors de l'insertion dans annoncesval :", err.message);
                    req.session.flash = { error: "Erreur interne du serveur." };
                    return res.redirect(`/modifier-annonce/${annonce_id}`);
                }

                const annoncevalId = this.lastID;

                // Vérifier si le nombre d'images est supérieur à 3
                if (images.length > 3) {
                    req.session.flash = { error: "Vous ne pouvez ajouter que 3 images maximum." };
                    return res.redirect(`/modifier-annonce/${annonce_id}`);
                }

                /**
                 * Fonction pour insérer une image et la lier à l'annonce.
                 * 
                 * @param {string} imageUrl - URL de l'image à insérer.
                 * @param {Function} callback - Fonction de rappel pour traiter l'image insérée.
                 * @returns {void} - Appelle la fonction de rappel avec l'ID de l'image.
                 */
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
                            imageId = row.id;  // Si l'image existe déjà, récupérer son ID.
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
                                imageId = this.lastID;  // Si l'image n'existe pas, insérer et récupérer l'ID.
                                console.log("Image insérée :", imageId);
                                return callback(null, imageId);
                            });
                        }
                    });
                };

                let errors = false;

                // Lier les images existantes à l'annonce modifiée
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

                // Traiter et lier les nouvelles images téléchargées
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

                // Finaliser la modification et supprimer l'ancienne annonce
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

                // Traiter les images téléchargées si elles existent
                if (images.length > 0) {
                    processNewImages();
                } else {
                    finalizeModification(false);
                }
            });
        });
    });
}


/**
 * @function showModif
 * @description Affiche la page de modification d'une annonce en récupérant les détails de l'annonce et les images associées.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showModif(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const annonce_id = req.params.id;  // Récupère l'ID de l'annonce à partir des paramètres d'URL
    const queryAnnonce = `SELECT * FROM annonces WHERE id = ?`;  // Requête SQL pour récupérer les informations de l'annonce
    const queryImages = `SELECT i.id, i.url 
                         FROM images i
                         INNER JOIN images_annonces ia ON i.id = ia.image_id
                         WHERE ia.annonce_id = ?`;  // Requête SQL pour récupérer les images associées à l'annonce

    // Exécution de la requête pour récupérer l'annonce
    db.get(queryAnnonce, [annonce_id], (err, annonce) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'annonce:", err.message);
            req.session.flash = { error: "Erreur interne du serveur" };
            return res.redirect('/depot');
        }

        if (!annonce) {
            req.session.flash = { error: "Annonce non trouvée" };
            return res.redirect('/depot');
        }

        // Exécution de la requête pour récupérer les images associées à l'annonce
        db.all(queryImages, [annonce_id], (err, images) => {
            if (err) {
                console.error("Erreur lors de la récupération des images:", err.message);
                req.session.flash = { error: "Erreur interne du serveur" };
                return res.redirect('/depot');
            }

            const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
            return res.send(modifView(annonce, images, flash, role));  // Envoie la vue de modification avec les informations récupérées
        });
    });
}

/**
 * @function showAnnonceVoir
 * @description Affiche les détails d'une annonce spécifique, avec navigation vers l'annonce précédente et suivante.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showAnnonceVoir(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const annonce_id = req.params.id;  // Récupère l'ID de l'annonce à partir des paramètres d'URL
    const categorie = req.query.categorie || null;  // Récupère la catégorie de l'annonce (si elle est fournie)

    if (!annonce_id) {
        return res.redirect('/annonce');  // Si aucun ID d'annonce n'est fourni, redirige vers la liste des annonces
    }

    const queryAnnonce = `SELECT * FROM annonces WHERE id = ?`;  // Requête SQL pour récupérer les informations de l'annonce
    const queryImages = `SELECT i.id, i.url 
                         FROM images i
                         INNER JOIN images_annonces ia ON i.id = ia.image_id
                         WHERE ia.annonce_id = ?`;  // Requête SQL pour récupérer les images associées à l'annonce

    // Exécution de la requête pour récupérer l'annonce
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

        // Détermine les requêtes pour récupérer les annonces précédente et suivante en fonction de la catégorie (si fournie)
        const queryNextAnnonce = categorie
            ? `SELECT id FROM annonces WHERE id > ? AND categorie = ? ORDER BY id ASC LIMIT 1`
            : `SELECT id FROM annonces WHERE id > ? ORDER BY id ASC LIMIT 1`;

        const queryPrevAnnonce = categorie
            ? `SELECT id FROM annonces WHERE id < ? AND categorie = ? ORDER BY id DESC LIMIT 1`
            : `SELECT id FROM annonces WHERE id < ? ORDER BY id DESC LIMIT 1`;

        // Exécution de la requête pour récupérer les images associées à l'annonce
        db.all(queryImages, [annonce_id], (err, images) => {
            if (err) {
                console.error("Erreur lors de la récupération des images:", err.message);
                req.session.flash = { error: "Erreur interne du serveur" };
                return res.redirect('/annonce');
            }

            // Exécution de la requête pour récupérer l'annonce suivante
            db.get(queryNextAnnonce, categorie ? [annonce_id, categorie] : [annonce_id], (err, nextAnnonce) => {
                if (err) {
                    console.error("Erreur lors de la récupération de l'annonce suivante:", err.message);
                    req.session.flash = { error: "Erreur interne du serveur" };
                    return res.redirect('/annonce');
                }

                // Exécution de la requête pour récupérer l'annonce précédente
                db.get(queryPrevAnnonce, categorie ? [annonce_id, categorie] : [annonce_id], (err, prevAnnonce) => {
                    if (err) {
                        console.error("Erreur lors de la récupération de l'annonce précédente:", err.message);
                        req.session.flash = { error: "Erreur interne du serveur" };
                        return res.redirect('/annonce');
                    }

                    const nextAnnonceId = nextAnnonce ? nextAnnonce.id : null;
                    const prevAnnonceId = prevAnnonce ? prevAnnonce.id : null;
                    const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
                    return res.send(
                        annonceVoirView(annonce, images, flash, role, nextAnnonceId, prevAnnonceId, categorie)
                    );  // Envoie la vue de l'annonce avec les informations récupérées
                });
            });
        });
    });
}

/**
 * @function suppImage
 * @description Supprime une image en la dissociant d'une annonce et en la supprimant de la base de données.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function suppImage(req, res) {
    const image_id = req.params.id;  // Récupère l'ID de l'image à supprimer depuis les paramètres d'URL
    console.log("requete : ", req.params);

    const queryAnnonceId = `
        SELECT ia.annonce_id 
        FROM images_annonces ia 
        WHERE ia.image_id = ?
    `;  // Requête pour récupérer l'ID de l'annonce associée à l'image

    // Exécution de la requête pour récupérer l'ID de l'annonce
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
        `;  // Requête pour supprimer la relation entre l'image et l'annonce
        db.run(querySuppRel, [image_id], function (err) {
            if (err) {
                console.error("Erreur lors de la suppression de la relation image-annonce:", err.message);
                req.session.flash = { error: "Erreur interne du serveur." };
                return res.status(500).send("Erreur interne du serveur.");
            }

            const querySuppImage = `DELETE FROM images WHERE id = ?`;  // Requête pour supprimer l'image de la table images
            db.run(querySuppImage, [image_id], function (err) {
                if (err) {
                    console.error("Erreur lors de la suppression de l'image:", err.message);
                    req.session.flash = { error: "Erreur lors de la suppression de l'image." };
                    return res.status(500).send('Erreur interne du serveur');
                }

                req.session.flash = { success : "L'image a été supprimée." };  // Message de succès
                return res.redirect(`/modifier-annonce/${annonce_id}`);  // Redirige vers la page de modification de l'annonce
            });
        });
    });
}

/**
 * @function showImmo
 * @description Affiche les annonces de la catégorie "immobilier", avec les images associées.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showImmo(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const queryAnnonces = `SELECT annonces.id AS annonce_id, 
                                   annonces.titre, 
                                   annonces.description, 
                                   annonces.categorie, 
                                   annonces.prix
                            FROM annonces 
                            WHERE categorie = "immobilier"`;  // Requête pour récupérer les annonces de la catégorie immobilier

    // Exécution de la requête pour récupérer les annonces
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
                             ON images.id = images_annonces.image_id`;  // Requête pour récupérer les images associées aux annonces

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                return res.status(500).send('Erreur interne du serveur');
            }

            // Organise les images par annonce
            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            // Associe les images aux annonces
            const annoncesImages = annonces.map(annonce => ({
                ...annonce,
                images: imagesByAnnonce[annonce.annonce_id] || []
            }));
            console.log("images showimmo : ", annoncesImages);

            const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
            res.send(immoView(annoncesImages, flash, role));  // Envoie la vue avec les informations récupérées
        });
    });
}

/**
 * @function showVehicule
 * @description Affiche les annonces de la catégorie "vehicule", avec les images associées.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showVehicule(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const queryAnnonces = `SELECT annonces.id AS annonce_id, 
                                   annonces.titre, 
                                   annonces.description, 
                                   annonces.categorie, 
                                   annonces.prix
                            FROM annonces
                            WHERE categorie = "vehicule"`;  // Requête pour récupérer les annonces de la catégorie véhicule

    // Exécution de la requête pour récupérer les annonces
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
                             ON images.id = images_annonces.image_id`;  // Requête pour récupérer les images associées aux annonces

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            // Organise les images par annonce
            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            // Associe les images aux annonces
            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
            return res.send(vehiculeView(annonces, flash, role));  // Envoie la vue avec les informations récupérées
        });
    });
}


/**
 * @function showMaison
 * @description Affiche les annonces de la catégorie "maison", avec les images associées.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showMaison(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "maison"`;  // Requête pour récupérer les annonces de la catégorie maison

    // Exécution de la requête pour récupérer les annonces
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
                             ON images.id = images_annonces.image_id`;  // Requête pour récupérer les images associées aux annonces

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            // Organise les images par annonce
            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            // Associe les images aux annonces
            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
            return res.send(maisonView(annonces, flash, role));  // Envoie la vue avec les informations récupérées
        });
    });
}

/**
 * @function showElec
 * @description Affiche les annonces de la catégorie "elec" (électronique), avec les images associées.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showElec(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "elec"`;  // Requête pour récupérer les annonces de la catégorie électronique

    // Exécution de la requête pour récupérer les annonces
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
                             ON images.id = images_annonces.image_id`;  // Requête pour récupérer les images associées aux annonces

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            // Organise les images par annonce
            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            // Associe les images aux annonces
            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
            return res.send(elecView(annonces, flash, role));  // Envoie la vue avec les informations récupérées
        });
    });
}


/**
 * @function showVet
 * @description Affiche les annonces de la catégorie "vetements" (vêtements), avec les images associées.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showVet(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "vetements"`;  // Requête pour récupérer les annonces de la catégorie vêtements

    // Exécution de la requête pour récupérer les annonces
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
                             ON images.id = images_annonces.image_id`;  // Requête pour récupérer les images associées aux annonces

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            // Organise les images par annonce
            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            // Associe les images aux annonces
            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
            return res.send(vetView(annonces, flash, role));  // Envoie la vue avec les informations récupérées
        });
    });
}

/**
 * @function showLoisirs
 * @description Affiche les annonces de la catégorie "loisirs", avec les images associées.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showLoisirs(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "loisirs"`;  // Requête pour récupérer les annonces de la catégorie loisirs

    // Exécution de la requête pour récupérer les annonces
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
                             ON images.id = images_annonces.image_id`;  // Requête pour récupérer les images associées aux annonces

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            // Organise les images par annonce
            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            // Associe les images aux annonces
            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
            return res.send(loisirsView(annonces, flash, role));  // Envoie la vue avec les informations récupérées
        });
    });
}

/**
 * @function showAutres
 * @description Affiche les annonces de la catégorie "autres", avec les images associées.
 * @param {Object} req - L'objet requête de l'Express contenant les informations de la requête HTTP.
 * @param {Object} res - L'objet réponse de l'Express permettant de renvoyer une réponse HTTP.
 */
function showAutres(req, res) {
    const role = req.cookies.role;  // Récupère le rôle de l'utilisateur depuis les cookies
    const queryAnnonces = `SELECT 
                                annonces.id AS annonce_id, 
                                annonces.titre, 
                                annonces.description, 
                                annonces.categorie, 
                                annonces.prix
                            FROM annonces
                            WHERE categorie = "autres"`;  // Requête pour récupérer les annonces de la catégorie autres

    // Exécution de la requête pour récupérer les annonces
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
                             ON images.id = images_annonces.image_id`;  // Requête pour récupérer les images associées aux annonces

        db.all(queryImages, (err, imageRows) => {
            if (err) {
                console.error('Erreur lors de la récupération des images :', err.message);
                if (!res.headersSent) {
                    return res.status(500).send('Erreur interne du serveur');
                }
                return;
            }

            // Organise les images par annonce
            const imagesByAnnonce = imageRows.reduce((acc, row) => {
                const { annonce_id, image_url } = row;
                if (!acc[annonce_id]) {
                    acc[annonce_id] = [];
                }
                acc[annonce_id].push(image_url);
                return acc;
            }, {});

            // Associe les images aux annonces
            const annonces = rows.map(annonce => {
                return {
                    ...annonce,
                    images: imagesByAnnonce[annonce.annonce_id] || []
                };
            });

            const flash = res.locals.flash || {};  // Récupère les messages flash s'il y en a
            return res.send(autresView(annonces, flash, role));  // Envoie la vue avec les informations récupérées
        });
    });
}

module.exports = { 
    showAnnonce, showDepot, traitDepot, showDepAnn, traitSupp, traitModif,
    showModif, suppImage, showAnnonceVoir, showImmo, showVehicule, showMaison, 
    showElec, showVet, showLoisirs, showAutres 
};
