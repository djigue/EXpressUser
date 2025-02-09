const User = require('../models/user');
const userView = require('../views/userView');
const loginView = require('../views/loginView');
const registerView = require('../views/registerView');
const homeView = require('../views/homeView');
const db = require('../db/db');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const bcrypt = require('bcrypt');

/**
 * Récupère les informations de l'utilisateur et ses annonces
 * @param {object} req - Objet de la requête
 * @param {object} res - Objet de la réponse
 */
function getUser(req, res) {
    const { name, id: user_id, role } = req.cookies; // Récupère l'ID utilisateur, le nom et le rôle depuis les cookies

    // Vérifie si l'utilisateur est connecté (présence d'un ID utilisateur et d'un nom)
    if (!user_id || !name) {
        req.session.flash = { error: "Vous devez être connecté pour accéder à cette page." }; // Message d'erreur
        return res.redirect('/login'); // Redirige vers la page de connexion
    }

    // Requête pour récupérer l'utilisateur dans la base de données
    const userQuery = `SELECT * FROM users WHERE id = ? AND username = ?`;
    
    // Requête pour récupérer les annonces de l'utilisateur
    const annoncesQuery = `SELECT 
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

    // Exécution de la requête pour récupérer l'utilisateur
    db.get(userQuery, [user_id, name], (err, user) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err.message); // Log de l'erreur
            req.session.flash = { error: "Erreur interne du serveur." }; // Message d'erreur
            return res.redirect('/login'); // Redirige vers la page de connexion
        }

        // Si l'utilisateur n'est pas trouvé dans la base de données
        if (!user) {
            req.session.flash = { error: "Utilisateur non trouvé." }; // Message d'erreur
            return res.redirect('/login'); // Redirige vers la page de connexion
        }

        // Exécution de la requête pour récupérer les annonces
        db.all(annoncesQuery, (errAnnonces, annonces) => {
            if (errAnnonces) {
                console.error("Erreur lors de la récupération des annonces :", errAnnonces.message); // Log de l'erreur
                req.session.flash = { error: "Erreur interne du serveur." }; // Message d'erreur
                return res.redirect('/depot'); // Redirige vers la page des annonces
            }

            // Regroupe les annonces pour éviter la duplication et créer un tableau avec les images associées
            const groupedAnnonces = annonces.reduce((acc, row) => {
                const { annonce_id, titre, description, categorie, prix, image_url } = row;

                // Si l'annonce n'est pas déjà dans l'accumulateur, l'ajoute
                if (!acc[annonce_id]) {
                    acc[annonce_id] = {
                        id: annonce_id,
                        titre,
                        description,
                        categorie,
                        prix,
                        images: [] // Tableau pour les images de l'annonce
                    };
                }

                // Ajoute l'URL de l'image à l'annonce si elle existe
                if (image_url) {
                    acc[annonce_id].images.push(image_url);
                }

                return acc;
            }, {});

            // Convertit l'objet en tableau pour envoyer à la vue
            const annoncesArray = Object.values(groupedAnnonces);
         
            // Envoie la réponse avec les informations de l'utilisateur et ses annonces
            res.setHeader('Content-Type', 'text/html'); // Définit le type de contenu
            const flash = res.locals.flash || {}; // Récupère les messages flash pour les afficher dans la vue
            return res.send(userView(user, annoncesArray, flash, role)); // Rend la vue avec les informations nécessaires
        });
    });
}
        
/**
 * @function showRegister
 * @description Affiche la page d'enregistrement. 
 * Récupère le rôle de l'utilisateur depuis les cookies et les messages flash,
 * puis rend la vue d'enregistrement.
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 */
function showRegister(req, res) {
    const role = req.cookies.role; // Récupère le rôle de l'utilisateur depuis les cookies.
    const flash = res.locals.flash || {}; // Récupère les messages flash, s'il y en a.
    console.log("showlogin role : ", role); // Affiche le rôle dans la console (utile pour le debug).
    res.send(registerView(flash, role)); // Rend la vue d'enregistrement avec les messages flash et le rôle.
}

/**
 * @function traitRegister
 * @description Traite l'enregistrement de l'utilisateur. 
 * Vérifie si les informations (nom, mot de passe) sont présentes. 
 * Si tout est correct, le mot de passe est haché et l'utilisateur est ajouté à la base de données.
 * En cas de succès, l'utilisateur est redirigé vers la page de connexion.
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 */
function traitRegister(req, res) {
    const { name, password } = req.body; // Récupère les informations du formulaire.

    // Vérifie que le nom et le mot de passe sont présents.
    if (!name || !password) {
        req.session.flash = { error: "Nom ou mot de passe manquant" }; // Message d'erreur si des informations manquent.
        return res.redirect('/register'); // Redirige vers la page d'enregistrement.
    }

    // Hache le mot de passe avec bcrypt avant de l'enregistrer.
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Erreur lors du hachage du mot de passe :", err.message); // Log l'erreur de hachage.
            req.session.flash = { error: "Erreur lors du hachage du mot de passe." };
            return res.redirect('/register'); // Redirige en cas d'erreur de hachage.
        }

        // Prépare la requête SQL pour insérer l'utilisateur dans la base de données.
        const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

        // Exécute la requête d'insertion.
        db.run(query, [name, hashedPassword], function (err) {
            if (err) {
                console.error("Enregistrement échoué :", err.message); // Log l'erreur d'enregistrement.
                req.session.flash = { error: "Enregistrement échoué" };
                return res.redirect('/register'); // Redirige en cas d'erreur d'enregistrement.
            } else {
                req.session.flash = { success: "Enregistrement réussi" }; // Message de succès.
                return res.redirect('/login'); // Redirige vers la page de connexion après l'enregistrement réussi.
            }
        });
    });
}

/**
 * @function showLogin
 * @description Affiche la page de connexion. 
 * Récupère le rôle de l'utilisateur depuis les cookies et les messages flash,
 * puis rend la vue de connexion.
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 */
function showLogin(req, res) {
    const role = req.cookies.role; // Récupère le rôle de l'utilisateur depuis les cookies.
    const flash = res.locals.flash || {}; // Récupère les messages flash, s'il y en a.
    res.send(loginView(flash, role)); // Rend la vue de connexion avec les messages flash et le rôle.
}


/**
 * @function traitLogin
 * @description Traite la connexion de l'utilisateur.
 * Vérifie si les informations (nom, mot de passe) sont correctes.
 * Si l'utilisateur est trouvé et que le mot de passe est correct, un jeton JWT est généré et envoyé dans les cookies.
 * L'utilisateur est redirigé vers la page appropriée en fonction de son rôle.
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 */
function traitLogin(req, res) {
    const { name, password } = req.body; // Récupère les informations du formulaire.

    // Vérifie si le nom et le mot de passe sont présents.
    if (!name || !password) {
        req.session.flash = { error: "Nom ou mot de passe manquant" }; // Message d'erreur si des informations manquent.
        return res.redirect('/login'); // Redirige vers la page de connexion.
    }

    // Prépare la requête SQL pour récupérer l'utilisateur.
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [name], (err, user) => {
        if (err) {
            console.error("Erreur lors de la recherche de l'utilisateur :", err.message); // Log l'erreur de recherche.
            req.session.flash = { error: "Erreur lors de la recherche de l'utilisateur." };
            return res.redirect('/login'); // Redirige en cas d'erreur de recherche.
        }

        if (!user) {
            req.session.flash = { error: "Utilisateur introuvable" }; // Message d'erreur si l'utilisateur n'est pas trouvé.
            return res.redirect('/register'); // Redirige vers la page d'enregistrement si l'utilisateur n'est pas trouvé.
        }

        // Vérifie si le mot de passe correspond avec bcrypt.
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Erreur lors de la vérification du mot de passe :", err.message); // Log l'erreur de vérification du mot de passe.
                req.session.flash = { error: "Erreur lors de la vérification du mot de passe." };
                return res.redirect('/login'); // Redirige en cas d'erreur de vérification.
            }

            if (!isMatch) {
                req.session.flash = { error: "Mot de passe incorrect" }; // Message d'erreur si le mot de passe ne correspond pas.
                return res.redirect('/login'); // Redirige vers la page de connexion.
            }

            // Génère un token JWT pour l'utilisateur.
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                secretKey,
                { expiresIn: '1h' } // Le token expire après 1 heure.
            );

            // Ajoute les informations de l'utilisateur dans les cookies.
            res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
            res.cookie('name', user.username, { secure: false, maxAge: 3600000 });
            res.cookie('id', user.id, { secure: false, maxAge: 3600000 });
            res.cookie('role', user.role, { secure: false, maxAge: 3600000 });

            // Redirige l'utilisateur en fonction de son rôle.
            if (user.role === 'admin') {
                req.session.flash = { success: "Vous êtes connecté en tant qu'administrateur." };
                res.redirect('/admin'); // Redirige vers la page admin.
            } else {
                req.session.flash = { success: "Vous êtes connecté en tant qu'utilisateur." };
                res.redirect('/user'); // Redirige vers la page utilisateur.
            }
        });
    });
}

/**
 * @function traitLogout
 * @description Déconnecte l'utilisateur en supprimant les cookies et redirige vers la page d'accueil.
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 */
function traitLogout(req, res) {
    // Supprime les cookies de l'utilisateur.
    res.clearCookie('id');
    res.clearCookie('name');
    res.clearCookie('role');
    req.session.flash = { success: "Déconnexion réussie" }; // Message de succès après la déconnexion.
    res.redirect('/home'); // Redirige vers la page d'accueil après déconnexion.
}

/**
 * @function showHome
 * @description Affiche la page d'accueil avec les annonces disponibles.
 * Récupère les annonces depuis la base de données et les affiche sous forme de tableau avec leurs images associées.
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 */
function showHome(req, res) {
    const role = req.cookies.role; // Récupère le rôle de l'utilisateur depuis les cookies.
    const annoncesQuery = `SELECT 
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
                            annonces.id;`;

    // Récupère toutes les annonces depuis la base de données.
    db.all(annoncesQuery, (errAnnonces, annonces) => {
        if (errAnnonces) {
            console.error("Erreur lors de la récupération des annonces :", errAnnonces.message); // Log l'erreur de récupération des annonces.
            req.session.flash = { error: "Erreur interne du serveur." };
            return res.redirect('/depot'); // Redirige en cas d'erreur de récupération des annonces.
        }

        // Regroupe les annonces avec leurs images.
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
                acc[annonce_id].images.push(image_url); // Ajoute l'image de l'annonce.
            }

            return acc;
        }, {});

        const annoncesArray = Object.values(groupedAnnonces); // Transforme l'objet en tableau.

        res.setHeader('Content-Type', 'text/html');
        const flash = res.locals.flash || {}; // Récupère les messages flash, s'il y en a.
        return res.send(homeView(annoncesArray, flash, role)); // Rend la vue d'accueil avec les annonces, les messages flash et le rôle.
    });
}

module.exports = { getUser, showRegister, traitRegister, showLogin, traitLogin, traitLogout, showHome };
