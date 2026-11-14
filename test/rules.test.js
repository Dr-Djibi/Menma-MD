import test from "node:test";
import assert from "node:assert/strict";

import { GroupRules, getGroupRules, setGroupRules, delGroupRules } from "../Database/rules.js";
import "../commandes/groupe.js";
import { commands } from "../lib/menmacmd.js";

test("GroupRules database operations work correctly", async () => {
    const testJid = "120363000000000099@g.us";
    const rulesText = "1. Respect. 2. No Spam. 3. No Links.";

    // Clean up first
    await GroupRules.destroy({ where: { id: testJid } });

    // 1. Initial state -> null
    let rules = await getGroupRules(testJid);
    assert.equal(rules, null, "Should return null when no rules set");

    // 2. Set rules
    await setGroupRules(testJid, rulesText);
    rules = await getGroupRules(testJid);
    assert.equal(rules, rulesText, "Should retrieve newly set rules");

    // 3. Update rules
    const updatedRules = "1. Respect everyone. 2. Be nice.";
    await setGroupRules(testJid, updatedRules);
    rules = await getGroupRules(testJid);
    assert.equal(rules, updatedRules, "Should retrieve updated rules");

    // 4. Delete rules
    const deleted = await delGroupRules(testJid);
    assert.equal(deleted, true, "Should return true when deleting existing rules");

    rules = await getGroupRules(testJid);
    assert.equal(rules, null, "Should return null after deletion");

    // Delete again
    const deleteAgain = await delGroupRules(testJid);
    assert.equal(deleteAgain, false, "Should return false when deleting non-existent rules");
});

test("Group rules commands (.rules, .setrules, .delrules) execute correctly", async () => {
    const testGroupJid = "120363000000000098@g.us";
    await GroupRules.destroy({ where: { id: testGroupJid } });

    const rulesCmd = commands.find(c => c.name === "rules" || (c.alias && c.alias.includes("regles")));
    const setRulesCmd = commands.find(c => c.name === "setrules" || (c.alias && c.alias.includes("setregles")));
    const delRulesCmd = commands.find(c => c.name === "delrules" || (c.alias && c.alias.includes("delregles")));

    assert.ok(rulesCmd, ".rules command should be registered");
    assert.ok(setRulesCmd, ".setrules command should be registered");
    assert.ok(delRulesCmd, ".delrules command should be registered");

    let replyText = "";
    const fakeRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg));
    };

    const fakeMenma = {};

    // 1. Non-group check for .rules
    await rulesCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: false,
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /groupe/i, "Should reject if not in a group");

    // 2. View rules when none set
    replyText = "";
    await rulesCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /aucune règle/i, "Should inform user that no rules are defined");

    // 3. Admin check for .setrules
    replyText = "";
    await setRulesCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: false,
        arg: ["1.", "Pas", "de", "spam"],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /admin/i, "Should reject non-admin from setting rules");

    // 4. Missing text for .setrules
    replyText = "";
    await setRulesCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        arg: [],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /saisir/i, "Should prompt user to enter rules text when argument is missing");

    // 5. Successfully set rules
    replyText = "";
    await setRulesCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        arg: ["1.", "Respecter", "les", "membres.", "2.", "Pas", "de", "spam."],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /enregistré/i, "Should confirm rules were saved");

    // 6. View rules after setting
    replyText = "";
    await rulesCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /Respecter les membres/, "Should display the set group rules");

    // 7. Delete rules with .delrules
    replyText = "";
    await delRulesCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /supprimé/i, "Should confirm rules were deleted");

    // Clean up
    await GroupRules.destroy({ where: { id: testGroupJid } });
});
