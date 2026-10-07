import { DataTypes, Op } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

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
  await WarnDB.sync();
  console.log("Table 'Warns' synchronisée avec succès.");
  markTableReady('WarnDB');
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

async function delWarn(groupId, userId) {
  const id = `${groupId}_${userId}`;
  let warn = await WarnDB.findByPk(id);
  if (warn && warn.count > 0) {
    let newCount = warn.count - 1;
    await warn.update({ count: newCount });
    return newCount;
  }
  return 0;
}

async function getWarnsByGroup(groupId) {
  const warns = await WarnDB.findAll({
    where: {
      groupId,
      count: { [Op.gt]: 0 }
    }
  });
  return warns.map(w => ({ userId: w.userId, count: w.count }));
}

export { WarnDB, getWarnCount, addWarn, resetWarn, delWarn, getWarnsByGroup };
