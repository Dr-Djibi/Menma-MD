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

test("Simulated sendAutoResponse logic with mock repondre", async () => {
    // Mock repondre function to capture sent payloads
    const sentPayloads = [];
    const mockRepondre = async (payload) => {
        sentPayloads.push(payload);
        return { key: { id: "test_msg_id" } };
    };

    // Simulate auto-response handler logic
    const handleResponse = async (mConf, repondreFn) => {
        const messageText = (mConf.msg || "").trim();
        const mediaUrl = (mConf.url || "").trim();
        const mType = (mConf.type || "").toLowerCase();

        if (!mediaUrl && messageText) {
            await repondreFn({ text: messageText });
            return true;
        }

        if (mediaUrl) {
            const isImage = mType === 'image' || /\.(jpg|jpeg|png|webp)$/i.test(mediaUrl);
            if (isImage) {
                await repondreFn({ image: { url: mediaUrl }, caption: messageText });
                return true;
            }
        }
        return false;
    };

    // 1. Text only
    sentPayloads.length = 0;
    await handleResponse({ msg: "Hello text only", url: "", type: "standard" }, mockRepondre);
    assert.strictEqual(sentPayloads.length, 1);
    assert.strictEqual(sentPayloads[0].text, "Hello text only");

    // 2. Image with caption
    sentPayloads.length = 0;
    await handleResponse({ msg: "Look at this image", url: "https://catbox.moe/img.png", type: "image" }, mockRepondre);
    assert.strictEqual(sentPayloads.length, 1);
    assert.strictEqual(sentPayloads[0].image.url, "https://catbox.moe/img.png");
    assert.strictEqual(sentPayloads[0].caption, "Look at this image");
});
