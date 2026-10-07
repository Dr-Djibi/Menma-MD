import test from "node:test";
import assert from "node:assert/strict";

// We import extra.js to ensure the module registers without error
import "../commandes/extra.js";
import { commands } from "../lib/menmacmd.js";

test("calculate command works safely with safeEvalMath", async () => {
    const calcCmd = commands.find(c => c.name === "calc" || c.name === "calculate" || (c.alias && c.alias.includes("calc")));
    assert.ok(calcCmd, "calculate command should be registered");

    let replyText = "";
    const fakeRepondre = (msg) => {
        replyText = msg;
    };

    // Test valid calculation: 2 + 3 * 4
    await calcCmd.fonction("123@s.whatsapp.net", {}, {
        arg: ["2", "+", "3", "*", "4"],
        repondre: fakeRepondre,
        prefixe: "."
    });

    assert.match(replyText, /14/, "2 + 3 * 4 should evaluate to 14");

    // Test calculation with parentheses and precedence
    await calcCmd.fonction("123@s.whatsapp.net", {}, {
        arg: ["(2", "+", "3)", "*", "4"],
        repondre: fakeRepondre,
        prefixe: "."
    });

    assert.match(replyText, /20/, "(2 + 3) * 4 should evaluate to 20");

    // Test code injection attempt: process.exit()
    await calcCmd.fonction("123@s.whatsapp.net", {}, {
        arg: ["process.exit()"],
        repondre: fakeRepondre,
        prefixe: "."
    });

    // Should return error message instead of executing process.exit()
    assert.doesNotMatch(replyText, /20/, "Injected expression should fail safely");
});
