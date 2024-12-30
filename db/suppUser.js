const sqlite3 = require('sqlite3').verbose(); // Import de SQLite
const db = new sqlite3.Database('../database.sqlite'); // Chemin vers votre base de données

/**
 * Supprime un utilisateur par son ID
 * @param {number} userId - L'identifiant de l'utilisateur à supprimer
 * @param {Function} callback - Fonction callback pour gérer le résultat ou les erreurs
 */
function deleteUserById(userId, callback) {
    if (!userId) {
        return callback(new Error("L'ID de l'utilisateur est requis."));
    }

    const query = `DELETE FROM users WHERE id = ?`;

    db.run(query, [userId], function (err) {
        if (err) {
            console.error('Erreur lors de la suppression de l’utilisateur :', err.message);
            return callback(err);
        }

        if (this.changes === 0) {
            console.log('Aucun utilisateur trouvé avec cet ID.');
            return callback(null, false); // Aucun utilisateur supprimé
        }

        console.log(`Utilisateur avec l'ID ${userId} supprimé.`);
        return callback(null, true); // Utilisateur supprimé avec succès
    });
}

// Exemple d'utilisation
deleteUserById(36, (err, success) => {
    if (err) {
        return console.error('Erreur:', err.message);
    }

    if (success) {
        console.log('Utilisateur supprimé avec succès.');
    } else {
        console.log('Aucun utilisateur trouvé avec cet ID.');
    }
});
