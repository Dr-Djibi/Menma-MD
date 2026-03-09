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
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('ecrit', 'enligne', 'enregistre', 'non'),
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

async function addOrUpdatePresence(id, type) {
  let presence = await Presence.findByPk(id);
  if (presence) {
    return await presence.update({ type });
  } else {
    return await Presence.create({ id, type });
  }
}

async function presenceUpdateActionJid(id, type) {
  return await addOrUpdatePresence(id, type);
}

async function preseceRecupAction(id) {
  let presence = await Presence.findByPk(id);
  if (presence) {
    return presence.type;
  } else {
    return 'non';
  }
}

module.exports = { Presence, addOrUpdatePresence, presenceUpdateActionJid, preseceRecupAction };