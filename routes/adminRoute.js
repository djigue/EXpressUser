const express = require('express');
const router = express.Router();
const db = require ('../db/db');
const {showAdmin, showAdminUser, showAdminAnnonce, showAdminAnnonceval, showDelete, suppUser, validAnnonce, suppAnn} = require('../controllers/adminController');
const {authMiddleware, admin} = require('../middlewares/authMiddleware');

router.get ('/delete', authMiddleware, admin, (req,res) =>{
    showDelete (req,res);
});

router.get ('/admin/user', authMiddleware, admin, (req,res) =>{
    showAdminUser (req,res);
});

router.get ('/admin/annonce', authMiddleware, admin, (req,res) =>{
    showAdminAnnonce (req,res);
});

router.get ('/admin/annonceval', authMiddleware, admin, (req,res) =>{
    showAdminAnnonceval (req,res);
});

router.post('/delete', authMiddleware, admin, (req, res) => {
    traitDelete (req,res);
});

router.get('/admin', authMiddleware, admin, (req, res) => {
    showAdmin (req,res);
})

router.post('/supprimer-utilisateur', authMiddleware, admin, (req, res) => {
    suppUser(req, res); 
});

router.post('/supprimer-utilisateur/:id', authMiddleware, admin, (req, res) => {
    suppUser (req,res);
});

router.post('/supprimer-produit', authMiddleware, admin, (req, res) => {
    suppProd(req, res); 
});

router.post('/supprimer-produit/:id', authMiddleware, admin, (req, res) => {
    suppProd (req,res);
});

router.post('/supprimer-annonce', authMiddleware, admin, (req, res) => {
    suppAnn(req, res); 
});

router.post('/supprimer-annonce/:id', authMiddleware, admin, (req, res) => {
    suppAnn (req,res);
});

router.post('/valider-annonce/:id',authMiddleware, admin, (req, res) => {
    validAnnonce (req, res);
})

module.exports = router;