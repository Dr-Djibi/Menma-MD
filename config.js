const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  SESSION_ID: process.env.SESSION_ID || "MenMa-MD~QEqePnKX",
  OWNER: process.env.NUMERO_OWNER || "237620066719",
  STATUS: process.env.LECTURE_AUTO_STATUS || "oui",
  PREFIX: process.env.PREFIX || "null",
  MODE: process.env.MODE || "prive",
  ZONE_DE_TEMPS: process.env.ZONE_DE_TEMPS || "Africa/Lagos",
  Db: process.env.Db || "postgresql://postgre.qnjvgxwyncnsbpfxwrbq:ovlmdmdpasse@aws-0-eu-central-1.pooler.supabase.com:6543 /postgres",
};