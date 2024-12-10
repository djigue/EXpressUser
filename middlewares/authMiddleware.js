const jwt = require('jsonwebtoken');
const secretKey = 'bon'; 

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Accès non autorisé : Token manquant');
    }

    try {
        const user = jwt.verify(token, secretKey);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).send('Accès non autorisé : Token invalide');
    }
};

const admin = (req,res,next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).send('Accès réservé aux administrateurs !')
}

module.exports = {authMiddleware, admin};
