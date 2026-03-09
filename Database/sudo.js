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

const Sudo = sequelize.define('Sudo', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
}, {
  tableName: 'Sudo',
  timestamps: false,
});

(async () => {
  await Sudo.sync();
  console.log("Table 'Sudo' synchronisée avec succès.");

})();

async function addSudoNumber(id) {
  let [sudo] = await Sudo.findOrCreate({ where: { id } });
  return sudo;
}

async function delSudoNumber(id) {
  return await Sudo.destroy({ where: { id } });
}

async function getAllSudoNumbers() {
  let sudos = await Sudo.findAll();
  return sudos.map(s => s.id);
}

module.exports = { Sudo, addSudoNumber, delSudoNumber, getAllSudoNumbers };