const { menmacmd } = require("../lib/menmacmd");
const { atbAddOrUpdateJid,
  atbUpdateAction,
  atbVerifStatutJid } = require("../Database/antibot");
const { addOrUpdateJid,
  updateActionInJid,
  verifstatutJid } = require("../Database/antilien");



menmacmd({
  name: "antilien",
  classe: "groupe",
  react: "🤖"
}, async (ms_org, menma, com_options) => {

  const { verif_Gp, premium_id, verif_menmaAdmin, arg, repondre, prefixe } = com_options;
  try {
    const statut = await verifstatutJid(ms_org);

    if (!verif_Gp) {
      return repondre("*_commande réservée pour les groupes._*");
    }
    if (!premium_id) {
      return repondre("*_vous n'avez pas le droit d'utiliser cette commande_*");
    }

    if (!verif_menmaAdmin) {
      return repondre("*_veillez nommer le bot administrateur_*");
    }

    const shouldWrite = ["oui/kick", "oui/supp", "non", "oui"];
    const verifWrite = shouldWrite.includes(arg);

    const etattrue = await verifstatutJid(ms_org);

    if (!arg || arg === "") {
      return repondre(`╭───〔 🛡️ 𝗔𝗡𝗧𝗜𝗟𝗜𝗘𝗡 𝗨𝗦𝗔𝗚𝗘 〕───⬣\n`
        + `│ *Action* : ${prefixe}antilien <option>\n`
        + `╠══════════════════════════════⬣\n`
        + `│ 🔹 *oui* : Activer (suppression)\n`
        + `│ 🔹 *oui/kick* : Activer + Retirer\n`
        + `│ 🔹 *oui/supp* : Activer + Supprimer\n`
        + `│ 🔹 *non* : Désactiver\n`
        + `╰──────────────────────────────⬣`);
    }

    if (!verifWrite) {
      return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ Option invalide. Utilisez *oui*, *non*,\n│ *oui/kick* ou *oui/supp*.\n╰──────────────────────────────⬣");
    } else if (arg === "oui") {
      await addOrUpdateJid(ms_org, "oui");
      return repondre("*_antilien activé avec succès_*");
    } else if (arg === "non") {
      await addOrUpdateJid(ms_org, "non");
      return repondre("*_antilien désactivé avec succès_*");
    } else if (arg === "oui/kick" && etattrue) {
      await updateActionInJid(ms_org, "kick");
      return repondre("*_antilien actualisé sur kick avec succès_*");
    } else if (arg === "oui/supp" && etattrue) {
      await updateActionInJid(ms_org, "supp");
      return repondre("*_antilien actualisé sur supp avec succès_*");
    } else {
      return repondre(`*_voici l'utilisation de l'antilien ${prefixe}antilien  oui pour activer avec une action supp par defaut ${prefixe}antilien oui/kick pour actualiser sur retirer et antilien oui/supp pour actualiser sur supprimer Antilien non pour desactiver_*\n*_Options disponibles:\n${shouldWrite}*`);
    }
  } catch (e) {
    repondre(e);
  }
});


menmacmd({
  name: "antibot",
  classe: "groupe",
  react: "🤖"
}, async (ms_org, menma, com_options) => {

  const { verif_Gp, premium_id, verif_menmaAdmin, arg, repondre, prefixe } = com_options;
  try {
    const statut = await atbVerifStatutJid(ms_org);

    if (!verif_Gp) {
      return repondre("*_commande réservée pour les groupes._*");
    }

    if (!premium_id) {
      return repondre("*_vous n'avez pas le droit d'utiliser cette commande_*");
    }

    if (!verif_menmaAdmin) {
      return repondre("*_veillez nommer le bot administrateur_*");
    }

    const shouldWrite = ["oui/kick", "oui/supp", "non", "oui"];
    const verifWrite = shouldWrite.includes(arg);

    const etattrue = await atbVerifStatutJid(ms_org);

    if (!arg || arg === "") {
      return repondre(`╭───〔 🤖 𝗔𝗡𝗧𝗜𝗕𝗢𝗧 𝗨𝗦𝗔𝗚𝗘 〕───⬣\n`
        + `│ *Action* : ${prefixe}antibot <option>\n`
        + `╠══════════════════════════════⬣\n`
        + `│ 🔹 *oui* : Activer (suppression)\n`
        + `│ 🔹 *oui/kick* : Activer + Retirer\n`
        + `│ 🔹 *oui/supp* : Activer + Supprimer\n`
        + `│ 🔹 *non* : Désactiver\n`
        + `╰──────────────────────────────⬣`);
    }

    if (!verifWrite) {
      return repondre("╭───〔 ❌ 𝗘𝗥𝗥𝗘𝗨𝗥 〕───⬣\n│ Option invalide. Utilisez *oui*, *non*,\n│ *oui/kick* ou *oui/supp*.\n╰──────────────────────────────⬣");
    } else if (arg === "oui") {
      await atbAddOrUpdateJid(ms_org, "oui");
      return repondre("*_antibot activé avec succès_*");
    } else if (arg === "non") {
      await atbAddOrUpdateJid(ms_org, "non");
      return repondre("*_antibot désactivé avec succès_*");
    } else if (arg === "oui/kick" && etattrue) {
      await atbUpdateAction(ms_org, "kick");
      return repondre("*_antibot actualisé sur kick avec succès_*");
    } else if (arg === "oui/supp" && etattrue) {
      await atbUpdateAction(ms_org, "supp");
      return repondre("*_antibot actualisé sur supp avec succès_*");
    } else {
      return repondre(`*_voici l'utilisation de l'antibot: ${prefixe}antibot oui pour activer avec une action supp par defaut ${prefixe}antibot oui/kick pour actualiser sur retirer et antibot oui/supp pour actualiser sur supprimer Antibot non pour desactiver_*\n*_Options disponibles:\n${shouldWrite}*`);
    }
  } catch (e) {
    repondre(e);
  }
});
