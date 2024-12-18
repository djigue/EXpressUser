const express = require('express');
const router = express.Router();

const path = require('path');
const db = require ('../db/db');

const {authMiddleware} = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware'); 
const {showAnnonce, showDepot, traitDepot, showDepAnn, showModif, traitModif, traitSupp}  = require('../controllers/annonceController');

router.get('/annonce', (req,res) => {
    showAnnonce (req, res);
})

router.get('/depot/formulaire', authMiddleware, (req,res) => {
    showDepot (req, res);
})

router.post('/depot', authMiddleware,upload.array('imagesUser', 3), (req, res) => {
    traitDepot (req, res);
})

router.get('/depot', (req, res) => {
    showDepAnn (req,res);
})

router.get('/modifier-annonce/:id', authMiddleware, (req, res) => {
    showModif (req, res);
})

router.post('/modifier-annonce/:id', authMiddleware, (req, res) => {
    traitModif (req, res);
})

router.post('/supprimer-annonce-user/:id', authMiddleware, (req, res) => {
    traitSupp (req, res);
})

module.exports = router;