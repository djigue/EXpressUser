const express = require('express');
const router = express.Router();
const {showPanier, traitPanier, panierSupp, panierMoins, panierPlus}  = require('../controllers/panierController');
const db = require ('../db/db');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.get('/panier', authMiddleware, (req,res) => {
    console.log ("en route pour showPanier");
    showPanier (req, res);
})
router.post('/panier', authMiddleware, (req,res) => {
    traitPanier (req,res);
})

router.post('/panier-supprimer/:id', authMiddleware, (req,res) => {
    panierSupp (req,res);
})

router.post('/panier-diminuer/:id', authMiddleware, (req, res) => {
     panierMoins (req, res);
});

router.post('/panier-augmenter/:id', authMiddleware, (req, res) => {
    panierPlus (req, res);
});

module.exports = router;