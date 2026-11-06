import test from "node:test";
import assert from "node:assert/strict";

import "../commandes/groupe.js";
import { commands } from "../lib/menmacmd.js";

test("tagadmin command mentions all group admins and supports quoted message", async () => {
    const testGroupJid = "120363000000000999@g.us";

    const tagadminCmd = commands.find(c => c.name === "tagadmin" || (c.alias && c.alias.includes("admins")));
    assert.ok(tagadminCmd, ".tagadmin command should be registered");

    let replyText = "";
    const fakeRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg));
    };

    let sentMessage = null;
    let sentOptions = null;
    const fakeMenma = {
        sendMessage: async (jid, content, options) => {
            sentMessage = content;
            sentOptions = options;
        }
    };

    // 1. Non-group check
    replyText = "";
    await tagadminCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: false,
        repondre: fakeRepondre,
        mbre_membre: []
    });
    assert.match(replyText, /groupe/i, "Should reject if not in a group");

    // 2. Group with no admins
    replyText = "";
    await tagadminCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        repondre: fakeRepondre,
        mbre_membre: [
            { id: "224600000001@s.whatsapp.net", admin: null },
            { id: "224600000002@s.whatsapp.net", admin: null }
        ],
        arg: [],
        resolveName: (id) => `User_${id.split("@")[0]}`
    });
    assert.match(replyText, /aucun administrateur/i, "Should inform if no admins exist");

    // 3. Normal execution with custom message and quoted message
    sentMessage = null;
    sentOptions = null;
    const fakeQuoted = { key: { id: "MSG_QUOTED_123" }, message: { conversation: "Signalement urgent" } };
    const members = [
        { id: "224600000001@s.whatsapp.net", admin: "admin" },
        { id: "224600000002@s.whatsapp.net", admin: "superadmin" },
        { id: "224600000003@s.whatsapp.net", admin: null }
    ];

    await tagadminCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        repondre: fakeRepondre,
        mbre_membre: members,
        arg: ["Regardez", "ce", "message"],
        resolveName: (id) => `Admin_${id.split("@")[0].slice(-2)}`,
        ms: fakeQuoted
    });

    assert.ok(sentMessage, "Should have sent a message via menma.sendMessage");
    assert.ok(sentOptions, "Should provide options to menma.sendMessage");
    assert.equal(sentOptions.quoted, fakeQuoted, "Should quote the source message");

    assert.deepEqual(
        sentMessage.mentions,
        ["224600000001@s.whatsapp.net", "224600000002@s.whatsapp.net"],
        "Mentions should only contain administrators"
    );

    assert.match(sentMessage.text, /Regardez ce message/, "Should include the provided argument text");
    assert.match(sentMessage.text, /Admin_01/, "Should include resolved admin name");
    assert.match(sentMessage.text, /Admin_02/, "Should include resolved superadmin name");
    // Ensure no redundant (@number) next to names
    assert.doesNotMatch(sentMessage.text, /Admin_01\s*\(@224600000001\)/, "Should not duplicate phone number parenthetically");

    // 4. Execution without argument (fallback to default message)
    sentMessage = null;
    sentOptions = null;
    await tagadminCmd.fonction(testGroupJid, fakeMenma, {
        verif_Gp: true,
        repondre: fakeRepondre,
        mbre_membre: members,
        arg: [],
        resolveName: (id) => `@${id.split("@")[0]}`
    });

    assert.ok(sentMessage, "Should send message with default text");
    assert.match(sentMessage.text, /Appel des administrateurs/, "Should contain default message");
});
