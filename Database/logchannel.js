import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';
import STYLE from '../lib/styleHelper.js';

const LogChannel = sequelize.define('LogChannel', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  logJid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'oui',
  },
  events: {
    type: DataTypes.TEXT,
    defaultValue: '["all"]',
  },
}, {
  tableName: 'log_channels',
  timestamps: false,
});

(async () => {
  try {
    await LogChannel.sync();
    console.log("Table 'LogChannel' synchronisée avec succès.");
  } catch (e) {
    try {
      await LogChannel.sync({ force: false });
      console.log("Table 'LogChannel' synchronisée (mode simple).");
    } catch (e2) {
      console.log("[LOGCHANNEL DB] Erreur sync :", e2.message);
    }
  }
  markTableReady('LogChannel');
})();

async function getLogChannel(groupJid) {
  try {
    let record = await LogChannel.findByPk(groupJid);
    if (!record) return null;
    let parsedEvents = ['all'];
    try {
      if (record.events) parsedEvents = JSON.parse(record.events);
    } catch (e) {
      if (typeof record.events === 'string') {
        parsedEvents = record.events.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return {
      id: record.id,
      logJid: record.logJid,
      status: record.status || 'oui',
      events: parsedEvents,
    };
  } catch (e) {
    console.error("[LOGCHANNEL DB GET ERR]", e.message);
    return null;
  }
}

async function setLogChannel(groupJid, logJid, status = 'oui', events = ['all']) {
  try {
    const eventsStr = JSON.stringify(Array.isArray(events) ? events : [events]);
    let record = await LogChannel.findByPk(groupJid);
    if (record) {
      await record.update({ logJid, status, events: eventsStr });
      return record;
    } else {
      return await LogChannel.create({ id: groupJid, logJid, status, events: eventsStr });
    }
  } catch (e) {
    console.error("[LOGCHANNEL DB SET ERR]", e.message);
    throw e;
  }
}

async function deleteLogChannel(groupJid) {
  try {
    let record = await LogChannel.findByPk(groupJid);
    if (record) {
      await record.destroy();
      return true;
    }
    return false;
  } catch (e) {
    console.error("[LOGCHANNEL DB DEL ERR]", e.message);
    return false;
  }
}

/**
 * Transmet un message de log à la destination configurée si le canal de logs est actif.
 * @param {Object} menma - Instance Baileys sock
 * @param {string} groupJid - JID du groupe où l'événement a eu lieu
 * @param {string} eventType - Type de l'événement (ex: 'warn', 'kick', 'automod', 'group_update', 'join_leave')
 * @param {string} messageText - Description de l'événement
 * @param {Object} [options] - Paramètres optionnels ({ mentions, groupName })
 */
async function sendLogMessage(menma, groupJid, eventType, messageText, options = {}) {
  try {
    if (!menma || !groupJid) return false;
    const config = await getLogChannel(groupJid);
    if (!config || config.status !== 'oui' || !config.logJid) return false;

    // Vérifier si ce type d'événement est activé
    const events = config.events || ['all'];
    const isAllowed = events.includes('all') || events.includes(eventType);
    if (!isAllowed) return false;

    const timeStr = new Date().toLocaleTimeString('fr-FR', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const groupNameStr = options.groupName ? ` [${options.groupName}]` : '';

    let formattedLog = STYLE.TOP(`📜 AUDIT LOG${groupNameStr}`) + `\n`;
    formattedLog += STYLE.LINE(`⏰ *Heure* : ${timeStr} UTC\n`);
    formattedLog += STYLE.LINE(`📌 *Type* : ${eventType.toUpperCase()}\n`) + STYLE.INTER() + `\n`;
    formattedLog += STYLE.LINE(`${messageText}\n`);
    formattedLog += STYLE.BTM;

    const mentions = options.mentions || [];
    await menma.sendMessage(config.logJid, { text: formattedLog, mentions });
    return true;
  } catch (e) {
    console.error("[SEND LOG MESSAGE ERR]", e.message);
    return false;
  }
}

export { LogChannel, getLogChannel, setLogChannel, deleteLogChannel, sendLogMessage };
