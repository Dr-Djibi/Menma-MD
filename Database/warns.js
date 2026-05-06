import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const WarnDB = sequelize.define('Warns', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true, // ex: groupId_userId
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'warns',
  timestamps: false,
});

(async () => {
  await WarnDB.sync({ alter: true });
  console.log("Table 'Warns' synchronisée avec succès.");
})();

async function getWarnCount(groupId, userId) {
  const id = `${groupId}_${userId}`;
  let warn = await WarnDB.findByPk(id);
  if (warn) {
    return warn.count;
  }
  return 0;
}

async function addWarn(groupId, userId) {
  const id = `${groupId}_${userId}`;
  let warn = await WarnDB.findByPk(id);
  if (warn) {
    let newCount = warn.count + 1;
    await warn.update({ count: newCount });
    return newCount;
  } else {
    await WarnDB.create({ id, groupId, userId, count: 1 });
    return 1;
  }
}

async function resetWarn(groupId, userId) {
  const id = `${groupId}_${userId}`;
  let warn = await WarnDB.findByPk(id);
  if (warn) {
    await warn.update({ count: 0 });
  }
  return 0;
}

export { WarnDB, getWarnCount, addWarn, resetWarn };
