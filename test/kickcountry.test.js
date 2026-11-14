import test from "node:test";
import assert from "node:assert/strict";

// Import command file to register kickcountry
import "../commandes/outils.js";
import { commands } from "../lib/menmacmd.js";

test("kickcountry command works and protects admins/sudos/devs", async () => {
    const kickCountryCmd = commands.find(c =>
        c.name === "kickcountry" ||
        (c.alias && c.alias.includes("kickprefix"))
    );

    assert.ok(kickCountryCmd, "kickcountry command should be registered");

    let replyText = "";
    const fakeRepondre = (msg) => {
        replyText = typeof msg === "string" ? msg : (msg.text || JSON.stringify(msg));
    };

    let removedJids = [];
    const fakeMenma = {
        user: { id: "224000000000:1@s.whatsapp.net" },
        groupParticipantsUpdate: async (jid, participants, action) => {
            if (action === "remove") {
                removedJids = participants;
            }
        }
    };

    // 1. Test when not in a group
    await kickCountryCmd.fonction("123@g.us", fakeMenma, {
        verif_Gp: false,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["234"],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /groupe/i, "Should reject if not in group");

    // 2. Test when user is not admin
    replyText = "";
    await kickCountryCmd.fonction("123@g.us", fakeMenma, {
        verif_Gp: true,
        verif_Admin: false,
        verif_menmaAdmin: true,
        arg: ["234"],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /admin/i, "Should reject if sender is not admin");

    // 3. Test when bot is not admin
    replyText = "";
    await kickCountryCmd.fonction("123@g.us", fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: false,
        arg: ["234"],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /administrateur/i, "Should reject if bot is not admin");

    // 4. Test missing argument
    replyText = "";
    await kickCountryCmd.fonction("123@g.us", fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: [],
        repondre: fakeRepondre,
        prefixe: "."
    });
    assert.match(replyText, /kickcountry/i, "Should output usage when no country code provided");

    // 5. Test valid country kick filtering (protecting admins and kicking matching prefix)
    replyText = "";
    removedJids = [];

    const mockMembers = [
        { id: "2348011111111@s.whatsapp.net", admin: false }, // Should be kicked (234 prefix)
        { id: "2348022222222@s.whatsapp.net", admin: true },  // Admin with 234 -> Protected!
        { id: "212600000000@s.whatsapp.net", admin: false },  // 212 prefix -> Kept (unless 212 requested)
        { id: "2348033333333@s.whatsapp.net", admin: false }, // Should be kicked (234 prefix)
        { id: "224000000000@s.whatsapp.net", admin: false }   // Bot ID -> Protected!
    ];

    await kickCountryCmd.fonction("123@g.us", fakeMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        arg: ["234"],
        mbre_membre: mockMembers,
        repondre: fakeRepondre,
        prefixe: "."
    });

    assert.equal(removedJids.length, 2, "Should kick exactly 2 non-admin members with 234 prefix");
    assert.ok(removedJids.includes("2348011111111@s.whatsapp.net"), "Should contain first 234 user");
    assert.ok(removedJids.includes("2348033333333@s.whatsapp.net"), "Should contain second 234 user");
    assert.match(replyText, /2/i, "Reply should mention 2 members kicked");
});
