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

const WarnConfigDB = sequelize.define('WarnConfig', {
  groupId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  maxWarns: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  }
}, {
  tableName: 'warn_config',
  timestamps: false,
});

(async () => {
  await WarnDB.sync();
  await WarnConfigDB.sync();
  console.log("Table 'Warns' et 'WarnConfig' synchronisées avec succès.");
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

async function getMaxWarns(groupId) {
  const config = await WarnConfigDB.findByPk(groupId);
  if (config && config.maxWarns) {
    return config.maxWarns;
  }
  return 3;
}

async function setMaxWarns(groupId, max) {
  const maxWarns = parseInt(max, 10);
  if (isNaN(maxWarns) || maxWarns < 1) return 3;
  let config = await WarnConfigDB.findByPk(groupId);
  if (config) {
    await config.update({ maxWarns });
  } else {
    await WarnConfigDB.create({ groupId, maxWarns });
  }
  return maxWarns;
}

export { WarnDB, WarnConfigDB, getWarnCount, addWarn, resetWarn, delWarn, getWarnsByGroup, getMaxWarns, setMaxWarns };
