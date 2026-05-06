import dotenv from 'dotenv';
dotenv.config();

export default {
  SESSION_ID: process.env.SESSION_ID || "",
  OWNER: process.env.NUMERO_OWNER || "224625968097",
  NOM_OWNER: process.env.NOM_OWNER || "Dr Djibi",
  OWNER_LID: process.env.OWNER_LID || "209320012689544",
  STATUS: process.env.LECTURE_AUTO_STATUS || "non",
  PREFIX: process.env.PREFIX || "null",
  MODE: process.env.MODE || "private",
  ZONE_DE_TEMPS: process.env.ZONE_DE_TEMPS || "Africa/Conakry",
  DATABASE_URL: process.env.DATABASE_URL || "",
  STICKER_PACKNAME: process.env.STICKER_PACKNAME || "Menma-MD",
  STICKER_AUTHOR: process.env.STICKER_AUTHOR || "Dr-Djibi",
  NOM_BOT: process.env.NOM_BOT || "𝙼𝙴𝙽𝙼𝙰-𝙼𝙳",
  AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || "non",
  LIKE_STATUS_EMOJIS: process.env.LIKE_STATUS_EMOJIS || "💚",
  DEV: process.env.DEV || "𝗗𝗿 𝗗𝗷𝗶𝗯𝗶",
  NUMERO_DEV: ["224625968097", "224612414116"],
  NUMERO_DEV_LID: ["209320012689544", "101387769745448"],
  CHATBOT_SERVER_URL: "https://fluttering-chloe-sakoubabot-71963f98.koyeb.app",
  VERSION: "1.4.1",
  CHATBOT_PROMPT: process.env.CHATBOT_PROMPT || `(Tu es le clone numérique de ${process.env.NOM_OWNER}. 
    - Style : Humain, décontracté, très bref (max 1-2 phrases), sympa et cool, tu peux utiliser des emoji mais pas trop. 
    - Interdiction : Ne sois pas mécanique, ne répète pas les mêmes formules, n'accepte pas des proposition sentimentale, ni des invitation a des rencontre. 
    - Identité : Tu es créez par ${process.env.DEV} createur du bot MENMA-MD mais ne le dit que si la personne se rend compte que t'es un chatbot.
    Réponds de manière naturelle comme dans une discussion WhatsApp rapide.)`,
};