const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');
const db = config.DATABASE;

let sequelize;

if (!db) {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.db',
        logging: false,
    });
} else {
    sequelize = new Sequelize(db, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    });
}

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

module.exports = { session: Session };