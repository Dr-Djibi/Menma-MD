import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';
import { markTableReady } from './ready.js';

const Settings = sequelize.define('Settings', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: '1',
    },
    anticall: {
        type: DataTypes.STRING,
        defaultValue: 'non',
    },
    antiprive: {
        type: DataTypes.STRING,
        defaultValue: 'non',
    },
    autoreact: {
        type: DataTypes.STRING,
        defaultValue: 'off',
    },
    mode: {
        type: DataTypes.STRING,
        defaultValue: config.MODE || 'private',
    },
    autoUpdate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updateAlert: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    lastStartupMsg: {
        type: DataTypes.STRING,
        defaultValue: 'none',
    },
    lastSessionId: {
        type: DataTypes.STRING,
        defaultValue: 'none',
    },
    customFooter: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    mentionResponse: {
        type: DataTypes.TEXT,
        defaultValue: '',
    },
    firstLaunch: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'settings',
    timestamps: false,
});

let isReady = false;

/**
 * Migration sécurisée pour SQLite et autres DB.
 * Ajoute les colonnes manquantes sans détruire les données existantes.
 */
async function secureSync() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        
        // 1. Créer la table si elle n'existe pas
        await Settings.sync();

        // 2. Récupérer la structure actuelle de la table
        const tableDefinition = await queryInterface.describeTable('settings');

        // 3. Liste des colonnes à vérifier/ajouter (si elles n'existent pas dans la définition)
        const columnsToEnsure = [
            { name: 'mentionResponse', type: DataTypes.TEXT },
            { name: 'firstLaunch', type: DataTypes.DATE },
            { name: 'customFooter', type: DataTypes.STRING },
        ];

        for (const col of columnsToEnsure) {
            if (!tableDefinition[col.name]) {
                console.log(`[DB] Migration : Ajout de la colonne '${col.name}' à la table 'settings'...`);
                await queryInterface.addColumn('settings', col.name, {
                    type: col.type,
                    allowNull: true,
                    defaultValue: (col.name === 'firstLaunch') ? new Date() : ''
                }).catch(e => console.log(`[DB] Colonne '${col.name}' déjà présente ou erreur mineure.`));
            }
        }

        // 4. Nettoyage des tables de backup corrompues par Sequelize (Optionnel mais recommandé pour SQLite)
        await sequelize.query("DROP TABLE IF EXISTS settings_backup;").catch(() => {});

        // 5. Initialisation du record principal
        let s = await Settings.findByPk('1');
        if (!s) {
            await Settings.create({ id: '1', firstLaunch: new Date() });
        } else if (!s.firstLaunch) {
            await s.update({ firstLaunch: new Date() });
        }

        console.log("Table 'Settings' synchronisée avec succès.");
        markTableReady('Settings');
        isReady = true;
    } catch (e) {
        console.error("[DB CRITICAL ERR] Settings sync failed:", e.message);
        // On libère quand même le bot pour éviter un blocage total
        markTableReady('Settings');
        isReady = true;
    }
}

// Lancement de la synchronisation sécurisée
secureSync();

let settingsCache = null;

async function getSettings() {
    while (!isReady) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (settingsCache) return settingsCache;
    let settings = await Settings.findByPk('1');
    if (!settings) {
        settings = await Settings.create({ id: '1' });
    }
    settingsCache = settings.get({ plain: true });
    return settingsCache;
}

async function updateSetting(key, value) {
    while (!isReady) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    let settings = await Settings.findByPk('1');
    if (!settings) {
        settings = await Settings.create({ id: '1' });
    }
    await settings.update({ [key]: value });
    settingsCache = settings.get({ plain: true });
    return settingsCache;
}

export { Settings, getSettings, updateSetting };
