const User = require ('../models/user');
const userView = require ('../views/userView');
const loginView = require ('../views/loginView');
const registerView = require ('../views/registerView');
const homeView = require ('../views/homeView');
const db = require ('../db/db');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const bcrypt = require('bcrypt');


function getUser(req, res) {
    const { name, id: user_id, role } = req.cookies;

    if (!user_id || !name) {
        req.session.flash = { error: "Vous devez être connecté pour accéder à cette page." };
        return res.redirect('/login');
    }

    const userQuery = `SELECT * FROM users WHERE id = ? AND username = ?`;
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

    db.get(userQuery, [user_id, name], (err, user) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err.message);
            req.session.flash = { error: "Erreur interne du serveur." };
            return res.redirect('/login');
        }

        if (!user) {
            req.session.flash = { error: "Utilisateur non trouvé." };
            return res.redirect('/login');
        }

        db.all(annoncesQuery, (errAnnonces, annonces) => {
            if (errAnnonces) {
                console.error("Erreur lors de la récupération des annonces :", errAnnonces.message);
                req.session.flash = { error: "Erreur interne du serveur." };
                return res.redirect('/depot');
            }

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
         
            res.setHeader('Content-Type', 'text/html');
            const flash = res.locals.flash || {};
            return res.send(userView(user, annoncesArray, flash, role));
        });
    });
}

         
function showRegister (req,res) {
    const role =req.cookies.role;
    const flash = res.locals.flash || {}; 
    console.log("showlogin role : ", role);
    res.send(registerView(flash, role));
 }

 function traitRegister(req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
        req.session.flash = { error: "Nom ou mot de passe manquant" };
        return res.redirect('/register');
        }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Erreur lors du hachage du mot de passe :", err.message);
            req.session.flash = { error: "Erreur lors du hachage du mot de passe." };
            return res.redirect('/register');
        }

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

    db.run(query, [name, hashedPassword], function (err) {
        if (err) {
            console.error("Enregistrement échoué :", err.message);
            req.session.flash = { error: "Enregistrement échoué" };
            return res.redirect('/register');
        } else {
            req.session.flash = { success: "Enregistrement réussi" };
            return res.redirect('/login');
        }
    });
  })
}

function showLogin (req,res) {
    const role =req.cookies.role;
    const flash = res.locals.flash || {}; 
    res.send(loginView(flash, role));
}

function traitLogin(req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
        req.session.flash = { error: "Nom ou mot de passe manquant" };
        return res.redirect('/login');     
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [name], (err, user) => {
        if (err) {
            console.error("Erreur lors de la recherche de l'utilisateur :", err.message);
            req.session.flash = { error: "Erreur lors de la recherche de l'utilisateur." };
            return res.redirect('/login');
        }

        if (!user) {
            req.session.flash = { error: "Utilisateur introuvable" };
            return res.redirect('/register');    
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Erreur lors de la vérification du mot de passe :", err.message);
                req.session.flash = { error: "Erreur lors de la vérification du mot de passe." };
                return res.redirect('/login');
            }

            if (!isMatch) {
                req.session.flash = { error: "Mot de passe incorrect" };
                return res.redirect('/login');
            }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            secretKey,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
        res.cookie('name', user.username, { secure: false, maxAge: 3600000 });
        res.cookie('id', user.id, { secure: false, maxAge: 3600000 });
        res.cookie('role', user.role, { secure: false, maxAge: 3600000 });

        if(user.role === 'admin') {
            req.session.flash = { success: "Vous êtes connécté en tant qu'administrateur." };
            res.redirect('/admin');
        }else {
            req.session.flash = { success: "Vous êtes connécté en tant qu'utilisateur." };
            res.redirect('/user');
        }
        
    });
  });
}

 function traitLogout(req, res) {
    
    res.clearCookie('id');
    res.clearCookie('name');
    res.clearCookie('role');
    req.session.flash = { success: "Déconnexion réussie" };
    res.redirect('/home'); 
        
}

function showHome(req, res) {
    const role = req.cookies.role;
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
db.all(annoncesQuery, (errAnnonces, annonces) => {
    if (errAnnonces) {
        console.error("Erreur lors de la récupération des annonces :", errAnnonces.message);
        req.session.flash = { error: "Erreur interne du serveur." };
        return res.redirect('/depot');
    }

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

    res.setHeader('Content-Type', 'text/html');
    const flash = res.locals.flash || {};
    return res.send(homeView(annoncesArray, flash, role));
});
}


module.exports = {getUser, showRegister, traitRegister, showLogin, traitLogin, traitLogout, showHome};