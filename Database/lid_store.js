import { DataTypes, Op } from 'sequelize';
import sequelize from './db.js';

const LidStore = sequelize.define('LidStore', {
    lid: {
        type: DataTypes.STRING,
        primaryKey: true,
        comment: 'Numéro LID (sans @lid)',
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Numéro de téléphone correspondant (sans @s.whatsapp.net)',
    },
    label: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Label informatif : owner, dev, sudo, membre, bot...',
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Dernier pseudo (pushName) connu',
    },
}, {
    tableName: 'lid_store',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
});

// Synchronisation automatique
(async () => {
    try {
        await LidStore.sync({ alter: true });
        console.log("[LID STORE] Table 'lid_store' synchronisée.");
    } catch (e) {
        console.log("[LID STORE] Erreur sync :", e.message);
    }
})();

/**
 * Sauvegarde ou met à jour une correspondance LID ↔ numéro.
 * @param {string} lid   - Le numéro LID (sans @lid)
 * @param {string} phone - Le numéro de téléphone (sans @s.whatsapp.net)
 * @param {string} label - Label optionnel (owner, dev, bot, membre…)
 * @param {string} name  - Le pseudo (pushName) à sauvegarder
 */
async function saveLid(lid, phone, label = 'membre', name = null) {
    if (!lid || !phone) return;
    try {
        const [record, created] = await LidStore.findOrCreate({
            where: { lid },
            defaults: { lid, phone, label, name },
        });
        if (!created) {
            const updates = {};
            if (record.phone !== phone) updates.phone = phone;
            if (record.label !== label) updates.label = label;
            if (name && record.name !== name) updates.name = name;
            
            if (Object.keys(updates).length > 0) {
                await record.update(updates);
            }
        }
    } catch (e) {
        console.log("[LID STORE] Erreur saveLid :", e.message);
    }
}

/**
 * Résout un LID en numéro de téléphone depuis la DB.
 * @param {string} lid - Le numéro LID (sans @lid)
 * @returns {Promise<string|null>} Le numéro de téléphone ou null
 */
async function resolveLidFromDb(lid) {
    if (!lid) return null;
    try {
        const record = await LidStore.findByPk(lid);
        return record ? record.phone : null;
    } catch {
        return null;
    }
}

/**
 * Charge tous les LIDs connus depuis la DB dans le Map mémoire (lidCache).
 * À appeler une fois au démarrage du bot.
 * @param {Map} lidCache - Le Map mémoire à alimenter
 * @param {Map} nameCache - Le Map mémoire pour les pseudos
 */
async function preloadLidsToCache(lidCache, nameCache = null) {
    try {
        const records = await LidStore.findAll();
        let count = 0;
        for (const r of records) {
            lidCache.set(r.lid, r.phone);
            if (nameCache && r.name) {
                nameCache.set(r.lid, r.name);
                nameCache.set(r.phone, r.name);
            }
            count++;
        }
        if (count > 0) console.log(`[LID STORE] ${count} LID(s) chargé(s) en mémoire depuis la DB.`);
    } catch (e) {
        console.log("[LID STORE] Erreur preloadLidsToCache :", e.message);
    }
}

export { LidStore, saveLid, resolveLidFromDb, preloadLidsToCache };
