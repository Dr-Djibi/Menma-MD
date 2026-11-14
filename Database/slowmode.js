import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const Slowmode = sequelize.define('Slowmode', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  delay: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  type: {
    type: DataTypes.ENUM('supp', 'kick', 'warn'),
    defaultValue: 'supp',
  },
}, {
  tableName: 'slowmode',
  timestamps: false,
});

(async () => {
  await Slowmode.sync();
  markTableReady('Slowmode');
})();

async function smAddOrUpdateJid(id, delay) {
  const numericDelay = parseInt(delay, 10) || 0;
  let record = await Slowmode.findByPk(id);
  if (record) {
    return await record.update({ delay: Math.max(0, numericDelay) });
  } else {
    return await Slowmode.create({ id, delay: Math.max(0, numericDelay) });
  }
}

async function smUpdateAction(id, type) {
  let record = await Slowmode.findByPk(id);
  if (record) {
    return await record.update({ type });
  } else {
    return await Slowmode.create({ id, delay: 0, type });
  }
}

async function smVerifStatutJid(id) {
  let record = await Slowmode.findByPk(id);
  if (record && record.delay > 0) {
    return 'oui';
  } else {
    return 'non';
  }
}

async function smRecupActionJid(id) {
  let record = await Slowmode.findByPk(id);
  if (record) {
    return record.type;
  } else {
    return 'supp';
  }
}

async function smGetDelay(id) {
  let record = await Slowmode.findByPk(id);
  if (record) {
    return record.delay || 0;
  } else {
    return 0;
  }
}

export {
  Slowmode,
  smAddOrUpdateJid,
  smUpdateAction,
  smVerifStatutJid,
  smRecupActionJid,
  smGetDelay,
};
