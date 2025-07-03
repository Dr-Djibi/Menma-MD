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

const Presence = sequelize.define('Presence', {
 
  type: {
    type: DataTypes.ENUM('composing', 'available','recording','non'),
    defaultValue: 'non',
  },
}, {
  tableName: 'Presence',
  timestamps: false,
});

(async () => {
  await Presence.sync();
  console.log("Table 'Presence' synchronisée avec succès.");

})();

module.exports = { Presence };