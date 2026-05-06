import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Sudo = sequelize.define('Sudo', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
}, {
  tableName: 'Sudo',
  timestamps: false,
});

(async () => {
  await Sudo.sync();
  console.log("Table 'Sudo' synchronisée avec succès.");

})();

async function addSudoNumber(id) {
  let [sudo] = await Sudo.findOrCreate({ where: { id } });
  return sudo;
}

async function delSudoNumber(id) {
  return await Sudo.destroy({ where: { id } });
}

async function getAllSudoNumbers() {
  let sudos = await Sudo.findAll();
  return sudos.map(s => s.id);
}

export { Sudo, addSudoNumber, delSudoNumber, getAllSudoNumbers };