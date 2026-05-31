import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { markTableReady } from './ready.js';

// Table to store commands that are allowed in private mode
const PublicCmd = sequelize.define('PublicCmd', {
  cmdName: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
}, {
  tableName: 'public_cmd',
  timestamps: false,
});

(async () => {
  await PublicCmd.sync({ alter: true });
  console.log("Table 'PublicCmd' synchronisée avec succès.");
  markTableReady('PublicCmd');
})();

/** Add a command to the public list */
async function addPublicCmd(name) {
  return await PublicCmd.upsert({ cmdName: name.toLowerCase() });
}
/** Remove a command from the public list */
async function delPublicCmd(name) {
  return await PublicCmd.destroy({ where: { cmdName: name.toLowerCase() } });
}
/** Get all public commands */
async function getAllPublicCmds() {
  return await PublicCmd.findAll();
}
/** Check if a command is public */
async function isPublicCommand(name) {
  const rec = await PublicCmd.findOne({ where: { cmdName: name.toLowerCase() } });
  return !!rec;
}

export { PublicCmd, addPublicCmd, delPublicCmd, getAllPublicCmds, isPublicCommand };
