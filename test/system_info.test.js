import test from "node:test";
import assert from "node:assert/strict";

import { markTableReady } from "../Database/ready.js";

// Mark expected tables as ready to avoid database timeout wait
const EXPECTED_TABLES = [
    'Session', 'Settings', 'Sudo', 'Antibot', 'Theme', 'StickerCommand',
    'LidStore', 'GroupEvents', 'Antilien', 'Chatbot', 'Presence', 'Antispam',
    'WarnDB', 'Antimentiongc', 'Antitag', 'AntiDelete', 'Writemode',
    'ChatSettings', 'Antichain', 'Antiword', 'BanDB', 'GroupRules', 'UserActivity'
];
EXPECTED_TABLES.forEach(markTableReady);

import "../commandes/maintenance.js";
import { commands } from "../lib/menmacmd.js";

test("system command registration and diagnostic output test", async () => {
    // 1. Verify command registration and aliases
    const sysCmd = commands.find(c => c.name === "system");
    assert.ok(sysCmd, "system command should be registered in commands");
    assert.deepStrictEqual(sysCmd.alias, ["sysinfo", "stats", "sys"]);
    assert.strictEqual(sysCmd.classe, "owner");

    // 2. Non-owner/dev restriction
    let nonOwnerResponse = "";
    await sysCmd.fonction("123456789@s.whatsapp.net", {}, {
        repondre: (msg) => { nonOwnerResponse = msg; },
        dev_id: false
    });
    assert.strictEqual(nonOwnerResponse, "❌ Cette commande est réservée au propriétaire.");

    // 3. Execution by owner/dev
    let sysOutput = "";
    const fakeMessage = {
        messageTimestamp: Math.floor((Date.now() - 150) / 1000)
    };

    await sysCmd.fonction("123456789@s.whatsapp.net", {}, {
        repondre: (msg) => { sysOutput = msg; },
        dev_id: true,
        ms: fakeMessage
    });

    assert.ok(sysOutput.includes("Latence Réseau"), "Output should contain network latency");
    assert.ok(sysOutput.includes("RAM Processus"), "Output should contain process RAM");
    assert.ok(sysOutput.includes("RAM Système"), "Output should contain system RAM");
    assert.ok(sysOutput.includes("CPU"), "Output should contain CPU info");
    assert.ok(sysOutput.includes("Base de données"), "Output should contain database status");

});
