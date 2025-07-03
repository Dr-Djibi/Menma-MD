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

const Antilien = sequelize.define('Antilien', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  mode: {
    type: DataTypes.STRING,
    defaultValue: 'non',
  },
  type: {
    type: DataTypes.ENUM('supp', 'kick'),
    defaultValue: 'supp',
  },
}, {
  tableName: 'antilien',
  timestamps: false,
});

(async () => {
  await Antilien.sync();
  console.log("Table 'Antilien' synchronisée avec succès.");

})();

module.exports = { Antilien };