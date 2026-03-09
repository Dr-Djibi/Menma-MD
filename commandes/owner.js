const { addOrUpdatePresence,
    presenceUpdateActionJid } = require("../Database/presence");
const { addSudoNumber, delSudoNumber, getAllSudoNumbers } = require("../Database/sudo");
const { menmacmd } = require("../lib/menmacmd");