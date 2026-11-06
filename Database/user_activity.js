import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const UserActivityDB = sequelize.define('UserActivity', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true, // groupId_userId
  },
  groupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  messageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastSeen: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  }
}, {
  tableName: 'user_activity',
  timestamps: false,
});

(async () => {
  await UserActivityDB.sync();
  console.log("Table 'UserActivity' synchronisée avec succès.");
  markTableReady('UserActivity');
})();

async function recordUserActivity(groupId, userId) {
  if (!groupId || !userId) return;
  const cleanUser = String(userId).replace(/\D/g, "");
  if (!cleanUser) return;

  const id = `${groupId}_${cleanUser}`;
  const now = Date.now();

  try {
    const record = await UserActivityDB.findByPk(id);
    if (record) {
      await record.update({
        messageCount: record.messageCount + 1,
        lastSeen: now
      });
    } else {
      await UserActivityDB.create({
        id,
        groupId,
        userId: cleanUser,
        messageCount: 1,
        lastSeen: now
      });
    }
  } catch (err) {
    console.error('[USER ACTIVITY RECORD ERR]', err.message);
  }
}

async function getUserActivity(groupId, userId) {
  if (!groupId || !userId) return { messageCount: 0, lastSeen: 0 };
  const cleanUser = String(userId).replace(/\D/g, "");
  const id = `${groupId}_${cleanUser}`;

  try {
    const record = await UserActivityDB.findByPk(id);
    if (record) {
      return { messageCount: record.messageCount, lastSeen: record.lastSeen };
    }
  } catch (err) {
    console.error('[USER ACTIVITY GET ERR]', err.message);
  }
  return { messageCount: 0, lastSeen: 0 };
}

async function getGroupActivity(groupId) {
  if (!groupId) return new Map();

  try {
    const records = await UserActivityDB.findAll({ where: { groupId } });
    const activityMap = new Map();
    records.forEach(r => {
      activityMap.set(r.userId, { messageCount: r.messageCount, lastSeen: r.lastSeen });
    });
    return activityMap;
  } catch (err) {
    console.error('[GROUP ACTIVITY GET ERR]', err.message);
    return new Map();
  }
}

export { UserActivityDB, recordUserActivity, getUserActivity, getGroupActivity };
