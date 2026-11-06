import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const Antichain = sequelize.define('Antichain', {
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
  tableName: 'antichain',
  timestamps: false,
});

(async () => {
  await Antichain.sync();
  console.log("Table 'Antichain' synchronisée avec succès.");
  markTableReady('Antichain');
})();

async function addOrUpdateAntichainJid(id, mode) {
  let antichain = await Antichain.findByPk(id);
  if (antichain) {
    return await antichain.update({ mode });
  } else {
    return await Antichain.create({ id, mode });
  }
}

async function updateAntichainActionInJid(id, type) {
  let antichain = await Antichain.findByPk(id);
  if (antichain) {
    return await antichain.update({ type });
  } else {
    return await Antichain.create({ id, type });
  }
}

async function verifAntichainStatutJid(id) {
  let antichain = await Antichain.findByPk(id);
  if (antichain) {
    return antichain.mode;
  } else {
    return 'non';
  }
}

async function recupAntichainActionJid(id) {
  let antichain = await Antichain.findByPk(id);
  if (antichain) {
    return antichain.type;
  } else {
    return 'supp';
  }
}

export { Antichain, addOrUpdateAntichainJid, updateAntichainActionInJid, verifAntichainStatutJid, recupAntichainActionJid };
