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

const Antibot = sequelize.define('Antibot', {
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
  tableName: 'antibot',
  timestamps: false,
});

(async () => {
  await Antibot.sync();
  console.log("Table 'Antibot' synchronisée avec succès.");

})();

async function atbAddOrUpdateJid(id, mode) {
  let antibot = await Antibot.findByPk(id);
  if (antibot) {
    return await antibot.update({ mode });
  } else {
    return await Antibot.create({ id, mode });
  }
}

async function atbUpdateAction(id, type) {
  let antibot = await Antibot.findByPk(id);
  if (antibot) {
    return await antibot.update({ type });
  } else {
    return await Antibot.create({ id, type });
  }
}

async function atbVerifStatutJid(id) {
  let antibot = await Antibot.findByPk(id);
  if (antibot) {
    return antibot.mode;
  } else {
    return 'non';
  }
}

async function atbRecupActionJid(id) {
  let antibot = await Antibot.findByPk(id);
  if (antibot) {
    return antibot.type;
  } else {
    return 'supp';
  }
}

module.exports = { Antibot, atbAddOrUpdateJid, atbUpdateAction, atbVerifStatutJid, atbRecupActionJid };