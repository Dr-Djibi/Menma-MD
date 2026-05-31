import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const ChatSettings = sequelize.define('ChatSettings', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  autosticker: {
    type: DataTypes.STRING,
    defaultValue: 'non', // 'oui' or 'non'
  },
  autodownload: {
    type: DataTypes.STRING,
    defaultValue: 'non', // 'oui' or 'non'
  }
}, {
  tableName: 'chat_settings',
  timestamps: false,
});

(async () => {
  await ChatSettings.sync({ alter: true });
  console.log("Table 'ChatSettings' synchronisée avec succès.");
  markTableReady('ChatSettings');
})();

async function getChatSetting(id, key) {
  let setting = await ChatSettings.findByPk(id);
  if (setting) {
    return setting[key] || 'non';
  }
  return 'non';
}

async function updateChatSetting(id, key, value) {
  let setting = await ChatSettings.findByPk(id);
  if (setting) {
    return await setting.update({ [key]: value });
  } else {
    return await ChatSettings.create({ id, [key]: value });
  }
}

export { ChatSettings, getChatSetting, updateChatSetting };
