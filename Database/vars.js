import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

const Vars = sequelize.define('Vars', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'vars',
  timestamps: false,
});

(async () => {
  await Vars.sync();
  console.log("Table 'Vars' synchronisée avec succès.");
  markTableReady('Vars');
})();

let varsCache = null;

async function getAllVars() {
  if (varsCache) return varsCache;
  const vars = await Vars.findAll();
  varsCache = {};
  vars.forEach(v => {
    varsCache[v.key] = v.value;
  });
  return varsCache;
}

async function setVar(key, value) {
  const [variable, created] = await Vars.findOrCreate({
    where: { key },
    defaults: { value }
  });
  if (!created) {
    await variable.update({ value });
  }
  if (varsCache) varsCache[key] = value;
  else await getAllVars();
  return variable;
}

async function getVar(key) {
  const vars = await getAllVars();
  return vars[key];
}

async function delVar(key) {
  const result = await Vars.destroy({ where: { key } });
  if (varsCache) delete varsCache[key];
  return result;
}

export { Vars, setVar, getVar, delVar, getAllVars };
