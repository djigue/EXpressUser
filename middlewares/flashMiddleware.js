/**
 * @middleware flashMiddleware
 * @description Middleware qui gère les messages flash stockés dans la session.
 * Il récupère les messages flash de la session, les place dans `res.locals.flash` 
 * pour qu'ils soient accessibles dans les vues, puis supprime les messages flash de la session.
 * Cela permet de montrer des messages comme des notifications après une action (ex: succès, erreur).
 */
module.exports = (req, res, next) => {
    // Récupère les messages flash de la session et les ajoute à res.locals.flash.
    res.locals.flash = req.session.flash || {};
    
    // Supprime les messages flash de la session pour qu'ils ne soient pas persistants sur les prochaines requêtes.
    delete req.session.flash;
    
    // Passe au middleware suivant ou à la gestion de la route.
    next();
};

