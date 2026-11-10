import test from "node:test";
import assert from "node:assert/strict";
import { GroupEvents, getGroupEvents, updateGroupEventStatus } from "../Database/group_events.js";
import { commands } from "../lib/menmacmd.js";
import { group_participants_update } from "../lib/events/group_participants_update.js";
import "../commandes/groupe.js";

test("Anti-Kick feature tests (database, command, enforcement)", async () => {
    // Wait for GroupEvents table sync
    await new Promise(r => setTimeout(r, 1000));

    // 1. Database operations
    const groupId1 = "120363000000000000@g.us";
    let events1 = await getGroupEvents(groupId1);
    await events1.update({ antikick: "oui" });
    events1 = await getGroupEvents(groupId1);
    assert.equal(events1.antikick, "oui");

    await events1.update({ antikick: "non" });
    events1 = await getGroupEvents(groupId1);
    assert.equal(events1.antikick, "non");

    // 2. Command execution
    const groupId2 = "120363000000000001@g.us";

    const antikickCmd = commands.find(c => c.name === "antikick");
    assert.ok(antikickCmd, "antikick command should be registered in menmacmd");

    let repliedText = "";
    const fakeComOptions = {
        arg: [],
        repondre: (msg) => { repliedText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg)); },
        verif_Admin: true,
        verif_Gp: true,
        verif_menmaAdmin: true
    };

    await antikickCmd.fonction(groupId2, {}, fakeComOptions);
    assert.match(repliedText, /ANTIKICK/i);

    const fakeComOptionsOn = {
        arg: ["on"],
        repondre: (msg) => { repliedText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg)); },
        verif_Admin: true,
        verif_Gp: true,
        verif_menmaAdmin: true
    };
    await antikickCmd.fonction(groupId2, {}, fakeComOptionsOn);
    let events2 = await getGroupEvents(groupId2);
    assert.equal(events2.antikick, "oui");

    // 3. Event enforcement
    const groupId3 = "120363000000000002@g.us";
    await updateGroupEventStatus(groupId3, "antikick", "oui");

    let readdedUsers = [];
    let sentMessages = [];

    const fakeMenma = {
        user: { id: "224000000000:1@s.whatsapp.net" },
        ws: { readyState: 1 },
        groupMetadata: async () => ({
            id: groupId3,
            subject: "Test Group",
            participants: [
                { id: "224000000000@s.whatsapp.net", admin: "admin" },
                { id: "224111111111@s.whatsapp.net", admin: "admin" },
                { id: "224222222222@s.whatsapp.net", admin: null }
            ]
        }),
        groupParticipantsUpdate: async (jid, participants, action) => {
            if (action === "add") {
                readdedUsers.push({ jid, participants });
            }
        },
        sendMessage: async (jid, msgObj) => {
            sentMessages.push({ jid, msgObj });
        }
    };

    // 3a. Voluntary leave check (author === participant)
    const voluntaryLeavePayload = {
        id: groupId3,
        participants: [{ id: "224222222222@s.whatsapp.net" }],
        action: "remove",
        author: "224222222222@s.whatsapp.net"
    };

    await group_participants_update(voluntaryLeavePayload, fakeMenma);
    assert.equal(readdedUsers.length, 0, "Should NOT attempt to re-add when user left voluntarily");

    // 3b. Unauthorized kick check (author !== participant)
    const updatePayload = {
        id: groupId3,
        participants: [{ id: "224222222222@s.whatsapp.net" }],
        action: "remove",
        author: "224111111111@s.whatsapp.net"
    };

    await group_participants_update(updatePayload, fakeMenma);

    assert.equal(readdedUsers.length, 1, "Should attempt to re-add the kicked member");
    assert.deepEqual(readdedUsers[0].participants, ["224222222222@s.whatsapp.net"]);
    assert.equal(sentMessages.length, 1, "Should send Anti-Kick warning message");
    assert.match(sentMessages[0].msgObj.text, /Anti-Kick/i);
});
