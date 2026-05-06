import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

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
  await Antilien.sync({ alter: true });
  console.log("Table 'Antilien' synchronisée avec succès.");

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
  if (antilien) {
    return antilien.mode;
  } else {
    return 'non';
  }
}

async function recupActionJid(id) {
  let antilien = await Antilien.findByPk(id);
  if (antilien) {
    return antilien.type;
  } else {
    return 'supp';
  }
}

export { Antilien, addOrUpdateJid, updateActionInJid, verifstatutJid, recupActionJid };