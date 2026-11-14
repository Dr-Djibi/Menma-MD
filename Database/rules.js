import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const GroupRules = sequelize.define('GroupRules', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  rules: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'group_rules',
  timestamps: false,
});

(async () => {
  await GroupRules.sync();
  console.log("Table 'GroupRules' synchronisée avec succès.");
  markTableReady('GroupRules');
})();

async function getGroupRules(id) {
  let record = await GroupRules.findByPk(id);
  return record ? record.rules : null;
}

async function setGroupRules(id, rulesText) {
  let record = await GroupRules.findByPk(id);
  if (record) {
    await record.update({ rules: rulesText });
    return record;
  } else {
    return await GroupRules.create({ id, rules: rulesText });
  }
}

async function delGroupRules(id) {
  let record = await GroupRules.findByPk(id);
  if (record) {
    await record.destroy();
    return true;
  }
  return false;
}

export { GroupRules, getGroupRules, setGroupRules, delGroupRules };
