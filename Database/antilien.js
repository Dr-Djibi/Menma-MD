import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';
import { markTableReady } from './ready.js';

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
    type: DataTypes.ENUM('supp', 'kick', 'warn'),
    defaultValue: 'supp',
  },
}, {
  tableName: 'antilien',
  timestamps: false,
});

(async () => {
  await Antilien.sync();
  console.log("Table 'Antilien' synchronisée avec succès.");
  markTableReady('Antilien');
})();

async function addOrUpdateJid(id, mode) {
  let antilien = await Antilien.findByPk(id);
  if (antilien) {
    return await antilien.update({ mode });
  } else {
    return await Antilien.create({ id, mode });
  }
}

async function updateActionInJid(id, type) {
  let antilien = await Antilien.findByPk(id);
  if (antilien) {
    return await antilien.update({ type });
  } else {
    return await Antilien.create({ id, type });
  }
}

async function verifstatutJid(id) {
  let antilien = await Antilien.findByPk(id);
  return antilien ? antilien.mode : 'non';
}

async function recupActionJid(id) {
  let antilien = await Antilien.findByPk(id);
  return antilien ? antilien.type : 'supp';
}

export { Antilien, addOrUpdateJid, updateActionInJid, verifstatutJid, recupActionJid };