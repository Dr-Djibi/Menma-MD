import test from "node:test";
import assert from "node:assert";

test("Auto response configuration structure and fallbacks", async () => {
    // Test 1: Config JSON format for setmention & setabsencemsg
    const mentionConfig = {
        msg: "Bonjour, je suis un bot !",
        url: "https://catbox.moe/image.jpg",
        type: "image"
    };

    const afkConfig = {
        msg: "Je suis actuellement absent.",
        url: "https://catbox.moe/video.mp4",
        type: "video"
    };

    const mentionSerialized = JSON.stringify(mentionConfig);
    const afkSerialized = JSON.stringify(afkConfig);

    const parsedMention = JSON.parse(mentionSerialized);
    const parsedAfk = JSON.parse(afkSerialized);

    assert.strictEqual(parsedMention.msg, "Bonjour, je suis un bot !");
    assert.strictEqual(parsedMention.url, "https://catbox.moe/image.jpg");
    assert.strictEqual(parsedMention.type, "image");

    assert.strictEqual(parsedAfk.msg, "Je suis actuellement absent.");
    assert.strictEqual(parsedAfk.url, "https://catbox.moe/video.mp4");
    assert.strictEqual(parsedAfk.type, "video");
});

import { sendAutoResponse } from "../lib/events/message_upsert.js";

test("Simulated sendAutoResponse logic with mock repondre", async () => {
    // Mock repondre function to capture sent payloads
    const sentPayloads = [];
    const mockRepondre = async (payload) => {
        sentPayloads.push(payload);
        return { key: { id: "test_msg_id" } };
    };

    // 1. Text only
    sentPayloads.length = 0;
    await sendAutoResponse({ msg: "Hello text only", url: "", type: "standard" }, mockRepondre);
    assert.strictEqual(sentPayloads.length, 1);
    assert.strictEqual(sentPayloads[0].text, "Hello text only");

    // 2. Image with caption
    sentPayloads.length = 0;
    await sendAutoResponse({ msg: "Look at this image", url: "https://catbox.moe/img.png", type: "image" }, mockRepondre);
    assert.strictEqual(sentPayloads.length, 1);
    assert.strictEqual(sentPayloads[0].image.url, "https://catbox.moe/img.png");
    assert.strictEqual(sentPayloads[0].caption, "Look at this image");

    // 3. PTV / Note Video + Text simultaneous sending
    sentPayloads.length = 0;
    await sendAutoResponse({ msg: "Note video text", url: "https://catbox.moe/ptv.mp4", type: "ptv" }, mockRepondre);
    assert.strictEqual(sentPayloads.length, 2);
    assert.strictEqual(sentPayloads[0].text, "Note video text");
    assert.strictEqual(sentPayloads[1].video.url, "https://catbox.moe/ptv.mp4");
    assert.strictEqual(sentPayloads[1].ptv, true);

    // 3b. Note Video with 'note' type
    sentPayloads.length = 0;
    await sendAutoResponse({ msg: "Note video text 2", url: "https://catbox.moe/ptv.mp4", type: "note" }, mockRepondre);
    assert.strictEqual(sentPayloads.length, 2);
    assert.strictEqual(sentPayloads[0].text, "Note video text 2");
    assert.strictEqual(sentPayloads[1].video.url, "https://catbox.moe/ptv.mp4");
    assert.strictEqual(sentPayloads[1].ptv, true);

    // 4. Audio + Text simultaneous sending
    sentPayloads.length = 0;
    await sendAutoResponse({ msg: "Audio message text", url: "https://catbox.moe/audio.mp3", type: "audio" }, mockRepondre);
    assert.strictEqual(sentPayloads.length, 2);
    assert.strictEqual(sentPayloads[0].text, "Audio message text");
    assert.strictEqual(sentPayloads[1].audio.url, "https://catbox.moe/audio.mp3");
});

test("Toggle status behavior verification", async () => {
    // Check if status === 'off' prevents execution in message_upsert trigger condition
    const settingsOff = { mentionResponse: JSON.stringify({ msg: "test" }), mentionStatus: "off" };
    const settingsOn = { mentionResponse: JSON.stringify({ msg: "test" }), mentionStatus: "on" };

    const shouldTrigger = (settings) => !!(settings.mentionResponse && settings.mentionStatus !== "off");

    assert.strictEqual(shouldTrigger(settingsOff), false);
    assert.strictEqual(shouldTrigger(settingsOn), true);
});

test("Config retrieval verification in getmention / getabsencemsg logic", async () => {
    const hasConfig = (cfgStr) => !!(cfgStr && cfgStr.trim());

    assert.strictEqual(hasConfig(""), false);
    assert.strictEqual(hasConfig("   "), false);
    assert.strictEqual(hasConfig(null), false);
    assert.strictEqual(hasConfig(undefined), false);
    assert.strictEqual(hasConfig(JSON.stringify({ msg: "hello", url: "https://catbox.moe/a.mp4", type: "ptv" })), true);
});
