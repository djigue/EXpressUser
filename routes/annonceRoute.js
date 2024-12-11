const express = require('express');
const router = express.Router();
const {showAnnonce, showDepot, traitDepot, showDepAnn}  = require('../controllers/annonceController');
const db = require ('../db/db');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.get('/annonce', (req,res) => {
    showAnnonce (req, res);
})

router.get('/depot/formulaire', authMiddleware, (req,res) => {
    showDepot (req, res);
})

router.post('/depot', authMiddleware, (req, res) => {
    traitDepot (req, res);
})

router.get('/depot', (req, res) => {
    showDepAnn (req,res);
})

module.exports = router;