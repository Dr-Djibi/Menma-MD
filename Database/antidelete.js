import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';
import { markTableReady } from './ready.js';

const AntiDelete = sequelize.define('AntiDelete', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'non', // 'non', 'pm', 'gc', 'all'
  }
}, {
  tableName: 'antidelete',
  timestamps: false,
});

(async () => {
  await AntiDelete.sync();
  console.log("Table 'AntiDelete' synchronisée avec succès.");
  markTableReady('AntiDelete');
})();

async function getAntiDeleteStatus(jid = 'global') {
  let ad = await AntiDelete.findByPk(jid);
  if (ad) return ad.status;
  return jid === 'global' ? 'non' : null;
}

async function setAntiDeleteStatus(status, jid = 'global') {
  let ad = await AntiDelete.findByPk(jid);
  if (ad) {
    return await ad.update({ status });
  } else {
    return await AntiDelete.create({ id: jid, status });
  }
}

export { AntiDelete, getAntiDeleteStatus, setAntiDeleteStatus };
