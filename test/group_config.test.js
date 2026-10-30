import test from "node:test";
import assert from "node:assert/strict";

import { exportGroupConfig, importGroupConfig, auditGroupSecurity } from "../lib/groupConfigHelper.js";
import { GroupEvents } from "../Database/group_events.js";
import { GroupRules } from "../Database/rules.js";
import "../commandes/groupe.js";
import { commands } from "../lib/menmacmd.js";

test("groupConfigHelper export, import, and audit logic work correctly", async () => {
    // Wait for asynchronous table initialisation IIFE to settle
    await new Promise(resolve => setTimeout(resolve, 500));
    await GroupEvents.sync();
    await GroupRules.sync();

    const groupJid = "120363000000000777@g.us";

    // 1. Initial export structure
    const initialConfig = await exportGroupConfig(groupJid);
    assert.equal(initialConfig.version, "1.0");
    assert.equal(initialConfig.groupJid, groupJid);
    assert.ok(initialConfig.protections);
    assert.ok(initialConfig.protections.antilien);
    assert.ok(initialConfig.protections.antiword);
    assert.ok(initialConfig.events);

    // 2. Import custom configuration
    const testConfigToImport = {
        version: "1.0",
        timestamp: Date.now(),
        groupJid,
        protections: {
            antilien: { status: "oui", action: "kick" },
            antibot: { status: "oui", action: "kick" },
            antichain: { status: "oui", action: "supp" },
            antitag: { status: "oui", action: "warn" },
            antispam: { status: "oui", action: "supp" },
            antimentiongc: { status: "oui", action: "supp" },
            antiword: { status: "oui", action: "kick", words: ["insult1", "insult2"] },
            antimedia: { status: "oui", action: "supp", types: ["image", "video"] }
        },
        warns: {
            maxWarns: 4
        },
        events: {
            welcome: "oui",
            goodbye: "oui",
            welcome_msg: "Bienvenue dans le groupe !",
            goodbye_msg: "Au revoir !",
            antipromote: "oui",
            antidemote: "oui",
            antikick: "oui"
        },
        rules: "1. Pas d'insultes. 2. Respecter les admins."
    };

    const importRes = await importGroupConfig(groupJid, testConfigToImport);
    assert.equal(importRes.success, true);
    assert.ok(importRes.updated.length > 0);

    // 3. Export after import and verify updated fields
    const exportedAfterImport = await exportGroupConfig(groupJid);
    assert.equal(exportedAfterImport.protections.antilien.status, "oui");
    assert.equal(exportedAfterImport.protections.antilien.action, "kick");
    assert.equal(exportedAfterImport.protections.antibot.status, "oui");
    assert.equal(exportedAfterImport.protections.antibot.action, "kick");
    assert.equal(exportedAfterImport.protections.antiword.status, "oui");
    assert.deepEqual(exportedAfterImport.protections.antiword.words, ["insult1", "insult2"]);
    assert.deepEqual(exportedAfterImport.protections.antimedia.types, ["image", "video"]);
    assert.equal(exportedAfterImport.warns.maxWarns, 4);
    assert.equal(exportedAfterImport.events.welcome, "oui");
    assert.equal(exportedAfterImport.events.welcome_msg, "Bienvenue dans le groupe !");
    assert.equal(exportedAfterImport.rules, "1. Pas d'insultes. 2. Respecter les admins.");

    // 4. Audit security calculation
    const auditRes = await auditGroupSecurity(groupJid, { isBotAdmin: true });
    assert.ok(auditRes.score >= 80, `Score should be high for fully configured group, got ${auditRes.score}`);
    assert.ok(["A+", "A"].includes(auditRes.grade), `Grade should be A or A+, got ${auditRes.grade}`);
    assert.ok(Array.isArray(auditRes.checks));
});

test("exportconfig, importconfig, and groupaudit commands execute correctly", async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await GroupEvents.sync();
    await GroupRules.sync();

    const testGroupJid = "120363000000000778@g.us";

    const exportCmd = commands.find(c => c.name === "exportconfig" || (c.alias && c.alias.includes("backupconfig")));
    const importCmd = commands.find(c => c.name === "importconfig" || (c.alias && c.alias.includes("restoreconfig")));
    const auditCmd = commands.find(c => c.name === "groupaudit" || (c.alias && c.alias.includes("auditgp")));

    assert.ok(exportCmd, "exportconfig command should be registered");
    assert.ok(importCmd, "importconfig command should be registered");
    assert.ok(auditCmd, "groupaudit command should be registered");

    let replyText = "";
    const fakeRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg));
    };

    const fakeMenma = {};

    // 1. Group check
    await exportCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: false,
        verif_Admin: true,
        repondre: fakeRepondre
    });
    assert.match(replyText, /groupe/i);

    // 2. Admin check
    replyText = "";
    await exportCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: false,
        repondre: fakeRepondre
    });
    assert.match(replyText, /admin/i);

    // 3. Successful export
    replyText = "";
    await exportCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        repondre: fakeRepondre
    });
    assert.match(replyText, /importconfig/i);
    assert.match(replyText, /```json/i);

    // Extract JSON block from replyText
    const jsonMatch = replyText.match(/```json\s*([\s\S]*?)\s*```/);
    assert.ok(jsonMatch, "Export reply should contain a JSON code block");
    const exportedJsonText = jsonMatch[1];

    // 4. Successful import via argument
    replyText = "";
    await importCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        arg: [exportedJsonText],
        repondre: fakeRepondre
    });
    assert.match(replyText, /appliquée avec succès/i);

    // 5. Successful import via quoted message
    replyText = "";
    await importCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        arg: [],
        msg_Repondu: { conversation: "```json\n" + exportedJsonText + "\n```" },
        repondre: fakeRepondre
    });
    assert.match(replyText, /appliquée avec succès/i);

    // 6. Audit command execution
    replyText = "";
    await auditCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_menmaAdmin: true,
        repondre: fakeRepondre
    });
    assert.match(replyText, /Score Global/i);
});
