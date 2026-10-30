import test from 'node:test';
import assert from 'node:assert/strict';
import { AntiDelete, setAntiDeleteStatus } from '../Database/antidelete.js';
import { messages_delete } from '../lib/events/message_delete.js';

test('messages_delete triggers even when message is deleted by owner/bot', async () => {
    await AntiDelete.sync();
    // Set global antidelete status to all
    await setAntiDeleteStatus('all', 'global');

    let sentMessages = [];
    const mockMenma = {
        user: { id: '123456789:1@s.whatsapp.net' },
        config: { OWNER: '123456789' },
        sendMessage: async (dest, content, opts) => {
            sentMessages.push({ dest, content, opts });
            return { key: { id: 'msg_id' } };
        }
    };

    // Populate antideleteCache
    global.antideleteCache = new Map();
    const testKeyId = 'test_msg_001';
    const testMsg = {
        key: { id: testKeyId, remoteJid: 'status@broadcast', participant: '987654321@s.whatsapp.net' },
        message: { conversation: 'Deleted status message' }
    };
    global.antideleteCache.set(testKeyId, testMsg);

    // Simulate delete event where deleter is the owner/bot JID
    const deletePayload = {
        keys: [{
            id: testKeyId,
            remoteJid: 'status@broadcast',
            participant: '123456789@s.whatsapp.net' // Deleted by owner/bot
        }]
    };

    // We invoke messages_delete
    await messages_delete(deletePayload, mockMenma);

    // Verify sent messages count (1 notification + 1 forward = 2)
    assert.equal(sentMessages.length, 2);
    assert.ok(sentMessages[0].content.text.length > 0);
});
