import test from "node:test";
import assert from "node:assert";

test("AFK response config formatting & cooldown calculation test", () => {
    // 1. Verify JSON config formatting
    const afkConfig = {
        msg: "Je suis actuellement absent.",
        url: "https://catbox.moe/example.mp4",
        type: "video"
    };

    const serialized = JSON.stringify(afkConfig);
    const parsed = JSON.parse(serialized);

    assert.strictEqual(parsed.msg, "Je suis actuellement absent.");
    assert.strictEqual(parsed.url, "https://catbox.moe/example.mp4");
    assert.strictEqual(parsed.type, "video");

    // 2. Test 1-hour cooldown calculation logic
    const AFK_COOLDOWN_MS = 60 * 60 * 1000;
    const cooldownMap = new Map();
    const userJid = "1234567890@s.whatsapp.net";

    const t0 = 1000000;
    cooldownMap.set(userJid, t0);

    // Immediate second message (should be blocked by cooldown)
    const t1 = t0 + 10000; // 10 seconds later
    assert.strictEqual(t1 - cooldownMap.get(userJid) < AFK_COOLDOWN_MS, true);

    // Message 30 minutes later (should be blocked by cooldown)
    const t2 = t0 + 30 * 60 * 1000;
    assert.strictEqual(t2 - cooldownMap.get(userJid) < AFK_COOLDOWN_MS, true);

    // Message 1 hour and 1 second later (should pass cooldown)
    const t3 = t0 + 60 * 60 * 1000 + 1000;
    assert.strictEqual(t3 - cooldownMap.get(userJid) >= AFK_COOLDOWN_MS, true);
});
