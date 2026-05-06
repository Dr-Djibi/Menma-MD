import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Antimentiongc = sequelize.define('Antimentiongc', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true, // ID du groupe
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
  tableName: 'antimentiongc',
  timestamps: false,
});

(async () => {
  await Antimentiongc.sync({ alter: true });
  console.log("Table 'Antimentiongc' synchronisée avec succès.");
})();

async function amgcAddOrUpdateJid(id, mode) {
  let amgc = await Antimentiongc.findByPk(id);
  if (amgc) {
    return await amgc.update({ mode });
  } else {
    return await Antimentiongc.create({ id, mode });
  }
}

async function amgcUpdateAction(id, type) {
  let amgc = await Antimentiongc.findByPk(id);
  if (amgc) {
    return await amgc.update({ type });
  } else {
    return await Antimentiongc.create({ id, type });
  }
}

async function amgcVerifStatutJid(id) {
  let amgc = await Antimentiongc.findByPk(id);
  if (amgc) {
    return amgc.mode;
  } else {
    return 'non';
  }
}

async function amgcRecupActionJid(id) {
  let amgc = await Antimentiongc.findByPk(id);
  if (amgc) {
    return amgc.type;
  } else {
    return 'supp';
  }
}

async function getAllActiveAmgcGroups() {
  const activeGroups = await Antimentiongc.findAll({
    where: { mode: 'oui' }
  });
  return activeGroups;
}

export { Antimentiongc, amgcAddOrUpdateJid, amgcUpdateAction, amgcVerifStatutJid, amgcRecupActionJid, getAllActiveAmgcGroups };
