const annonceView = require ('../views/annonceView');
const depotView = require ('../views/depotView');
const db = require ('../db/db');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const bcrypt = require('bcrypt');

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

 module.exports = { showAnnonce, showDepot};