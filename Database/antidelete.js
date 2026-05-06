import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import config from '../config.js';

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
  await AntiDelete.sync({ alter: true });
  console.log("Table 'AntiDelete' synchronisée avec succès.");
})();

async function getAntiDeleteStatus() {
  let ad = await AntiDelete.findByPk('global');
  return ad ? ad.status : 'non';
}

async function setAntiDeleteStatus(status) {
  let ad = await AntiDelete.findByPk('global');
  if (ad) {
    return await ad.update({ status });
  } else {
    return await AntiDelete.create({ id: 'global', status });
  }
}

export { AntiDelete, getAntiDeleteStatus, setAntiDeleteStatus };
