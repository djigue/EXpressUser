const multer = require('multer');
const path = require('path');

// Configuration de Multer pour gérer le stockage des fichiers
const storage = multer.diskStorage({
    /**
     * @function destination
     * @description Spécifie le répertoire de destination où les fichiers téléchargés seront stockés.
     * Ici, les fichiers seront stockés dans le dossier 'images/'.
     * @param {Object} req - L'objet de requête Express.
     * @param {Object} file - L'objet fichier contenant des informations sur le fichier téléchargé.
     * @param {Function} cb - La fonction de rappel pour spécifier le répertoire de destination.
     */
    destination: (req, file, cb) => {
        cb(null, 'images/');  // Définir le dossier 'images/' comme destination
    },
    
    /**
     * @function filename
     * @description Spécifie le nom du fichier lorsqu'il est stocké sur le serveur.
     * Le nom est généré en utilisant un suffixe unique (timestamp + nombre aléatoire) 
     * et l'extension d'origine du fichier.
     * @param {Object} req - L'objet de requête Express.
     * @param {Object} file - L'objet fichier contenant des informations sur le fichier téléchargé.
     * @param {Function} cb - La fonction de rappel pour définir le nom du fichier.
     */
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Générer un suffixe unique basé sur la date et un nombre aléatoire
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ajouter l'extension du fichier à la fin du nom généré
    }
});

// Middleware de Multer pour gérer l'upload des fichiers
const upload = multer({ storage }).array('imagesUser', 3); // Accepter jusqu'à 3 fichiers envoyés avec le champ 'imagesUser'

module.exports = upload; // Exporter le middleware pour l'utiliser dans d'autres fichiers
