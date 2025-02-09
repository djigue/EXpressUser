const express = require('express');
const router = express.Router();
const { showPanier, traitPanier, panierSupp, panierMoins, panierPlus } = require('../controllers/panierController');
const db = require('../db/db');
const { authMiddleware } = require('../middlewares/authMiddleware');

/**
 * @function /panier
 * @description Route pour afficher le panier de l'utilisateur (accessible uniquement par un utilisateur authentifié).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/panier', authMiddleware, (req, res) => {
    showPanier(req, res); // Affiche le contenu du panier de l'utilisateur.
});

/**
 * @function /panier
 * @description Route pour ajouter un produit au panier ou modifier les informations du panier.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.post('/panier', authMiddleware, (req, res) => {
    traitPanier(req, res); // Traite l'ajout ou la modification d'articles dans le panier.
});

/**
 * @function /panier-supprimer/:id
 * @description Route pour supprimer un produit du panier.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.post('/panier-supprimer/:id', authMiddleware, (req, res) => {
    panierSupp(req, res); // Supprime un produit spécifique du panier.
});

/**
 * @function /panier-diminuer/:id
 * @description Route pour diminuer la quantité d'un produit dans le panier.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.post('/panier-diminuer/:id', authMiddleware, (req, res) => {
    panierMoins(req, res); // Diminue la quantité d'un produit dans le panier.
});

/**
 * @function /panier-augmenter/:id
 * @description Route pour augmenter la quantité d'un produit dans le panier.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.post('/panier-augmenter/:id', authMiddleware, (req, res) => {
    panierPlus(req, res); // Augmente la quantité d'un produit dans le panier.
});

module.exports = router;
