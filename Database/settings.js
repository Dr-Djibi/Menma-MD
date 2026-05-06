import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

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
    }
}, {
    tableName: 'settings',
    timestamps: false,
});

(async () => {
    await Settings.sync();
    console.log("Table 'Settings' synchronisée avec succès.");
})();

async function getSettings() {
    let settings = await Settings.findByPk('1');
    if (!settings) {
        settings = await Settings.create({ id: '1' });
    }
    return settings;
}

async function updateSetting(key, value) {
    let settings = await getSettings();
    return await settings.update({ [key]: value });
}

export { Settings, getSettings, updateSetting };
