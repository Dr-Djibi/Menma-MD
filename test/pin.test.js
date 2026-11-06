import test from "node:test";
import assert from "node:assert/strict";

import { commands } from "../lib/menmacmd.js";
import "../commandes/groupe.js";
import "../commandes/outils.js";
import "../commandes/fun.js";

const TEST_GROUP = "120363000000000999@g.us";

test("pin and unpin commands registration and structure", async () => {
    const pinCmd = commands.find(c => c.name === "pin");
    assert.ok(pinCmd, "pin command should be registered");
    assert.deepEqual(pinCmd.alias, ["epingler", "epingle"]);
    assert.equal(pinCmd.classe, "groupe");

    const unpinCmd = commands.find(c => c.name === "unpin");
    assert.ok(unpinCmd, "unpin command should be registered");
    assert.deepEqual(unpinCmd.alias, ["desepingler", "unepingler"]);
    assert.equal(unpinCmd.classe, "groupe");
});

test("pin and unpin permissions and quoted message validation", async () => {
    const pinCmd = commands.find(c => c.name === "pin");
    const unpinCmd = commands.find(c => c.name === "unpin");

    let replyText = "";
    const mockRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : msg.text || "";
    };

    // 1. Rejects if not in group
    await pinCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: false,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: [],
        prefixe: "."
    });
    assert.match(replyText, /groupe/i);

    // 2. Rejects if user is not admin
    replyText = "";
    await pinCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: false,
        verif_menmaAdmin: true,
        arg: [],
        prefixe: "."
    });
    assert.match(replyText, /admin/i);

    // 3. Rejects if bot is not admin
    replyText = "";
    await pinCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: false,
        arg: [],
        prefixe: "."
    });
    assert.match(replyText, /admin/i);

    // 4. Informs user when no quoted message
    replyText = "";
    await pinCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: [],
        prefixe: ".",
        ms: { message: { conversation: "test" } }
    });
    assert.match(replyText, /répondez/i);

    // 5. Unpin also requires quoted message
    replyText = "";
    await unpinCmd.fonction(TEST_GROUP, {}, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: [],
        prefixe: ".",
        ms: { message: { conversation: "test" } }
    });
    assert.match(replyText, /répondez/i);
});

test("pin and unpin dispatch correct relayMessage payload", async () => {
    const pinCmd = commands.find(c => c.name === "pin");
    const unpinCmd = commands.find(c => c.name === "unpin");

    let relayedPayload = null;
    let relayedJid = null;

    const mockMenma = {
        user: { id: "224600000000:1@s.whatsapp.net" },
        relayMessage: async (jid, payload, opts) => {
            relayedJid = jid;
            relayedPayload = payload;
        }
    };

    let replyText = "";
    const mockRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : msg.text || "";
    };

    const quotedMs = {
        message: {
            extendedTextMessage: {
                text: "test",
                contextInfo: {
                    stanzaId: "MSG_ID_12345",
                    participant: "224611111111@s.whatsapp.net"
                }
            }
        }
    };

    // Pin with 24h duration
    await pinCmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["24h"],
        prefixe: ".",
        ms: quotedMs
    });

    assert.equal(relayedJid, TEST_GROUP);
    assert.ok(relayedPayload.pinInChatMessage);
    assert.equal(relayedPayload.pinInChatMessage.key.id, "MSG_ID_12345");
    assert.equal(relayedPayload.pinInChatMessage.type, 1); // PIN_FOR_ALL
    assert.equal(relayedPayload.messageContextInfo.messageAddOnDurationInSecs, 86400);
    assert.match(replyText, /24 heures/i);

    // Unpin
    relayedPayload = null;
    await unpinCmd.fonction(TEST_GROUP, mockMenma, {
        repondre: mockRepondre,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: [],
        prefixe: ".",
        ms: quotedMs
    });

    assert.equal(relayedJid, TEST_GROUP);
    assert.ok(relayedPayload.pinInChatMessage);
    assert.equal(relayedPayload.pinInChatMessage.key.id, "MSG_ID_12345");
    assert.equal(relayedPayload.pinInChatMessage.type, 2); // UNPIN_FOR_ALL
    assert.match(replyText, /désépinglé/i);
});

test("new utility and fun commands execute properly", async () => {
    let reply = "";
    const repondre = (m) => { reply = typeof m === "string" ? m : m.text || ""; };

    // calcpercent
    const calcpercent = commands.find(c => c.name === "calcpercent");
    assert.ok(calcpercent);
    await calcpercent.fonction(TEST_GROUP, {}, { arg: ["20", "200"], repondre, prefixe: "." });
    assert.match(reply, /40/);

    // sha256hash
    const sha256 = commands.find(c => c.name === "sha256hash");
    assert.ok(sha256);
    await sha256.fonction(TEST_GROUP, {}, { arg: ["hello"], repondre, prefixe: "." });
    assert.match(reply, /2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824/);

    // base64enc & base64dec
    const b64enc = commands.find(c => c.name === "base64enc");
    await b64enc.fonction(TEST_GROUP, {}, { arg: ["menma-bot"], repondre, prefixe: "." });
    assert.match(reply, /bWVubWEtYm90/);

    // magic8ball
    const ball = commands.find(c => c.name === "magic8ball");
    assert.ok(ball);
    await ball.fonction(TEST_GROUP, {}, { arg: ["vais-je", "réussir", "?"], repondre, prefixe: "." });
    assert.match(reply, /Réponse/i);
});
