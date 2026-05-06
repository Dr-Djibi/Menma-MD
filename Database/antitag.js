import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Antitag = sequelize.define('Antitag', {
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
  tableName: 'antitag',
  timestamps: false,
});

(async () => {
  await Antitag.sync({ alter: true });
  console.log("Table 'Antitag' synchronisée avec succès.");
})();

async function atgAddOrUpdateJid(id, mode) {
  let antitag = await Antitag.findByPk(id);
  if (antitag) {
    return await antitag.update({ mode });
  } else {
    return await Antitag.create({ id, mode });
  }
}

async function atgUpdateAction(id, type) {
  let antitag = await Antitag.findByPk(id);
  if (antitag) {
    return await antitag.update({ type });
  } else {
    return await Antitag.create({ id, type });
  }
}

async function atgVerifStatutJid(id) {
  let antitag = await Antitag.findByPk(id);
  if (antitag) {
    return antitag.mode;
  } else {
    return 'non';
  }
}

async function atgRecupActionJid(id) {
  let antitag = await Antitag.findByPk(id);
  if (antitag) {
    return antitag.type;
  } else {
    return 'supp';
  }
}

export { Antitag, atgAddOrUpdateJid, atgUpdateAction, atgVerifStatutJid, atgRecupActionJid };
