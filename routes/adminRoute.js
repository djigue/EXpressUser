const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { showAdmin, showAdminUser, showAdminAnnonce, showAdminAnnonceval, showDelete, suppUser, validAnnonce, suppAnn } = require('../controllers/adminController');
const { authMiddleware, admin } = require('../middlewares/authMiddleware');

/**
 * @function /delete
 * @description Route pour supprimer un utilisateur ou un produit. L'accès est limité aux administrateurs avec authentification.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.get('/delete', authMiddleware, admin, (req, res) => {
    showDelete(req, res); // Affiche la page pour supprimer un utilisateur ou un produit.
});

/**
 * @function /admin/user
 * @description Route pour afficher la gestion des utilisateurs dans le tableau de bord administrateur.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.get('/admin/user', authMiddleware, admin, (req, res) => {
    showAdminUser(req, res); // Affiche la liste des utilisateurs dans le tableau de bord admin.
});

/**
 * @function /admin/annonce
 * @description Route pour afficher la gestion des annonces dans le tableau de bord administrateur.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.get('/admin/annonce', authMiddleware, admin, (req, res) => {
    showAdminAnnonce(req, res); // Affiche la liste des annonces dans le tableau de bord admin.
});

/**
 * @function /admin/annonceval
 * @description Route pour afficher les annonces en attente de validation dans le tableau de bord administrateur.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.get('/admin/annonceval', authMiddleware, admin, (req, res) => {
    showAdminAnnonceval(req, res); // Affiche la liste des annonces en attente de validation.
});

/**
 * @function /delete (POST)
 * @description Route pour traiter la suppression d'un utilisateur ou d'un produit via un formulaire (POST).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.post('/delete', authMiddleware, admin, (req, res) => {
    traitDelete(req, res); // Traite la suppression d'un utilisateur ou produit.
});

/**
 * @function /admin
 * @description Route pour afficher le tableau de bord administrateur.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.get('/admin', authMiddleware, admin, (req, res) => {
    showAdmin(req, res); // Affiche le tableau de bord administrateur.
});

/**
 * @function /supprimer-utilisateur
 * @description Route pour supprimer un utilisateur via un formulaire (POST).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.post('/supprimer-utilisateur', authMiddleware, admin, (req, res) => {
    suppUser(req, res); // Supprime un utilisateur.
});

/**
 * @function /supprimer-utilisateur/:id
 * @description Route pour supprimer un utilisateur par ID via un formulaire (POST).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.post('/supprimer-utilisateur/:id', authMiddleware, admin, (req, res) => {
    suppUser(req, res); // Supprime un utilisateur par son ID.
});

/**
 * @function /supprimer-produit
 * @description Route pour supprimer un produit via un formulaire (POST).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.post('/supprimer-produit', authMiddleware, admin, (req, res) => {
    suppProd(req, res); // Supprime un produit.
});

/**
 * @function /supprimer-produit/:id
 * @description Route pour supprimer un produit par ID via un formulaire (POST).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.post('/supprimer-produit/:id', authMiddleware, admin, (req, res) => {
    suppProd(req, res); // Supprime un produit par son ID.
});

/**
 * @function /supprimer-annonce
 * @description Route pour supprimer une annonce via un formulaire (POST).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.post('/supprimer-annonce', authMiddleware, admin, (req, res) => {
    suppAnn(req, res); // Supprime une annonce.
});

/**
 * @function /supprimer-annonce/:id
 * @description Route pour supprimer une annonce par ID via un formulaire (POST).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.post('/supprimer-annonce/:id', authMiddleware, admin, (req, res) => {
    suppAnn(req, res); // Supprime une annonce par son ID.
});

/**
 * @function /valider-annonce/:id
 * @description Route pour valider une annonce par son ID via un formulaire (POST).
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 * @middleware admin - Assure que l'utilisateur est un administrateur.
 */
router.post('/valider-annonce/:id', authMiddleware, admin, (req, res) => {
    validAnnonce(req, res); // Valide une annonce par son ID.
});

module.exports = router;
