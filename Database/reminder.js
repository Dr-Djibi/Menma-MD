import { DataTypes, Op } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const Reminder = sequelize.define('Reminder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  targetTime: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // 'pending' | 'completed' | 'cancelled'
  },
}, {
  tableName: 'reminders',
  timestamps: true,
});

(async () => {
  try {
    await Reminder.sync();
    console.log("Table 'Reminder' synchronisée avec succès.");
  } catch (e) {
    try {
      await Reminder.sync({ force: false });
      console.log("Table 'Reminder' synchronisée (mode simple).");
    } catch (e2) {
      console.log("[REMINDER DB] Erreur sync :", e2.message);
    }
  }
  markTableReady('Reminder');
})();

/**
 * Crée un nouveau rappel
 */
async function createReminder({ userId, chatId, message, targetTime }) {
  try {
    const reminder = await Reminder.create({
      userId,
      chatId,
      message,
      targetTime: Number(targetTime),
      status: 'pending',
    });
    return reminder;
  } catch (e) {
    console.error("[REMINDER CREATE ERR]", e.message);
    throw e;
  }
}

/**
 * Récupère les rappels actifs pour un utilisateur dans un chat (ou globalement)
 */
async function getUserReminders(userId, chatId = null) {
  try {
    const where = {
      userId,
      status: 'pending',
    };
    if (chatId) {
      where.chatId = chatId;
    }
    const reminders = await Reminder.findAll({
      where,
      order: [['targetTime', 'ASC']],
    });
    return reminders;
  } catch (e) {
    console.error("[REMINDER GET USER ERR]", e.message);
    return [];
  }
}

/**
 * Supprime ou annule un rappel par son identifiant
 */
async function deleteReminder(id, userId = null) {
  try {
    const where = { id };
    if (userId) {
      where.userId = userId;
    }
    const deleted = await Reminder.destroy({ where });
    return deleted > 0;
  } catch (e) {
    console.error("[REMINDER DEL ERR]", e.message);
    return false;
  }
}

/**
 * Récupère les rappels arrivés à échéance
 */
async function getDueReminders(nowMs = Date.now()) {
  try {
    const due = await Reminder.findAll({
      where: {
        status: 'pending',
        targetTime: {
          [Op.lte]: nowMs,
        },
      },
      order: [['targetTime', 'ASC']],
    });
    return due;
  } catch (e) {
    console.error("[REMINDER GET DUE ERR]", e.message);
    return [];
  }
}

/**
 * Marque un rappel comme terminé
 */
async function markReminderCompleted(id) {
  try {
    const [updated] = await Reminder.update(
      { status: 'completed' },
      { where: { id } }
    );
    return updated > 0;
  } catch (e) {
    console.error("[REMINDER COMPLETE ERR]", e.message);
    return false;
  }
}

/**
 * Parcourt les rappels échus et les envoie via WhatsApp
 */
async function checkAndTriggerReminders(menma) {
  if (!menma) return 0;
  try {
    const dueList = await getDueReminders();
    if (!dueList || dueList.length === 0) return 0;

    let triggeredCount = 0;
    for (const item of dueList) {
      try {
        const userJid = item.userId.includes('@') ? item.userId : `${item.userId}@s.whatsapp.net`;
        const userMention = `@${userJid.split('@')[0]}`;
        const reminderText = `⏰ *RAPPEL MENMA-BOT* ⏰\n\n${userMention}, tu avais demandé de te rappeler :\n👉 *${item.message}*`;

        await menma.sendMessage(item.chatId, {
          text: reminderText,
          mentions: [userJid],
        });

        await markReminderCompleted(item.id);
        triggeredCount++;
      } catch (err) {
        console.error(`[REMINDER TRIGGER ERR ID:${item.id}]`, err.message);
      }
    }
    return triggeredCount;
  } catch (e) {
    console.error("[CHECK REMINDERS ERR]", e.message);
    return 0;
  }
}

let reminderRunnerInterval = null;

function startReminderRunner(menma, intervalMs = 15000) {
  if (reminderRunnerInterval) clearInterval(reminderRunnerInterval);
  reminderRunnerInterval = setInterval(() => {
    checkAndTriggerReminders(menma).catch(() => {});
  }, intervalMs);
  if (typeof reminderRunnerInterval.unref === 'function') {
    reminderRunnerInterval.unref();
  }
  return reminderRunnerInterval;
}

function stopReminderRunner() {
  if (reminderRunnerInterval) {
    clearInterval(reminderRunnerInterval);
    reminderRunnerInterval = null;
  }
}

export {
  Reminder,
  createReminder,
  getUserReminders,
  deleteReminder,
  getDueReminders,
  markReminderCompleted,
  checkAndTriggerReminders,
  startReminderRunner,
  stopReminderRunner,
};
