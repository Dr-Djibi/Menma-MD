import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const BanDB = sequelize.define('BanDB', {
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
  reason: {
    type: DataTypes.STRING,
    defaultValue: 'Aucune raison spécifiée',
  },
  bannedBy: {
    type: DataTypes.STRING,
    defaultValue: 'Admin',
  },
}, {
  tableName: 'bans',
  timestamps: true,
});

const AntibanDB = sequelize.define('AntibanDB', {
  groupId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  mode: {
    type: DataTypes.STRING,
    defaultValue: 'non',
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'kick',
  },
}, {
  tableName: 'antiban_config',
  timestamps: false,
});

(async () => {
  await BanDB.sync();
  await AntibanDB.sync();
  console.log("Table 'BanDB' et 'AntibanDB' synchronisées avec succès.");
  markTableReady('BanDB');
})();

async function addBan(groupId, userId, reason = 'Aucune raison spécifiée', bannedBy = 'Admin') {
  const cleanUser = String(userId).replace(/\D/g, "");
  const id = `${groupId}_${cleanUser}`;
  const existing = await BanDB.findByPk(id);
  if (existing) {
    await existing.update({ reason, bannedBy });
    return existing;
  }
  return await BanDB.create({ id, groupId, userId: cleanUser, reason, bannedBy });
}

async function removeBan(groupId, userId) {
  const cleanUser = String(userId).replace(/\D/g, "");
  const id = `${groupId}_${cleanUser}`;
  const existing = await BanDB.findByPk(id);
  if (existing) {
    await existing.destroy();
    return true;
  }
  return false;
}

async function isBanned(groupId, userId) {
  const cleanUser = String(userId).replace(/\D/g, "");
  const id = `${groupId}_${cleanUser}`;
  const record = await BanDB.findByPk(id);
  return !!record;
}

async function getBanList(groupId) {
  const bans = await BanDB.findAll({ where: { groupId } });
  return bans.map(b => ({
    userId: b.userId,
    reason: b.reason,
    bannedBy: b.bannedBy,
    createdAt: b.createdAt,
  }));
}

async function clearBans(groupId) {
  await BanDB.destroy({ where: { groupId } });
  return true;
}

async function setAntibanStatus(groupId, mode) {
  const cleanMode = (mode === 'oui' || mode === 'on') ? 'oui' : 'non';
  const existing = await AntibanDB.findByPk(groupId);
  if (existing) {
    await existing.update({ mode: cleanMode });
  } else {
    await AntibanDB.create({ groupId, mode: cleanMode, type: 'kick' });
  }
  return cleanMode;
}

async function getAntibanStatus(groupId) {
  const record = await AntibanDB.findByPk(groupId);
  return record ? record.mode : 'non';
}

async function setAntibanAction(groupId, type) {
  const validAction = ['kick', 'supp', 'warn'].includes(type) ? type : 'kick';
  const existing = await AntibanDB.findByPk(groupId);
  if (existing) {
    await existing.update({ type: validAction, mode: 'oui' });
  } else {
    await AntibanDB.create({ groupId, mode: 'oui', type: validAction });
  }
  return validAction;
}

async function getAntibanAction(groupId) {
  const record = await AntibanDB.findByPk(groupId);
  return record ? record.type : 'kick';
}

export {
  BanDB,
  AntibanDB,
  addBan,
  removeBan,
  isBanned,
  getBanList,
  clearBans,
  setAntibanStatus,
  getAntibanStatus,
  setAntibanAction,
  getAntibanAction,
};
