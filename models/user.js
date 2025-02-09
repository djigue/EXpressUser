/**
 * @class User
 * @description Classe représentant un utilisateur avec un nom et un mot de passe.
 */
class User {

    /**
     * @constructor
     * @param {string} name - Le nom de l'utilisateur.
     * @param {string} password - Le mot de passe de l'utilisateur.
     * @description Initialise un objet User avec un nom et un mot de passe.
     */
    constructor(name, password) {
        this.name = name;       // Nom de l'utilisateur.
        this.password = password; // Mot de passe de l'utilisateur.
    }

}

module.exports = User;
