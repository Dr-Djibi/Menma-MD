const { menmacmd } = require("../lib/menmacmd");

menmacmd({
    nomCom: "bonjour",       // Le nom de la commande (ex: !bonjour)
    classe: "utiles",        // La catégorie (menu)
    react: "👋",             // L'emoji de réaction
    desc: "Dit bonjour"      // Description de la commande
}, async (ms_org, menma, com_options) => {

    const { pseudo, repondre } = com_options;

    // Votre logique ici
    await repondre(`Salut ${pseudo} ! Comment vas-tu ?`);

});
