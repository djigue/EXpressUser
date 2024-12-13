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
   
    const name = req.cookies.name;
    const id = req.cookies.id;
    const query = `SELECT * FROM users WHERE id = ? AND username = ?`;
    
        db.get(query, [id, name], (err, user) => {
            if (err) {
                console.error("Erreur lors de la récupération de l'utilisateur :", err.message);
                return res.status(500).send("Erreur interne du serveur.");
            }

            if (!user) {
                return res.status(404).send("Utilisateur introuvable.");
            }else {
                res.setHeader('Content-Type', 'text/html');
                return res.send(userView(user));
            }

        });
}
         
function showRegister (req,res) {
    res.send(registerView());
 }

 function traitRegister(req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
        res.status(400).send("Nom ou mot de passe manquant.");
        return;
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Erreur lors du hachage du mot de passe :", err.message);
            return res.status(500).send("Erreur lors de l'enregistrement.");
        }

    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;

    db.run(query, [name, hashedPassword], function (err) {
        if (err) {
            console.error("Enregistrement échoué :", err.message);
            res.status(500).send("Erreur lors de l'enregistrement.");
        } else {
            res.send("Enregistrement réussi !");
        }
    });
  })
}

function showLogin (req,res) {
   res.send(loginView());
}

function traitLogin(req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).send({ error: 'Nom ou mot de passe manquant.' });
         
    }

    const query = `SELECT * FROM users WHERE username = ?`;

    db.get(query, [name], (err, user) => {
        if (err) {
            console.error("Erreur lors de la recherche de l'utilisateur :", err.message);
           return res.status(500).send("Erreur interne du serveur.");
        }

        if (!user) {
            return res.status(400).json({ error: 'Nom d\'utilisateur incorrect.' });    
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Erreur lors de la vérification du mot de passe :", err.message);
                return res.status(500).send("Erreur interne du serveur.");
            }

            if (!isMatch) {
                return res.status(400).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
            }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            secretKey,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
        res.cookie('name', user.username, { secure: false, maxAge: 3600000 });
        res.cookie('id', user.id, { secure: false, maxAge: 3600000 });
        
        if(user.role === 'admin') {
            res.redirect('/admin');
        }else {
            res.redirect('/user');
        }
        
    });
  });
}

 function traitLogout(req, res) {
    
    res.clearCookie('id');
    res.clearCookie('name');
    res.redirect('/login');
        
}

function showHome (req, res) {
    const query = `SELECT *
                   FROM annonces; `
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération du panier:', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }
        
        if (!rows || rows.length === 0) {
            if (!res.headersSent) {
                return res.send('<html><body><h1>Aucun produit trouvé.</h1></body></html>');
            }
            return;
        }

        const htmlContent = homeView(rows);
        if (!res.headersSent) {
            return res.send(htmlContent);
        }
    });
}

module.exports = {getUser, showRegister, traitRegister, showLogin, traitLogin, traitLogout, showHome};