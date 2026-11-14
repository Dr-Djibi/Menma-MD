import test from 'node:test';
import assert from 'node:assert/strict';
import { Antispam, aspAddOrUpdateJid, aspUpdateAction, aspVerifStatutJid, aspRecupActionJid } from '../Database/antispam.js';
import { waitForDatabase, markTableReady } from '../Database/ready.js';
import { commands } from '../lib/menmacmd.js';
import '../commandes/groupe.js';
import { messages_upsert } from '../lib/events/message_upsert.js';

// Pre-mark DB tables not used in unit test to avoid 30s readiness timeout
markTableReady('Session');
markTableReady('Theme');

test('Antispam database operations work correctly', async () => {
    await waitForDatabase();
    const testJid = '120363999999999999@g.us';

    // Test initial default status
    const initialStatus = await aspVerifStatutJid(testJid);
    assert.equal(initialStatus, 'non');

    const initialAction = await aspRecupActionJid(testJid);
    assert.equal(initialAction, 'supp');

    // Test activation / update status
    await aspAddOrUpdateJid(testJid, 'oui');
    const updatedStatus = await aspVerifStatutJid(testJid);
    assert.equal(updatedStatus, 'oui');

    // Test action update
    await aspUpdateAction(testJid, 'kick');
    const updatedAction = await aspRecupActionJid(testJid);
    assert.equal(updatedAction, 'kick');

    // Cleanup
    await Antispam.destroy({ where: { id: testJid } });
});

test('Antispam command executes subcommands correctly', async () => {
    await waitForDatabase();
    const cmd = commands.find(c => c.name === 'antispam');
    assert.ok(cmd, 'Antispam command should be registered');

    const groupJid = '120363888888888888@g.us';
    let lastReply = '';
    const mockRepondre = async (msg) => {
        lastReply = typeof msg === 'string' ? msg : (msg.text || '');
    };

    const mockMenma = {
        user: { id: '224600000000:1@s.whatsapp.net' },
        config: { OWNER: '224600000000' },
        sendMessage: async () => {}
    };

    const options = {
        ms_org: groupJid,
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        repondre: mockRepondre,
        menma: mockMenma
    };

    // Test 'on' subcommand
    await cmd.fonction(groupJid, mockMenma, { ...options, arg: ['on'] });
    let status = await aspVerifStatutJid(groupJid);
    assert.equal(status, 'oui');

    // Test 'warn' subcommand
    await cmd.fonction(groupJid, mockMenma, { ...options, arg: ['warn'] });
    let action = await aspRecupActionJid(groupJid);
    assert.equal(action, 'warn');

    // Test 'off' subcommand
    await cmd.fonction(groupJid, mockMenma, { ...options, arg: ['off'] });
    status = await aspVerifStatutJid(groupJid);
    assert.equal(status, 'non');

    // Cleanup
    await Antispam.destroy({ where: { id: groupJid } });
});

test('Antispam message_upsert filters rapid spam messages', async () => {
    await waitForDatabase();
    const groupJid = '120363777777777777@g.us';
    const spakmerJid = '224655555555@s.whatsapp.net';

    // Activate antispam with 'supp' action
    await aspAddOrUpdateJid(groupJid, 'oui');
    await aspUpdateAction(groupJid, 'supp');

    let deletedKeys = [];
    let sentMessages = [];

    const mockMenma = {
        user: { id: '224600000000:1@s.whatsapp.net' },
        config: { OWNER: '224600000000' },
        groupMetadata: async () => ({
            id: groupJid,
            subject: 'Spam Test Group',
            participants: [
                { id: '224600000000@s.whatsapp.net', admin: 'admin' },
                { id: spakmerJid, admin: null }
            ]
        }),
        sendMessage: async (jid, msg) => {
            if (msg.delete) {
                deletedKeys.push(msg.delete);
            } else if (msg.text) {
                sentMessages.push(msg.text);
            }
        }
    };

    const createMsg = (msgId) => ({
        type: 'notify',
        messages: [{
            key: {
                remoteJid: groupJid,
                fromMe: false,
                id: msgId,
                participant: spakmerJid
            },
            message: { conversation: 'spam message ' + msgId },
            messageTimestamp: Math.floor(Date.now() / 1000)
        }]
    });

    // Send 1st and 2nd message (below threshold >= 3)
    await messages_upsert(createMsg('SPAM_1'), mockMenma);
    await messages_upsert(createMsg('SPAM_2'), mockMenma);
    assert.equal(deletedKeys.length, 0);

    // Send 3rd message (triggers threshold >= 3)
    await messages_upsert(createMsg('SPAM_3'), mockMenma);
    assert.equal(deletedKeys.length, 1);
    assert.equal(deletedKeys[0].id, 'SPAM_3');
    assert.ok(sentMessages.some(m => m.includes('spam de messages est interdit')));

    // Cleanup
    await Antispam.destroy({ where: { id: groupJid } });
});
