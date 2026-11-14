import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fusionSessions } from '../commandes/conversion.js';

test('fusionSessions map exists and handles session state operations', () => {
    assert.ok(fusionSessions instanceof Map, 'fusionSessions should be a Map');

    const dummyUserId = '123456789@s.whatsapp.net';
    fusionSessions.set(dummyUserId, {
        type: 'image',
        filePath: '/tmp/test_img.jpg',
        timestamp: Date.now()
    });

    assert.equal(fusionSessions.has(dummyUserId), true);
    const session = fusionSessions.get(dummyUserId);
    assert.equal(session.type, 'image');
    assert.equal(session.filePath, '/tmp/test_img.jpg');

    fusionSessions.delete(dummyUserId);
    assert.equal(fusionSessions.has(dummyUserId), false);
});

test('conversion module imports fusion command successfully', async () => {
    const module = await import('../commandes/conversion.js');
    assert.ok(module.fusionSessions !== undefined);
});
