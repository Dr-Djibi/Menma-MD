/**
 * @file menmacmd.js
 * @description Registre centralisé d'enregistrement des commandes.
 * Fournit une méthode standardisée pour définir les fonctionnalités du bot (plugins).
 */

/**
 * Tableau contenant tous les objets de commande enregistrés.
 */
let commands = [];

/**
 * Enregistre une nouvelle commande dans le système du bot.
 * @param {Object} obj - Les métadonnées de la commande (nom, alias, catégorie, etc.).
 * @param {Function} fonctions - La fonction asynchrone contenant la logique de la commande.
 * @returns {Object} La configuration de la commande enregistrée.
 */
function menmacmd(obj, fonctions) {
    let cmd_info = obj;

    // --- Appliquer des Valeurs par Défaut pour les Informations Manquantes ---

    // Classer en 'General' si aucune catégorie (classe) n'est spécifiée
    if (!cmd_info.classe) {
        cmd_info.classe = "General";
    }

    // Emoji de réaction par défaut pour le déclenchement réussi de la commande
    if (!cmd_info.react) {
        cmd_info.react = "🍷";
    }

    // Description par défaut pour l'aide utilisateur
    if (!cmd_info.desc) {
        cmd_info.desc = "Aucune description fournie";
    }

    // Initialiser la liste d'alias comme un tableau vide si elle n'est pas définie
    if (!cmd_info.alias) {
        cmd_info.alias = [];
    }

    // Attacher la fonction logique à l'objet d'info
    cmd_info.fonction = fonctions;

    // Ajouter au registre global des commandes
    commands.push(cmd_info);

    return cmd_info;
}

module.exports = {
    menmacmd,
    Module: menmacmd, // Alias hérité pour la compatibilité
    commands
};
