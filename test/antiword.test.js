import test from "node:test";
import assert from "node:assert/strict";

import {
  Antiword,
  awAddOrUpdateJid,
  awVerifStatutJid,
  awUpdateAction,
  awRecupActionJid,
  awAddWord,
  awGetWords,
  awDelWord,
  awResetWords
} from "../Database/antiword.js";
import { waitForDatabase } from "../Database/ready.js";

import "../commandes/groupe.js";
import { commands } from "../lib/menmacmd.js";
import { messages_upsert } from "../lib/events/message_upsert.js";

test("Antiword database operations work correctly", async () => {
  await Antiword.sync();
  const testGroup = "120363000000000001@g.us";
  await Antiword.destroy({ where: { id: testGroup } });

  // Initial state
  assert.equal(await awVerifStatutJid(testGroup), "non");
  assert.equal(await awRecupActionJid(testGroup), "supp");
  assert.deepEqual(await awGetWords(testGroup), []);

  // Update status & action
  await awAddOrUpdateJid(testGroup, "oui");
  assert.equal(await awVerifStatutJid(testGroup), "oui");

  await awUpdateAction(testGroup, "kick");
  assert.equal(await awRecupActionJid(testGroup), "kick");

  // Add words
  const added1 = await awAddWord(testGroup, "badword1");
  assert.ok(added1);
  const addedDuplicate = await awAddWord(testGroup, "BADWORD1");
  assert.equal(addedDuplicate, false, "Duplicate word should not be added");

  await awAddWord(testGroup, "badword2");

  const words = await awGetWords(testGroup);
  assert.equal(words.length, 2);
  assert.ok(words.includes("badword1"));
  assert.ok(words.includes("badword2"));

  // Delete word
  const deleted = await awDelWord(testGroup, "badword1");
  assert.ok(deleted);
  const wordsAfterDel = await awGetWords(testGroup);
  assert.equal(wordsAfterDel.length, 1);
  assert.ok(!wordsAfterDel.includes("badword1"));

  // Reset words
  await awResetWords(testGroup);
  assert.deepEqual(await awGetWords(testGroup), []);
});

test("Antiword command executes subcommands correctly", async () => {
  const cmd = commands.find(c => c.name === "antiword" || (c.alias && c.alias.includes("badwords")));
  assert.ok(cmd, "antiword command should be registered");

  const testGroup = "120363000000000002@g.us";
  let replyText = "";
  const fakeRepondre = (msg) => {
    replyText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg));
  };

  const fakeMenma = {
    user: { id: "224000000000:1@s.whatsapp.net" }
  };

  // 1. Non-group restriction
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: false,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: [],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /groupe/i);

  // 2. Usage when no args
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: [],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /Statut/i);

  // 3. Add words
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["add", "insult1,", "insult2"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /2/i);

  // 4. List words
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["list"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /insult1/i);
  assert.match(replyText, /insult2/i);

  // 5. Turn ON and set action
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["supp"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /SUPP/i);
  assert.equal(await awVerifStatutJid(testGroup), "oui");

  // 6. Delete word
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["del", "insult1"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /retiré/i);

  // 7. Clear list
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["clear"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /réinitialisée/i);
  assert.deepEqual(await awGetWords(testGroup), []);
});

test("Antiword message_upsert filters messages with bad words", async () => {
  const groupJid = "120363000000000003@g.us";
  const userJid = "224611111111@s.whatsapp.net";

  // Enable antiword and add forbidden word
  await awAddOrUpdateJid(groupJid, "oui");
  await awUpdateAction(groupJid, "supp");
  await awAddWord(groupJid, "spamword");

  let deletedMessageKey = null;
  let sentWarning = false;

  const fakeMenma = {
    user: { id: "224000000000:1@s.whatsapp.net" },
    config: { NOM_BOT: "MenmaBot", DEV: ["224000000000"] },
    groupMetadata: async () => ({
      id: groupJid,
      subject: "Test Group",
      participants: [
        { id: "224000000000@s.whatsapp.net", admin: "admin" }, // bot
        { id: "224611111111@s.whatsapp.net", admin: null }     // regular member
      ]
    }),
    sendMessage: async (jid, content, options) => {
      if (content.delete) {
        deletedMessageKey = content.delete;
      } else if (content.text && content.text.includes("mots interdits")) {
        sentWarning = true;
      }
      return { key: { id: "reply123" } };
    },
    sendPresenceUpdate: async () => {}
  };

  const incomingMsg = {
    type: "notify",
    messages: [
      {
        key: {
          remoteJid: groupJid,
          fromMe: false,
          id: "MSG_BAD_WORD_101",
          participant: userJid
        },
        messageTimestamp: Math.floor(Date.now() / 1000),
        pushName: "BadUser",
        message: {
          conversation: "Ceci est une pub avec spamword dedans !"
        }
      }
    ]
  };

  await messages_upsert(incomingMsg, fakeMenma);

  assert.ok(deletedMessageKey, "Bad word message should trigger deletion");
  assert.equal(deletedMessageKey.id, "MSG_BAD_WORD_101");
  assert.ok(sentWarning, "Sanction warning message should be sent to group");
});
