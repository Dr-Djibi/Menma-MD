import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

const Presence = sequelize.define('Presence', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('ecrit', 'enligne', 'enregistre', 'non'),
    defaultValue: 'non',
  },
}, {
  tableName: 'Presence',
  timestamps: false,
});

(async () => {
  await Presence.sync();
  console.log("Table 'Presence' synchronisée avec succès.");

})();

async function addOrUpdatePresence(id, type) {
  let presence = await Presence.findByPk(id);
  if (presence) {
    return await presence.update({ type });
  } else {
    return await Presence.create({ id, type });
  }
}

async function presenceUpdateActionJid(id, type) {
  return await addOrUpdatePresence(id, type);
}

async function preseceRecupAction(id) {
  let presence = await Presence.findByPk(id);
  if (presence) {
    return presence.type;
  } else {
    return 'non';
  }
}

export { Presence, addOrUpdatePresence, presenceUpdateActionJid, preseceRecupAction };