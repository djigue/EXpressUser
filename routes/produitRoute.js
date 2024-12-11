const express = require('express');
const router = express.Router();
const {showProduct, showPanier, traitPanier}  = require('../controllers/produitController');
const db = require ('../db/db');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.get('/produits', authMiddleware, (req, res) => {
    showProduct (req, res);
});

router.get('/panier', authMiddleware, (req,res) => {
    showPanier (req, res);
})
router.post('/panier', authMiddleware, (req,res) => {
    traitPanier (req,res);
})

module.exports = router;