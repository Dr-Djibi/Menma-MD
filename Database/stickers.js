import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

const StickerCommand = sequelize.define('StickerCommand', {
    hash: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    cmdName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'StickerCommands',
    timestamps: false,
});

(async () => {
    await StickerCommand.sync();
    console.log("Table 'StickerCommand' synchronisée avec succès.");
})();

export { StickerCommand };
