import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

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
    type: DataTypes.ENUM('supp', 'kick', 'warn'),
    defaultValue: 'supp',
  },
}, {
  tableName: 'antibot',
  timestamps: false,
});

(async () => {
  await Antibot.sync({ alter: true });
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

export { Antibot, atbAddOrUpdateJid, atbUpdateAction, atbVerifStatutJid, atbRecupActionJid };