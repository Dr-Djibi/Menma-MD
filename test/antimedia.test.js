import test from "node:test";
import assert from "node:assert/strict";

import {
  Antimedia,
  amAddOrUpdateJid,
  amVerifStatutJid,
  amUpdateAction,
  amRecupActionJid,
  amGetMediaTypes,
  amSetMediaTypes,
  amAddMediaType,
  amDelMediaType
} from "../Database/antimedia.js";
import { waitForDatabase } from "../Database/ready.js";

import "../commandes/groupe.js";
import { commands } from "../lib/menmacmd.js";
import { messages_upsert } from "../lib/events/message_upsert.js";

test("Antimedia database operations work correctly", async () => {
  await Antimedia.sync();
  const testGroup = "120363000000000099@g.us";
  await Antimedia.destroy({ where: { id: testGroup } });

  // Initial state
  assert.equal(await amVerifStatutJid(testGroup), "non");
  assert.equal(await amRecupActionJid(testGroup), "supp");
  assert.deepEqual(await amGetMediaTypes(testGroup), ["all"]);

  // Update status & action
  await amAddOrUpdateJid(testGroup, "oui");
  assert.equal(await amVerifStatutJid(testGroup), "oui");

  await amUpdateAction(testGroup, "warn");
  assert.equal(await amRecupActionJid(testGroup), "warn");

  // Add specific media type
  const addedSticker = await amAddMediaType(testGroup, "sticker");
  assert.ok(addedSticker);
  const typesAfterSticker = await amGetMediaTypes(testGroup);
  assert.deepEqual(typesAfterSticker, ["sticker"]);

  // Add another type
  await amAddMediaType(testGroup, "image");
  const typesAfterImage = await amGetMediaTypes(testGroup);
  assert.equal(typesAfterImage.length, 2);
  assert.ok(typesAfterImage.includes("sticker"));
  assert.ok(typesAfterImage.includes("image"));

  // Delete media type
  const deletedSticker = await amDelMediaType(testGroup, "sticker");
  assert.ok(deletedSticker);
  const typesAfterDel = await amGetMediaTypes(testGroup);
  assert.deepEqual(typesAfterDel, ["image"]);

  // Delete last type resets to ['all']
  await amDelMediaType(testGroup, "image");
  assert.deepEqual(await amGetMediaTypes(testGroup), ["all"]);
});

test("Antimedia command executes subcommands correctly", async () => {
  const cmd = commands.find(c => c.name === "antimedia" || (c.alias && c.alias.includes("badmedia")));
  assert.ok(cmd, "antimedia command should be registered");

  const testGroup = "120363000000000098@g.us";
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

  // 3. Add media restriction
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["add", "sticker,video"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /sticker/i);
  assert.match(replyText, /video/i);

  // 4. List configuration
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["list"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /sticker/i);

  // 5. Change sanction action
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["kick"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /KICK/i);
  assert.equal(await amRecupActionJid(testGroup), "kick");

  // 6. Turn OFF
  replyText = "";
  await cmd.fonction(testGroup, fakeMenma, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["off"],
    repondre: fakeRepondre,
    prefixe: "."
  });
  assert.match(replyText, /désactivé/i);
  assert.equal(await amVerifStatutJid(testGroup), "non");
});

test("Antimedia message_upsert filters restricted media messages", async () => {
  const groupJid = "120363000000000097@g.us";
  const userJid = "224622222222@s.whatsapp.net";

  // Enable antimedia for stickers only
  await amAddOrUpdateJid(groupJid, "oui");
  await amUpdateAction(groupJid, "supp");
  await amSetMediaTypes(groupJid, ["sticker"]);

  let deletedMessageKey = null;

  const fakeMenma = {
    user: { id: "224000000000:1@s.whatsapp.net" },
    config: { NOM_BOT: "MenmaBot", DEV: ["224000000000"] },
    groupMetadata: async () => ({
      id: groupJid,
      subject: "Media Filter Group",
      participants: [
        { id: "224000000000@s.whatsapp.net", admin: "admin" }, // bot
        { id: "224622222222@s.whatsapp.net", admin: null }     // regular user
      ]
    }),
    sendMessage: async (jid, content) => {
      if (content.delete) {
        deletedMessageKey = content.delete;
      }
      return { key: { id: "reply789" } };
    },
    sendPresenceUpdate: async () => {}
  };

  // 1. Send sticker (restricted)
  const incomingStickerMsg = {
    type: "notify",
    messages: [
      {
        key: {
          remoteJid: groupJid,
          fromMe: false,
          id: "MSG_STICKER_001",
          participant: userJid
        },
        messageTimestamp: Math.floor(Date.now() / 1000),
        pushName: "MediaUser",
        message: {
          stickerMessage: { url: "http://example.com/sticker.webp" }
        }
      }
    ]
  };

  await messages_upsert(incomingStickerMsg, fakeMenma);

  assert.ok(deletedMessageKey, "Restricted sticker should trigger deletion");
  assert.equal(deletedMessageKey.id, "MSG_STICKER_001");

  // Reset deletedMessageKey
  deletedMessageKey = null;

  // 2. Send image (unrestricted when only sticker is restricted)
  const incomingImageMsg = {
    type: "notify",
    messages: [
      {
        key: {
          remoteJid: groupJid,
          fromMe: false,
          id: "MSG_IMAGE_002",
          participant: userJid
        },
        messageTimestamp: Math.floor(Date.now() / 1000),
        pushName: "MediaUser",
        message: {
          imageMessage: { caption: "Hello image" }
        }
      }
    ]
  };

  await messages_upsert(incomingImageMsg, fakeMenma);

  assert.equal(deletedMessageKey, null, "Unrestricted image should NOT be deleted");
});
