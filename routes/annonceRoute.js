const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/db');

const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');
const {
    showAnnonce, showDepot, traitDepot, showDepAnn, showModif, traitModif, traitSupp, suppImage, showAnnonceVoir,
    showImmo, showVehicule, showMaison, showElec, showVet, showLoisirs, showAutres
} = require('../controllers/annonceController');

/**
 * @function /annonce
 * @description Route pour afficher la liste des annonces.
 */
router.get('/annonce', (req, res) => {
    showAnnonce(req, res); // Affiche la liste des annonces.
});

/**
 * @function /depot/formulaire
 * @description Route pour afficher le formulaire de dépôt d'annonce (accessible uniquement par un utilisateur authentifié).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/depot/formulaire', authMiddleware, (req, res) => {
    showDepot(req, res); // Affiche le formulaire de dépôt d'annonce.
});

/**
 * @function /depot
 * @description Route pour traiter le dépôt d'une nouvelle annonce (avec téléchargement de fichiers).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware upload - Middleware pour gérer le téléchargement des fichiers.
 */
router.post('/depot', authMiddleware, upload, (req, res) => {
    traitDepot(req, res); // Traite l'ajout de la nouvelle annonce.
});

/**
 * @function /depot
 * @description Route pour afficher la liste des annonces déposées par l'utilisateur.
 */
router.get('/depot', (req, res) => {
    showDepAnn(req, res); // Affiche la liste des annonces de l'utilisateur.
});

/**
 * @function /annonce-voir/:id
 * @description Route pour afficher les détails d'une annonce spécifique (accessible uniquement par un utilisateur authentifié).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/annonce-voir/:id', authMiddleware, (req, res) => {
    showAnnonceVoir(req, res); // Affiche les détails d'une annonce.
});

/**
 * @function /modifier-annonce/:id
 * @description Route pour afficher le formulaire de modification d'une annonce (accessible uniquement par un utilisateur authentifié).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/modifier-annonce/:id', authMiddleware, (req, res) => {
    showModif(req, res); // Affiche le formulaire pour modifier une annonce.
});

/**
 * @function /modifier-annonce/:id
 * @description Route pour traiter la modification d'une annonce (avec téléchargement de fichiers).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware upload - Middleware pour gérer le téléchargement des fichiers.
 */
router.post('/modifier-annonce/:id', authMiddleware, upload, (req, res) => {
    traitModif(req, res); // Traite la modification de l'annonce.
});

/**
 * @function /supprimer-image/:id
 * @description Route pour supprimer une image d'une annonce.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.post('/supprimer-image/:id', authMiddleware, (req, res) => {
    suppImage(req, res); // Supprime une image spécifique d'une annonce.
});

/**
 * @function /supprimer-annonce-user/:id
 * @description Route pour supprimer une annonce déposée par l'utilisateur.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.post('/supprimer-annonce-user/:id', authMiddleware, (req, res) => {
    traitSupp(req, res); // Supprime une annonce déposée par l'utilisateur.
});

/**
 * @function /immobilier
 * @description Route pour afficher les annonces immobilières.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/immobilier', authMiddleware, (req, res) => {
    showImmo(req, res); // Affiche les annonces immobilières.
});

/**
 * @function /vehicule
 * @description Route pour afficher les annonces de véhicules.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/vehicule', authMiddleware, (req, res) => {
    showVehicule(req, res); // Affiche les annonces de véhicules.
});

/**
 * @function /maison
 * @description Route pour afficher les annonces de maisons.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/maison', authMiddleware, (req, res) => {
    showMaison(req, res); // Affiche les annonces de maisons.
});

/**
 * @function /elec
 * @description Route pour afficher les annonces d'électroménager.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/elec', authMiddleware, (req, res) => {
    showElec(req, res); // Affiche les annonces d'électroménager.
});

/**
 * @function /vetements
 * @description Route pour afficher les annonces de vêtements.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/vetements', authMiddleware, (req, res) => {
    showVet(req, res); // Affiche les annonces de vêtements.
});

/**
 * @function /loisirs
 * @description Route pour afficher les annonces de loisirs.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/loisirs', authMiddleware, (req, res) => {
    showLoisirs(req, res); // Affiche les annonces de loisirs.
});

/**
 * @function /autres
 * @description Route pour afficher les autres types d'annonces.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/autres', authMiddleware, (req, res) => {
    showAutres(req, res); // Affiche les autres types d'annonces.
});

module.exports = router;
