import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Antispam = sequelize.define('Antispam', {
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
  tableName: 'antispam',
  timestamps: false,
});

(async () => {
  await Antispam.sync({ alter: true });
})();

async function aspAddOrUpdateJid(id, mode) {
  let antispam = await Antispam.findByPk(id);
  if (antispam) {
    return await antispam.update({ mode });
  } else {
    return await Antispam.create({ id, mode });
  }
}

async function aspUpdateAction(id, type) {
  let antispam = await Antispam.findByPk(id);
  if (antispam) {
    return await antispam.update({ type });
  } else {
    return await Antispam.create({ id, type });
  }
}

async function aspVerifStatutJid(id) {
  let antispam = await Antispam.findByPk(id);
  if (antispam) {
    return antispam.mode;
  } else {
    return 'non';
  }
}

async function aspRecupActionJid(id) {
  let antispam = await Antispam.findByPk(id);
  if (antispam) {
    return antispam.type;
  } else {
    return 'supp';
  }
}

export { Antispam, aspAddOrUpdateJid, aspUpdateAction, aspVerifStatutJid, aspRecupActionJid };
