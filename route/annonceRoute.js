const express = require('express');
const router = express.Router();
const {showAnnonce, showDepot}  = require('../controllers/annonceController');
const db = require ('../db/db');
const {authMiddleware} = require('../middlewares/authMiddleware');

router.get('/annonce', (req,res) => {
    showAnnonce (req, res);
})

router.get('/depot', authMiddleware, (req,res) => {
    showDepot (req, res);
})

module.exports = router;