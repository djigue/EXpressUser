const jwt = require('jsonwebtoken');
const secretKey = 'bon';  // Clé secrète pour la vérification du JWT.

/**
 * @middleware authMiddleware
 * @description Middleware de vérification du token JWT dans les cookies pour authentifier l'utilisateur.
 * Si le token est présent et valide, il est décodé et l'utilisateur est ajouté à la requête.
 * Sinon, une erreur 401 ou 403 est renvoyée selon le cas.
 */
const authMiddleware = (req, res, next) => {
    // Récupération du token depuis les cookies.
    const token = req.cookies.token;

    // Si aucun token n'est trouvé, retour d'une erreur 401.
    if (!token) {
        return res.status(401).send('Accès non autorisé : Token manquant');
    }

    try {
        // Vérification et décodage du token JWT avec la clé secrète.
        const user = jwt.verify(token, secretKey);
        req.user = user;  // Ajout de l'utilisateur décodé à l'objet de la requête.
        next();  // Appel du prochain middleware ou route.
    } catch (err) {
        // Si une erreur survient lors de la vérification du token, une erreur 403 est renvoyée.
        return res.status(403).send('Accès non autorisé : Token invalide');
    }
};

/**
 * @middleware admin
 * @description Middleware pour vérifier si l'utilisateur authentifié a un rôle d'administrateur.
 * Si l'utilisateur est un administrateur, la requête continue.
 * Sinon, une erreur 403 est renvoyée.
 */
const admin = (req, res, next) => {
    // Si l'utilisateur a le rôle "admin", on autorise l'accès à la suite.
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    // Si l'utilisateur n'est pas administrateur, une erreur 403 est renvoyée.
    return res.status(403).send('Accès réservé aux administrateurs !')
};

module.exports = { authMiddleware, admin };
