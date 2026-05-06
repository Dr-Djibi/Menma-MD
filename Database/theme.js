import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

const Theme = sequelize.define('Theme', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: 'global'
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('id', 'url'),
        defaultValue: 'id',
    },
}, {
    tableName: 'Theme',
    timestamps: false,
});

(async () => {
    await Theme.sync();
    console.log("Table 'Theme' synchronisée avec succès.");
})();

async function setTheme(value, type = 'id') {
    let theme = await Theme.findByPk('global');
    if (theme) {
        return await theme.update({ value, type });
    } else {
        return await Theme.create({ id: 'global', value, type });
    }
}

async function getSavedTheme() {
    let theme = await Theme.findByPk('global');
    if (theme) {
        return { value: theme.value, type: theme.type };
    } else {
        return null;
    }
}

export { Theme, setTheme, getSavedTheme };
