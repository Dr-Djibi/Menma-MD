import test from "node:test";
import assert from "node:assert/strict";

import {
  Anticountry,
  acAddOrUpdateJid,
  acVerifStatutJid,
  acGetCountryCodes,
  acSetCountryCodes,
  acAddCountryCode,
  acDelCountryCode,
  acResetCountryCodes,
} from "../Database/anticountry.js";
import { waitForDatabase, markTableReady } from "../Database/ready.js";
import { group_participants_update } from "../lib/events/group_participants_update.js";
import { exportGroupConfig, importGroupConfig, auditGroupSecurity } from "../lib/groupConfigHelper.js";
import { commands } from "../lib/menmacmd.js";
import "../commandes/groupe.js";

// Pre-mark DB tables not used in unit test to avoid readiness timeout
markTableReady("Session");
markTableReady("Theme");

const TEST_GROUP = "120363999999999999@g.us";

test("Anticountry Database functions work correctly", async () => {
  await waitForDatabase();
  await acResetCountryCodes(TEST_GROUP);
  await acAddOrUpdateJid(TEST_GROUP, "non");

  let status = await acVerifStatutJid(TEST_GROUP);
  assert.equal(status, "non");

  await acAddOrUpdateJid(TEST_GROUP, "oui");
  status = await acVerifStatutJid(TEST_GROUP);
  assert.equal(status, "oui");

  let codes = await acGetCountryCodes(TEST_GROUP);
  assert.deepEqual(codes, []);

  // Add codes
  let added = await acAddCountryCode(TEST_GROUP, "234");
  assert.equal(added, true);
  added = await acAddCountryCode(TEST_GROUP, "212");
  assert.equal(added, true);
  // Duplicate add
  added = await acAddCountryCode(TEST_GROUP, "234");
  assert.equal(added, false);

  codes = await acGetCountryCodes(TEST_GROUP);
  assert.deepEqual(codes, ["234", "212"]);

  // Delete code
  let deleted = await acDelCountryCode(TEST_GROUP, "212");
  assert.equal(deleted, true);
  deleted = await acDelCountryCode(TEST_GROUP, "999");
  assert.equal(deleted, false);

  codes = await acGetCountryCodes(TEST_GROUP);
  assert.deepEqual(codes, ["234"]);

  // Reset
  await acResetCountryCodes(TEST_GROUP);
  codes = await acGetCountryCodes(TEST_GROUP);
  assert.deepEqual(codes, []);

  await Anticountry.destroy({ where: { id: TEST_GROUP } });
});

test("Anticountry command executes subcommands correctly", async () => {
  await waitForDatabase();
  const anticountryCmd = commands.find(
    (c) => c.name === "anticountry" || (c.alias && c.alias.includes("blockcountry"))
  );
  assert.ok(anticountryCmd, "anticountry command should be registered");

  let replyText = "";
  const fakeRepondre = (msg) => {
    replyText = typeof msg === "string" ? msg : msg.text || JSON.stringify(msg);
  };

  // 1. Not in group
  await anticountryCmd.fonction(TEST_GROUP, {}, {
    verif_Gp: false,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: [],
    repondre: fakeRepondre,
    prefixe: ".",
  });
  assert.match(replyText, /groupe/i);

  // 2. Not admin
  replyText = "";
  await anticountryCmd.fonction(TEST_GROUP, {}, {
    verif_Gp: true,
    verif_Admin: false,
    verif_menmaAdmin: true,
    arg: [],
    repondre: fakeRepondre,
    prefixe: ".",
  });
  assert.match(replyText, /admin/i);

  // 3. Status display when no arg (STYLE.TOP formats with fancy Unicode fonts)
  replyText = "";
  await anticountryCmd.fonction(TEST_GROUP, {}, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: [],
    repondre: fakeRepondre,
    prefixe: ".",
  });
  assert.match(replyText, /Indicatifs interdits/i);

  // 4. Add codes
  replyText = "";
  await anticountryCmd.fonction(TEST_GROUP, {}, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["add", "234", "92"],
    repondre: fakeRepondre,
    prefixe: ".",
  });
  assert.match(replyText, /ajouté/i);
  let codes = await acGetCountryCodes(TEST_GROUP);
  assert.ok(codes.includes("234"));
  assert.ok(codes.includes("92"));

  // 5. List codes
  replyText = "";
  await anticountryCmd.fonction(TEST_GROUP, {}, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["list"],
    repondre: fakeRepondre,
    prefixe: ".",
  });
  assert.match(replyText, /\+234/);
  assert.match(replyText, /\+92/);

  // 6. Delete code
  replyText = "";
  await anticountryCmd.fonction(TEST_GROUP, {}, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["del", "92"],
    repondre: fakeRepondre,
    prefixe: ".",
  });
  assert.match(replyText, /retiré/i);
  codes = await acGetCountryCodes(TEST_GROUP);
  assert.ok(!codes.includes("92"));

  // 7. Turn off
  replyText = "";
  await anticountryCmd.fonction(TEST_GROUP, {}, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["off"],
    repondre: fakeRepondre,
    prefixe: ".",
  });
  assert.match(replyText, /désactivé/i);
  assert.equal(await acVerifStatutJid(TEST_GROUP), "non");

  // 8. Turn on
  replyText = "";
  await anticountryCmd.fonction(TEST_GROUP, {}, {
    verif_Gp: true,
    verif_Admin: true,
    verif_menmaAdmin: true,
    arg: ["on"],
    repondre: fakeRepondre,
    prefixe: ".",
  });
  assert.match(replyText, /activé/i);
  assert.equal(await acVerifStatutJid(TEST_GROUP), "oui");

  await Anticountry.destroy({ where: { id: TEST_GROUP } });
});

