const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/db');

const { authMiddleware } = require('../middlewares/authMiddleware');
const { getUser, showRegister, traitRegister, showLogin, traitLogin, traitLogout, showHome } = require('../controllers/userController');

/**
 * @function /home
 * @description Route pour afficher la page d'accueil de l'utilisateur.
 * Cette route est accessible à tous les utilisateurs, authentifiés ou non.
 */
router.get('/home', (req, res) => {
    showHome(req, res); // Affiche la page d'accueil de l'utilisateur.
});

/**
 * @function /user
 * @description Route pour afficher les informations d'un utilisateur authentifié.
 * @middleware authMiddleware - Assure que l'utilisateur est authentifié.
 */
router.get('/user', authMiddleware, (req, res) => {
    getUser(req, res); // Affiche les informations de l'utilisateur connecté.
});

/**
 * @function /register
 * @description Route pour afficher le formulaire d'inscription.
 * Cette route est accessible à tous les utilisateurs non authentifiés.
 */
router.get('/register', (req, res) => {
    showRegister(req, res); // Affiche le formulaire d'inscription pour un nouvel utilisateur.
});

/**
 * @function /register
 * @description Route pour traiter l'inscription d'un nouvel utilisateur.
 */
router.post('/register', (req, res) => {
    traitRegister(req, res); // Traite l'inscription d'un utilisateur et enregistre ses données.
});

/**
 * @function /login
 * @description Route pour afficher le formulaire de connexion.
 * Cette route est accessible à tous les utilisateurs non authentifiés.
 */
router.get('/login', (req, res) => {
    showLogin(req, res); // Affiche le formulaire de connexion.
});

/**
 * @function /login
 * @description Route pour traiter la connexion d'un utilisateur.
 */
router.post('/login', (req, res) => {
    traitLogin(req, res); // Traite les informations de connexion d'un utilisateur et l'authentifie.
});

/**
 * @function /logout
 * @description Route pour déconnecter un utilisateur authentifié.
 */
router.post('/logout', (req, res) => {
    traitLogout(req, res); // Déconnecte l'utilisateur en cours et met fin à sa session.
});

module.exports = router;
