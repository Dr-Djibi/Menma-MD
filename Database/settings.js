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
    }
}, {
    tableName: 'settings',
    timestamps: false,
});

let isReady = false;
(async () => {
    await Settings.sync({ alter: true });
    console.log("Table 'Settings' synchronisée avec succès (alter: true).");
    markTableReady('Settings');
    isReady = true;
})();

let settingsCache = null;

async function getSettings() {
    // Attendre que la table soit prête
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
    // Attendre que la table soit prête
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
