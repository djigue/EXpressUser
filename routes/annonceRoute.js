const express = require('express');
const router = express.Router();
const path = require('path');
const db = require ('../db/db');

const {authMiddleware} = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware'); 
const {showAnnonce, showDepot, traitDepot, showDepAnn, showModif, traitModif, traitSupp, suppImage, showAnnonceVoir,
       showImmo, showVehicule, showMaison, showElec, showVet, showLoisirs, showAutres}  = require('../controllers/annonceController');

router.get('/annonce', (req,res) => {
    showAnnonce (req, res);
});

router.get('/depot/formulaire', authMiddleware, (req,res) => {
    showDepot (req, res);
});

router.post('/depot', authMiddleware, upload, (req, res) => {
    traitDepot (req, res);
});

router.get('/depot', (req, res) => {
    showDepAnn (req,res);
});

router.get('/annonce-voir/:id', authMiddleware, (req, res) => {
    showAnnonceVoir (req,res);
});

router.get('/modifier-annonce/:id', authMiddleware, (req, res) => {
    showModif (req, res);
});

router.post('/modifier-annonce/:id', authMiddleware, upload, (req, res) => {
    traitModif (req, res);
});

router.post('/supprimer-image/:id', authMiddleware, (req, res) => {
    suppImage (req, res);
});

router.post('/supprimer-annonce-user/:id', authMiddleware, (req, res) => {
    traitSupp (req, res);
});

router.get('/immobilier', authMiddleware, (req,res) => {
    showImmo(req,res);
});

router.get('/vehicule', authMiddleware, (req,res) => {
    showVehicule(req,res);
});

router.get('/maison', authMiddleware, (req,res) => {
    showMaison(req,res);
});

router.get('/elec', authMiddleware, (req,res) => {
    showElec(req,res);
});

router.get('/vetements', authMiddleware, (req,res) => {
    showVet(req,res);
});

router.get('/loisirs', authMiddleware, (req,res) => {
    showLoisirs(req,res);
});

router.get('/autres', authMiddleware, (req,res) => {
    showAutres(req,res);
});

module.exports = router;