import test from "node:test";
import assert from "node:assert/strict";

import { commands } from "../lib/menmacmd.js";
import "../commandes/groupe.js";

const TEST_GROUP = "120363000000000123@g.us";

test("ephemeral command is properly registered with aliases and metadata", async () => {
    const cmd = commands.find(c => c.name === "ephemeral");
    assert.ok(cmd, "ephemeral command should be registered");
    assert.deepEqual(cmd.alias, ["disappearing", "ephemere", "ephemeres"]);
    assert.equal(cmd.classe, "groupe");
    assert.equal(cmd.react, "⏱️");
});

test("gpsetting command is registered and has aliases", async () => {
    const cmd = commands.find(c => c.name === "gpsetting");
    assert.ok(cmd, "gpsetting command should be registered");
    assert.deepEqual(cmd.alias, ["gpedit", "groupedit"]);
    assert.equal(cmd.classe, "groupe");
});

test("gpsetting and ephemeral enforce group and admin permissions", async () => {
    const gpsettingCmd = commands.find(c => c.name === "gpsetting");
    const ephemeralCmd = commands.find(c => c.name === "ephemeral");

    let replyText = "";
    const mockRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg?.text || "");
    };

    // 1. Not in group
    replyText = "";
    await gpsettingCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: false,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["locked"],
        prefixe: "."
    });
    assert.match(replyText, /groupe/i);

    replyText = "";
    await ephemeralCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: false,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["24h"],
        prefixe: "."
    });
    assert.match(replyText, /groupe/i);

    // 2. User not admin
    replyText = "";
    await gpsettingCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: false,
        verif_menmaAdmin: true,
        arg: ["locked"],
        prefixe: "."
    });
    assert.match(replyText, /admin/i);

    replyText = "";
    await ephemeralCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: false,
        verif_menmaAdmin: true,
        arg: ["24h"],
        prefixe: "."
    });
    assert.match(replyText, /admin/i);

    // 3. Bot not admin
    replyText = "";
    await gpsettingCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: false,
        arg: ["locked"],
        prefixe: "."
    });
    assert.match(replyText, /admin/i);

    replyText = "";
    await ephemeralCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: false,
        arg: ["24h"],
        prefixe: "."
    });
    assert.match(replyText, /admin/i);
});

test("gpsetting correctly invokes groupSettingUpdate with locked and unlocked", async () => {
    const cmd = commands.find(c => c.name === "gpsetting");

    let updatedJid = null;
    let updatedSetting = null;

    const mockMenma = {
        groupSettingUpdate: async (jid, setting) => {
            updatedJid = jid;
            updatedSetting = setting;
        }
    };

    let replyText = "";
    const mockRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg?.text || "");
    };

    // Test 'locked'
    await cmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["locked"],
        prefixe: "."
    });
    assert.equal(updatedJid, TEST_GROUP);
    assert.equal(updatedSetting, "locked");
    assert.match(replyText, /restreintes aux administrateurs/i);

    // Test 'unlocked'
    updatedJid = null;
    updatedSetting = null;
    await cmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["unlocked"],
        prefixe: "."
    });
    assert.equal(updatedJid, TEST_GROUP);
    assert.equal(updatedSetting, "unlocked");
    assert.match(replyText, /ouvertes à tous les membres/i);

    // Test invalid arg
    updatedJid = null;
    updatedSetting = null;
    await cmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["invalide"],
        prefixe: "."
    });
    assert.equal(updatedSetting, null);
    assert.match(replyText, /invalide/i);
});

test("ephemeral correctly calls groupToggleEphemeral with durations 24h, 7d, 90d, off", async () => {
    const cmd = commands.find(c => c.name === "ephemeral");

    let toggledJid = null;
    let toggledDuration = null;

    const mockMenma = {
        groupToggleEphemeral: async (jid, duration) => {
            toggledJid = jid;
            toggledDuration = duration;
        }
    };

    let replyText = "";
    const mockRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg?.text || "");
    };

    // 1. Test 24h
    await cmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["24h"],
        prefixe: "."
    });
    assert.equal(toggledJid, TEST_GROUP);
    assert.equal(toggledDuration, 86400);
    assert.match(replyText, /24 heures/i);

    // 2. Test 7j
    toggledJid = null;
    toggledDuration = null;
    await cmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["7j"],
        prefixe: "."
    });
    assert.equal(toggledJid, TEST_GROUP);
    assert.equal(toggledDuration, 604800);
    assert.match(replyText, /7 jours/i);

    // 3. Test 90j
    toggledJid = null;
    toggledDuration = null;
    await cmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["90j"],
        prefixe: "."
    });
    assert.equal(toggledJid, TEST_GROUP);
    assert.equal(toggledDuration, 7776000);
    assert.match(replyText, /90 jours/i);

    // 4. Test off
    toggledJid = null;
    toggledDuration = null;
    await cmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["off"],
        prefixe: "."
    });
    assert.equal(toggledJid, TEST_GROUP);
    assert.equal(toggledDuration, 0);
    assert.match(replyText, /désactivés/i);

    // 5. Test usage prompt
    toggledJid = null;
    toggledDuration = null;
    await cmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: [],
        prefixe: "."
    });
    assert.equal(toggledDuration, null);
    assert.match(replyText, /Configuration des messages éphémères/i);
});
