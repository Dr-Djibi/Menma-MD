import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'Session',
    timestamps: true,
});

(async () => {
    await Session.sync();
    console.log("Table 'Session' synchronisée avec succès.");

})();

export { Session as session };