test("group_participants_update auto-kicks joining users matching blocked country code", async () => {
  await waitForDatabase();
  await acAddOrUpdateJid(TEST_GROUP, "oui");
  await acSetCountryCodes(TEST_GROUP, ["234", "92"]);

  let removedParticipants = [];
  let sentMessages = [];

  const fakeMenma = {
    user: { id: "224000000000:1@s.whatsapp.net" },
    ws: { readyState: 1 },
    groupMetadata: async () => ({
      id: TEST_GROUP,
      subject: "Test Anti-Country Group",
      participants: [
        { id: "224000000000@s.whatsapp.net", admin: "admin" }, // Bot is admin
        { id: "224612414116@s.whatsapp.net", admin: "superadmin" }, // Owner
      ],
    }),
    groupParticipantsUpdate: async (jid, pList, action) => {
      if (action === "remove") {
        removedParticipants.push(...pList);
      }
    },
    sendMessage: async (jid, content) => {
      sentMessages.push({ jid, content });
    },
  };

  // Case 1: Member joining with blocked code 234800000000 (should be kicked)
  await group_participants_update(
    {
      id: TEST_GROUP,
      participants: [{ id: "234800000000@s.whatsapp.net" }],
      action: "add",
      author: "224612414116@s.whatsapp.net",
    },
    fakeMenma
  );

  assert.ok(
    removedParticipants.includes("234800000000@s.whatsapp.net"),
    "Should kick user with blocked country code 234"
  );

  // Case 2: Member joining with non-blocked code 33600000000 (should NOT be kicked)
  removedParticipants = [];
  await group_participants_update(
    {
      id: TEST_GROUP,
      participants: [{ id: "33600000000@s.whatsapp.net" }],
      action: "add",
      author: "224612414116@s.whatsapp.net",
    },
    fakeMenma
  );
  assert.equal(
    removedParticipants.length,
    0,
    "Should not kick user with allowed country code"
  );

  await Anticountry.destroy({ where: { id: TEST_GROUP } });
});

test("Anticountry configuration exports and imports properly", async () => {
  await waitForDatabase();
  await acAddOrUpdateJid(TEST_GROUP, "oui");
  await acSetCountryCodes(TEST_GROUP, ["234", "212"]);

  const exported = await exportGroupConfig(TEST_GROUP);
  assert.ok(exported.protections.anticountry, "Export should include anticountry");
  assert.equal(exported.protections.anticountry.status, "oui");
  assert.deepEqual(exported.protections.anticountry.countryCodes, ["234", "212"]);

  const audit = await auditGroupSecurity(TEST_GROUP);
  assert.ok(audit.score > 0);

  // Import into a target group
  const TARGET_GROUP = "120363888888888888@g.us";
  const importResult = await importGroupConfig(TARGET_GROUP, exported);
  assert.equal(importResult.success, true);
  assert.ok(importResult.updated.includes("anticountry"));

  const targetStatus = await acVerifStatutJid(TARGET_GROUP);
  const targetCodes = await acGetCountryCodes(TARGET_GROUP);
  assert.equal(targetStatus, "oui");
  assert.deepEqual(targetCodes, ["234", "212"]);

  // Clean up
  await Anticountry.destroy({ where: { id: TEST_GROUP } });
  await Anticountry.destroy({ where: { id: TARGET_GROUP } });
});
