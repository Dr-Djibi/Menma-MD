const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "",
  OWNER: process.env.NUMERO_OWNER || "224625968097",
  OWNER_LID: process.env.OWNER_LID || "209320012689544",
  STATUS: process.env.LECTURE_AUTO_STATUS || "non",
  PREFIX: process.env.PREFIX || "null",
  MODE: process.env.MODE || "prive",
  ZONE_DE_TEMPS: process.env.ZONE_DE_TEMPS || "Africa/Conakry",
  Db: process.env.Db || "",
};