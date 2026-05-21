import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';
import { markTableReady } from './ready.js';

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
    await StickerCommand.sync({ alter: true });
    console.log("Table 'StickerCommand' synchronisée avec succès.");
    markTableReady('StickerCommand');
})();

export { StickerCommand };
