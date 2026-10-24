import test from "node:test";
import assert from "node:assert/strict";

import "../commandes/groupe.js";
import { commands } from "../lib/menmacmd.js";

test("Mute and Unmute group commands work correctly", async () => {
    const testGroupJid = "120363000000000888@g.us";

    const muteCmd = commands.find(c => c.name === "mute" || (c.alias && c.alias.includes("silence")));
    const unmuteCmd = commands.find(c => c.name === "unmute" || (c.alias && c.alias.includes("unsilence")));

    assert.ok(muteCmd, ".mute command should be registered");
    assert.ok(unmuteCmd, ".unmute command should be registered");

    let replyText = "";
    const fakeRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg));
    };

    let groupSettingState = null;
    let sentMessage = null;

    const fakeMenma = {
        groupSettingUpdate: async (jid, setting) => {
            groupSettingState = setting;
        },
        sendMessage: async (jid, content) => {
            sentMessage = content;
        }
    };

    // 1. Group check failure
    replyText = "";
    await muteCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: false,
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /groupe/i, "Should reject if not in a group");

    // 2. User admin check failure
    replyText = "";
    await muteCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: false,
        verif_menmaAdmin: true,
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /admin/i, "Should reject non-admin from muting");

    // 3. Bot admin check failure
    replyText = "";
    await muteCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: false,
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /administrateur|admin/i, "Should reject if bot is not admin");

    // 4. Invalid duration format
    replyText = "";
    await muteCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["invalid_time"],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /invalide/i, "Should notify user about invalid duration format");

    // 5. Mute without duration (indefinite)
    replyText = "";
    groupSettingState = null;
    await muteCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: [],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.equal(groupSettingState, "announcement", "Should set group setting to announcement");
    assert.match(replyText, /fermé/i, "Should confirm group closed indefinitely");

    // 6. Mute with valid duration (1s) and trigger auto-unmute
    replyText = "";
    groupSettingState = null;
    sentMessage = null;
    await muteCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["1s"],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.equal(groupSettingState, "announcement", "Should set group setting to announcement");
    assert.match(replyText, /1s/i, "Should confirm group closed with timed duration");

    // Wait 1.2s for auto-unmute timer
    await new Promise(resolve => setTimeout(resolve, 1200));
    assert.equal(groupSettingState, "not_announcement", "Should automatically set group setting back to not_announcement");
    assert.ok(sentMessage && sentMessage.text, "Should send auto-unmute message to group");
    assert.match(sentMessage.text, /rouvert/i, "Message should confirm group auto-unmoted");

    // 7. Unmute command
    replyText = "";
    groupSettingState = null;
    await unmuteCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.equal(groupSettingState, "not_announcement", "Should set group setting to not_announcement");
    assert.match(replyText, /ouvert/i, "Should confirm group opened");
});
