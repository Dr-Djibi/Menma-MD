import test from "node:test";
import assert from "node:assert/strict";

// Import command file to register vcard
import "../commandes/outils.js";
import { commands } from "../lib/menmacmd.js";

test("vcard command generates and sends correct vCard contact payload", async () => {
    const vcardCmd = commands.find(c => c.name === "vcard");
    assert.ok(vcardCmd, "vcard command should be registered");
    assert.ok(vcardCmd.alias.includes("contact"), "vcard should have 'contact' alias");
    assert.ok(vcardCmd.alias.includes("card"), "vcard should have 'card' alias");

    let sentMessage = null;
    let sentJid = null;
    let sentOptions = null;

    const fakeMenma = {
        sendMessage: async (jid, message, options) => {
            sentJid = jid;
            sentMessage = message;
            sentOptions = options;
        }
    };

    let replyText = "";
    const fakeRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg));
    };

    // 1. Default sender when no parameters specified
    sentMessage = null;
    await vcardCmd.fonction("chat@s.whatsapp.net", fakeMenma, {
        repondre: fakeRepondre,
        auteur_Message: "221770001122@s.whatsapp.net",
        ms: { key: { id: "msg1" } }
    });

    assert.equal(sentJid, "chat@s.whatsapp.net");
    assert.ok(sentMessage && sentMessage.contacts, "sendMessage should receive contacts payload");
    assert.equal(sentMessage.contacts.displayName, "221770001122");
    assert.ok(sentMessage.contacts.contacts[0].vcard.includes("waid=221770001122"));

    // 2. Replying to a message
    sentMessage = null;
    await vcardCmd.fonction("chat@s.whatsapp.net", fakeMenma, {
        repondre: fakeRepondre,
        msg_Repondu: { conversation: "hello" },
        auteur_Msg_Repondu: "221780003344@s.whatsapp.net",
        auteur_Message: "221770001122@s.whatsapp.net",
        resolveName: (jid) => "Alice",
        ms: { key: { id: "msg2" } }
    });

    assert.equal(sentMessage.contacts.displayName, "Alice");
    assert.ok(sentMessage.contacts.contacts[0].vcard.includes("FN:Alice"));
    assert.ok(sentMessage.contacts.contacts[0].vcard.includes("waid=221780003344"));

    // 3. Mentioning a user (mr[0])
    sentMessage = null;
    await vcardCmd.fonction("chat@s.whatsapp.net", fakeMenma, {
        repondre: fakeRepondre,
        mr: ["221790005566@s.whatsapp.net"],
        auteur_Message: "221770001122@s.whatsapp.net",
        ms: { key: { id: "msg3" } }
    });

    assert.equal(sentMessage.contacts.displayName, "221790005566");
    assert.ok(sentMessage.contacts.contacts[0].vcard.includes("waid=221790005566"));

    // 4. Passing phone number as argument
    sentMessage = null;
    await vcardCmd.fonction("chat@s.whatsapp.net", fakeMenma, {
        repondre: fakeRepondre,
        arg: ["+221 76 123 45 67"],
        auteur_Message: "221770001122@s.whatsapp.net",
        ms: { key: { id: "msg4" } }
    });

    assert.equal(sentMessage.contacts.displayName, "221761234567");
    assert.ok(sentMessage.contacts.contacts[0].vcard.includes("waid=221761234567"));
});
