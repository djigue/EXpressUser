const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey = 'bon';
const session = require('express-session');
const flashMiddleware = require('./middlewares/flashMiddleware');

const db = require ('./db/db');
const traitLogout = require('./controllers/userController');
const userRouter = require('./routes/userRoute');
const produitRouter = require('./routes/panierRoute');
const annonceRouter = require('./routes/annonceRoute');
const adminRouter = require('./routes/adminRoute');

const port = 3000;
const app = express();

/**
 * @function
 * @brief Configure les paramètres de session pour Express.
 */
app.use(session({
    secret: 'key', // Clé secrète pour la session
    resave: false, // Ne pas resauvegarder la session si elle n'a pas été modifiée
    saveUninitialized: true, // Sauvegarder une session non initialisée
    cookie: { secure: false } // Le cookie ne sera pas sécurisé (utile en développement)
}));

/**
 * @function
 * @brief Ajoute un en-tête Cache-Control pour éviter la mise en cache des pages.
 * @param {object} req Requête de l'utilisateur
 * @param {object} res Réponse de l'application
 * @param {function} next Fonction de middleware pour passer à la suite du traitement
 */
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

/**
 * @function
 * @brief Utilise le middleware cookie-parser pour gérer les cookies
 */
app.use(cookieParser());

/**
 * @function
 * @brief Utilise le middleware flashMiddleware pour gérer les messages flash.
 */
app.use(flashMiddleware);

/**
 * @function
 * @brief Analyse les requêtes JSON pour les transformer en objets JavaScript.
 */
app.use(express.json());

/**
 * @function
 * @brief Permet de parser les données du corps des requêtes (formulaires URL-encodés).
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @function
 * @brief Permet de parser les données du corps des requêtes au format JSON.
 */
app.use(bodyParser.json());

/**
 * @function
 * @brief Permet de gérer les cookies à l'aide de cookie-parser.
 */
app.use(cookieParser());

/**
 * @function
 * @brief Définit le dossier public pour servir les fichiers statiques.
 */
app.use(express.static(path.join(__dirname)));

/**
 * @function
 * @brief Intègre les routes utilisateur dans l'application.
 */
app.use(userRouter);

/**
 * @function
 * @brief Intègre les routes panier (produit) dans l'application.
 */
app.use(produitRouter);

/**
 * @function
 * @brief Intègre les routes d'annonces dans l'application.
 */
app.use(annonceRouter);

/**
 * @function
 * @brief Intègre les routes administratives dans l'application.
 */
app.use(adminRouter);

/**
 * @function
 * @brief Définit le chemin pour servir les scripts statiques.
 */
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));

/**
 * @function
 * @brief Définit le chemin pour servir les images statiques.
 */
app.use('/images', express.static('images'));

/**
 * @function
 * @brief Route POST pour gérer la déconnexion de l'utilisateur.
 * @param {object} req Requête de déconnexion
 * @param {object} res Réponse de déconnexion
 */
app.post('/logout', (req, res) => {
    traitLogout(req, res); // Appel à la fonction traitLogout pour gérer la déconnexion
});

/**
 * @function
 * @brief Démarre le serveur Express sur le port spécifié.
 */
app.listen(port, () => {
    console.log('Serveur en écoute sur le port 3000');
});
