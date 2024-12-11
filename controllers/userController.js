const User = require ('../models/user');
const userView = require ('../views/userView');
const loginView = require ('../views/loginView');
const registerView = require ('../views/registerView');
const deleteView = require ('../views/deleteView');
const productView = require ('../views/productView');
const panierView = require ('../views/panierView');
const annonceView = require ('../views/annonceView');
const depotView = require ('../views/depotView');
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
        res.redirect('/user');
    });
  });
}

 function traitLogout(req, res) {
    res.send("Déconnexion réussie !");
        
}

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

function showProduct(req, res) {
    const query = 'SELECT * FROM produits'; 

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits:', err.message);
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

        const htmlContent = productView(rows);
        if (!res.headersSent) {
            return res.send(htmlContent);
        }
    });
}

function showPanier (req,res) {
    console.log("bien arrivé sur /panier");
    const user_id = req.cookies.id; 
    console.log(req.cookies.id);
    if (!user_id) {
        return res.status(401).send("Vous devez être connecté pour accéder à votre panier.");
    }
    const query = `SELECT p.nom, p.prix, c.quantite
                   FROM panier c
                   JOIN produits p ON c.produit_id = p.id 
                   WHERE c.user_id = ?; `
    console.log("Exécution de la requête pour récupérer le panier avec user_id:", user_id)
    db.all(query, [user_id], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération du panier:', err.message);
            if (!res.headersSent) {
                return res.status(500).send('Erreur interne du serveur');
            }
            return;
        }
        console.log("Données reçues du panier :", rows);
        if (!rows || rows.length === 0) {
            if (!res.headersSent) {
                return res.send('<html><body><h1>Aucun produit trouvé.</h1></body></html>');
            }
            return;
        }

        const htmlContent = panierView(rows);
        if (!res.headersSent) {
            return res.send(htmlContent);
        }
    });
 }

function traitPanier(req, res) {
    console.log('Requête reçue sur /panier');
    const { user_id, produit_id, quantite } = req.body;

    console.log('Données reçues :', { user_id, produit_id, quantite }); 
  
    if (!user_id || !produit_id) {
        console.log('ID utilisateur ou ID produit manquant');
        return res.status(400).json({ success: false, message: "L'ID utilisateur et l'ID produit sont obligatoires." });
    }
  
    const query = `
      INSERT INTO panier (user_id, produit_id, quantite)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, produit_id) DO UPDATE SET
        quantite = quantite + excluded.quantite;
    `;
  
    db.run(query, [user_id, produit_id, quantite || 1], function (err) {
      if (err) {
        console.error("Erreur lors de l'ajout au panier :", err.message);
        return res.status(500).json({ message: "Erreur interne du serveur." });
      }
      res.json({ message: "Produit ajouté au panier avec succès !" });
    });
  }
 
  function showAnnonce(req, res){
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
        console.log("Données reçues du panier :", rows);
        if (!rows || rows.length === 0) {
            if (!res.headersSent) {
                return res.send('<html><body><h1>Aucun produit trouvé.</h1></body></html>');
            }
            return;
        }

        const htmlContent = annonceView(rows);
        if (!res.headersSent) {
            return res.send(htmlContent);
        }
    });
  }

  function showDepot (req,res) {
    res.send(depotView());
 }

 function traitDepot (req, res) {
    
 }

module.exports = {getUser, showRegister, traitRegister, showLogin, traitLogin, traitLogout, showDelete, traitDelete, showProduct,
                  traitPanier, showPanier, showAnnonce, showDepot};