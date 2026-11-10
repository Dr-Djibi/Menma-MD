/**
 * @file camouflage.js
 * @description Modèle Sequelize pour les alias camouflés.
 * Permet de masquer une commande réelle derrière un mot-clé secret
 * qui s'exécute SANS préfixe.
 */

import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const Camouflage = sequelize.define('Camouflage', {
    /** Le mot-clé secret (ex: "météo") — tapé tel quel, sans préfixe */
    alias: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    /** Le nom réel de la commande à exécuter (ex: "weather") */
    realCommand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /** JID du groupe où ce camouflage est actif. NULL = global (tous les chats) */
    groupJid: {
        type: DataTypes.STRING,
        defaultValue: null,
    }
}, {
    tableName: 'camouflage',
    timestamps: false,
});

(async () => {
    await Camouflage.sync();
    console.log("Table 'Camouflage' synchronisée avec succès.");
    markTableReady('Camouflage');
})();

/**
 * Ajoute un alias camouflé.
 * @param {string} alias     - Le mot secret (sans préfixe)
 * @param {string} realCmd   - Le nom réel de la commande
 * @param {string|null} groupJid - Le JID du groupe (null = global)
 */
async function addCamouflage(alias, realCmd, groupJid = null) {
    return await Camouflage.upsert({ alias: alias.toLowerCase(), realCommand: realCmd.toLowerCase(), groupJid });
}

/**
 * Supprime un alias camouflé.
 */
async function delCamouflage(alias) {
    return await Camouflage.destroy({ where: { alias: alias.toLowerCase() } });
}

/**
 * Récupère la commande réelle correspondant à un alias.
 * Vérifie d'abord les alias spécifiques au groupe, puis les globaux.
 * @param {string} alias    - Le mot tapé par l'utilisateur
 * @param {string} groupJid - Le JID du chat courant
 * @returns {string|null} Le nom réel de la commande, ou null
 */
async function getCamouflageCmd(alias, groupJid = null) {
    const lower = alias.toLowerCase();
    // Priorité au mapping groupe-spécifique
    if (groupJid) {
        const specific = await Camouflage.findOne({ where: { alias: lower, groupJid } });
        if (specific) return specific.realCommand;
    }
    // Fallback au mapping global
    const global = await Camouflage.findOne({ where: { alias: lower, groupJid: null } });
    return global ? global.realCommand : null;
}

/**
 * Liste tous les alias camouflés.
 */
async function getAllCamouflage() {
    return await Camouflage.findAll();
}

export { Camouflage, addCamouflage, delCamouflage, getCamouflageCmd, getAllCamouflage };
