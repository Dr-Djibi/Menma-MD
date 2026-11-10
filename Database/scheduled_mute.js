import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';
import { sendLogMessage } from './logchannel.js';

const ScheduledMute = sequelize.define('ScheduledMute', {
  groupId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'non', // 'oui' | 'non'
  },
  muteTime: {
    type: DataTypes.STRING,
    defaultValue: '22:00', // HH:mm format
  },
  unmuteTime: {
    type: DataTypes.STRING,
    defaultValue: '07:00', // HH:mm format
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC',
  },
  lastAction: {
    type: DataTypes.STRING,
    defaultValue: 'none', // 'mute' | 'unmute' | 'none'
  },
}, {
  tableName: 'scheduled_mutes',
  timestamps: false,
});

(async () => {
  try {
    await ScheduledMute.sync();
    console.log("Table 'ScheduledMute' synchronisée avec succès.");
  } catch (e) {
    try {
      await ScheduledMute.sync({ force: false });
      console.log("Table 'ScheduledMute' synchronisée (mode simple).");
    } catch (e2) {
      console.log("[SCHEDULED MUTE DB] Erreur sync :", e2.message);
    }
  }
  markTableReady('ScheduledMute');
})();

async function setScheduledMute(groupId, configData = {}) {
  try {
    const { status = 'oui', muteTime = '22:00', unmuteTime = '07:00', timezone = 'UTC' } = configData;
    let record = await ScheduledMute.findByPk(groupId);
    if (record) {
      await record.update({ status, muteTime, unmuteTime, timezone });
      return record;
    } else {
      return await ScheduledMute.create({ groupId, status, muteTime, unmuteTime, timezone, lastAction: 'none' });
    }
  } catch (e) {
    console.error("[SCHEDULED MUTE SET ERR]", e.message);
    throw e;
  }
}

async function getScheduledMute(groupId) {
  try {
    let record = await ScheduledMute.findByPk(groupId);
    if (!record) return null;
    return {
      groupId: record.groupId,
      status: record.status || 'non',
      muteTime: record.muteTime || '22:00',
      unmuteTime: record.unmuteTime || '07:00',
      timezone: record.timezone || 'UTC',
      lastAction: record.lastAction || 'none',
    };
  } catch (e) {
    console.error("[SCHEDULED MUTE GET ERR]", e.message);
    return null;
  }
}

async function deleteScheduledMute(groupId) {
  try {
    let record = await ScheduledMute.findByPk(groupId);
    if (record) {
      await record.destroy();
      return true;
    }
    return false;
  } catch (e) {
    console.error("[SCHEDULED MUTE DEL ERR]", e.message);
    return false;
  }
}

async function getAllScheduledMutes() {
  try {
    const records = await ScheduledMute.findAll({ where: { status: 'oui' } });
    return records.map(r => ({
      groupId: r.groupId,
      status: r.status,
      muteTime: r.muteTime,
      unmuteTime: r.unmuteTime,
      timezone: r.timezone,
      lastAction: r.lastAction,
    }));
  } catch (e) {
    console.error("[SCHEDULED MUTE GET ALL ERR]", e.message);
    return [];
  }
}

/**
 * Parcourt les groupes ayant le scheduled mute activé et applique les fermetures/ouvertures si l'heure correspond.
 * @param {Object} menma - Instance Baileys sock
 */
async function checkAndApplyScheduledMutes(menma) {
  try {
    if (!menma) return;
    const activeSchedules = await getAllScheduledMutes();
    if (activeSchedules.length === 0) return;

    const now = new Date();
    const currentHH = String(now.getUTCHours()).padStart(2, '0');
    const currentMM = String(now.getUTCMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHH}:${currentMM}`;

    for (const item of activeSchedules) {
      const { groupId, muteTime, unmuteTime, lastAction } = item;

      // Fermeture automatique du groupe
      if (currentTimeStr === muteTime && lastAction !== 'mute') {
        try {
          await menma.groupSettingUpdate(groupId, "announcement");
          await ScheduledMute.update({ lastAction: 'mute' }, { where: { groupId } });

          const autoMsg = `🔒 *Fermeture programmée du groupe (${muteTime} UTC) ! Seuls les administrateurs peuvent désormais envoyer des messages.*`;
          await menma.sendMessage(groupId, { text: autoMsg });
          await sendLogMessage(menma, groupId, 'group_update', `🔒 *Fermeture automatique programmée* (${muteTime} UTC) effectuée.`);
        } catch (err) {
          console.error(`[SCHEDULED MUTE APPLY MUTE ERR ${groupId}]`, err.message);
        }
      }

      // Ouverture automatique du groupe
      if (currentTimeStr === unmuteTime && lastAction !== 'unmute') {
        try {
          await menma.groupSettingUpdate(groupId, "not_announcement");
          await ScheduledMute.update({ lastAction: 'unmute' }, { where: { groupId } });

          const autoMsg = `🔓 *Ouverture programmée du groupe (${unmuteTime} UTC) ! Tout le monde peut à nouveau écrire.*`;
          await menma.sendMessage(groupId, { text: autoMsg });
          await sendLogMessage(menma, groupId, 'group_update', `🔓 *Ouverture automatique programmée* (${unmuteTime} UTC) effectuée.`);
        } catch (err) {
          console.error(`[SCHEDULED MUTE APPLY UNMUTE ERR ${groupId}]`, err.message);
        }
      }
    }
  } catch (e) {
    console.error("[CHECK SCHEDULED MUTES ERR]", e.message);
  }
}

let runnerInterval = null;

function startScheduledMuteRunner(menma, intervalMs = 30000) {
  if (runnerInterval) clearInterval(runnerInterval);
  runnerInterval = setInterval(() => {
    checkAndApplyScheduledMutes(menma).catch(() => {});
  }, intervalMs);
  return runnerInterval;
}

function stopScheduledMuteRunner() {
  if (runnerInterval) {
    clearInterval(runnerInterval);
    runnerInterval = null;
  }
}

export {
  ScheduledMute,
  setScheduledMute,
  getScheduledMute,
  deleteScheduledMute,
  getAllScheduledMutes,
  checkAndApplyScheduledMutes,
  startScheduledMuteRunner,
  stopScheduledMuteRunner,
};
