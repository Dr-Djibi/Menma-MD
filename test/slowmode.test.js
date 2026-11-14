import test from 'node:test';
import assert from 'node:assert/strict';
import { Slowmode, smAddOrUpdateJid, smUpdateAction, smVerifStatutJid, smRecupActionJid, smGetDelay } from '../Database/slowmode.js';
import { waitForDatabase, markTableReady } from '../Database/ready.js';
import { commands } from '../lib/menmacmd.js';
import '../commandes/groupe.js';
import { messages_upsert } from '../lib/events/message_upsert.js';
import { exportGroupConfig, importGroupConfig, auditGroupSecurity } from '../lib/groupConfigHelper.js';

// Pre-mark DB tables not used in unit test to avoid readiness timeout
markTableReady('Session');
markTableReady('Theme');

test('Slowmode database operations work correctly', async () => {
    await waitForDatabase();
    const testJid = '120363999999999001@g.us';

    // Test initial default status
    const initialStatus = await smVerifStatutJid(testJid);
    assert.equal(initialStatus, 'non');

    const initialDelay = await smGetDelay(testJid);
    assert.equal(initialDelay, 0);

    const initialAction = await smRecupActionJid(testJid);
    assert.equal(initialAction, 'supp');

    // Test activation / delay update
    await smAddOrUpdateJid(testJid, 15);
    const updatedStatus = await smVerifStatutJid(testJid);
    assert.equal(updatedStatus, 'oui');

    const updatedDelay = await smGetDelay(testJid);
    assert.equal(updatedDelay, 15);

    // Test action update
    await smUpdateAction(testJid, 'warn');
    const updatedAction = await smRecupActionJid(testJid);
    assert.equal(updatedAction, 'warn');

    // Test disable
    await smAddOrUpdateJid(testJid, 0);
    const disabledStatus = await smVerifStatutJid(testJid);
    assert.equal(disabledStatus, 'non');

    // Cleanup
    await Slowmode.destroy({ where: { id: testJid } });
});

test('Slowmode command executes subcommands correctly', async () => {
    await waitForDatabase();
    const cmd = commands.find(c => c.name === 'slowmode');
    assert.ok(cmd, 'Slowmode command should be registered');

    const groupJid = '120363888888888001@g.us';
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
        menma: mockMenma,
        prefixe: '.'
    };

    // Test set duration '10s'
    await cmd.fonction(groupJid, mockMenma, { ...options, arg: ['10s'] });
    let delay = await smGetDelay(groupJid);
    assert.equal(delay, 10);

    // Test set duration '1m'
    await cmd.fonction(groupJid, mockMenma, { ...options, arg: ['1m'] });
    delay = await smGetDelay(groupJid);
    assert.equal(delay, 60);

    // Test change action 'kick'
    await cmd.fonction(groupJid, mockMenma, { ...options, arg: ['kick'] });
    let action = await smRecupActionJid(groupJid);
    assert.equal(action, 'kick');

    // Test disable 'off'
    await cmd.fonction(groupJid, mockMenma, { ...options, arg: ['off'] });
    delay = await smGetDelay(groupJid);
    assert.equal(delay, 0);

    // Cleanup
    await Slowmode.destroy({ where: { id: groupJid } });
});

test('Slowmode message_upsert rate limits rapid messages from non-admin users', async () => {
    await waitForDatabase();
    const groupJid = '120363777777777001@g.us';
    const userJid = '224611111111@s.whatsapp.net';

    // Activate slowmode with 10s delay and 'supp' action
    await smAddOrUpdateJid(groupJid, 10);
    await smUpdateAction(groupJid, 'supp');

    let deletedKeys = [];
    let sentMessages = [];

    const mockMenma = {
        user: { id: '224600000000:1@s.whatsapp.net' },
        config: { OWNER: '224600000000' },
        groupMetadata: async () => ({
            id: groupJid,
            subject: 'Slowmode Test Group',
            participants: [
                { id: '224600000000@s.whatsapp.net', admin: 'admin' },
                { id: userJid, admin: null }
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
                participant: userJid
            },
            message: { conversation: 'Fast message ' + msgId },
            messageTimestamp: Math.floor(Date.now() / 1000)
        }]
    });

    // Send 1st message (allowed, initializes slowmode timestamp)
    await messages_upsert(createMsg('SLOW_1'), mockMenma);
    assert.equal(deletedKeys.length, 0);

    // Send 2nd message immediately (violates 10s slowmode cooldown)
    await messages_upsert(createMsg('SLOW_2'), mockMenma);
    assert.equal(deletedKeys.length, 1);
    assert.equal(deletedKeys[0].id, 'SLOW_2');
    assert.ok(sentMessages.some(m => m.includes('mode lent est actif')));

    // Cleanup
    await Slowmode.destroy({ where: { id: groupJid } });
});

test('Slowmode config export, import, and audit integration works', async () => {
    await waitForDatabase();
    const groupJid = '120363666666666001@g.us';

    await smAddOrUpdateJid(groupJid, 20);
    await smUpdateAction(groupJid, 'warn');

    // Test Export
    const exported = await exportGroupConfig(groupJid);
    assert.ok(exported.protections.slowmode);
    assert.equal(exported.protections.slowmode.status, 'oui');
    assert.equal(exported.protections.slowmode.delay, 20);
    assert.equal(exported.protections.slowmode.action, 'warn');

    // Test Import
    const targetJid = '120363555555555001@g.us';
    const importResult = await importGroupConfig(targetJid, exported);
    assert.equal(importResult.success, true);
    assert.ok(importResult.updated.includes('slowmode'));

    const importedDelay = await smGetDelay(targetJid);
    const importedAction = await smRecupActionJid(targetJid);
    assert.equal(importedDelay, 20);
    assert.equal(importedAction, 'warn');

    // Test Audit
    const audit = await auditGroupSecurity(groupJid, { isBotAdmin: true });
    assert.ok(audit.score > 0);
    assert.ok(audit.checks.some(c => c.name === 'Filtres Additionnels'));

    // Cleanup
    await Slowmode.destroy({ where: { id: groupJid } });
    await Slowmode.destroy({ where: { id: targetJid } });
});
