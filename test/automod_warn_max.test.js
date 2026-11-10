import test from 'node:test';
import assert from 'node:assert/strict';
import { Antispam, aspAddOrUpdateJid, aspUpdateAction } from '../Database/antispam.js';
import { WarnDB, WarnConfigDB, setMaxWarns, getMaxWarns, getWarnCount } from '../Database/warns.js';
import { waitForDatabase, markTableReady } from '../Database/ready.js';
import { messages_upsert } from '../lib/events/message_upsert.js';

// Pre-mark unused tables to prevent waiting timeouts in isolated test run
markTableReady('Session');
markTableReady('Theme');
markTableReady('GroupEvents');
markTableReady('GroupRules');
markTableReady('ScheduledMute');

test('Auto-moderation respects custom maxWarns configured for the group', async (t) => {
    await waitForDatabase();

    const groupJid = '120363999988887777@g.us';
    const spammerNum = '224699990001';
    const spammerJid = `${spammerNum}@s.whatsapp.net`;

    await WarnDB.sync();
    await WarnConfigDB.sync();
    await WarnDB.destroy({ where: { groupId: groupJid } });
    await WarnConfigDB.destroy({ where: { groupId: groupJid } });
    await Antispam.destroy({ where: { id: groupJid } });

    // Set group warn threshold to 4 instead of default 3
    await setMaxWarns(groupJid, 4);
    const configuredMax = await getMaxWarns(groupJid);
    assert.equal(configuredMax, 4);

    // Set Antispam active with 'warn' action
    await aspAddOrUpdateJid(groupJid, 'oui');
    await aspUpdateAction(groupJid, 'warn');

    let sentMessages = [];
    let removedParticipants = [];

    const mockMenma = {
        user: { id: '224600000000:1@s.whatsapp.net' },
        config: { OWNER: '224600000000' },
        groupMetadata: async () => ({
            id: groupJid,
            subject: 'Automod Warn Threshold Test Group',
            participants: [
                { id: '224600000000@s.whatsapp.net', admin: 'admin' },
                { id: spammerJid, admin: null }
            ]
        }),
        sendMessage: async (jid, msg) => {
            if (msg.text) {
                sentMessages.push(msg.text);
            }
        },
        groupParticipantsUpdate: async (jid, participants, action) => {
            if (action === 'remove') {
                removedParticipants.push(...participants);
            }
        }
    };

    const createSpamMsg = (msgId) => ({
        type: 'notify',
        messages: [{
            key: {
                remoteJid: groupJid,
                fromMe: false,
                id: msgId,
                participant: spammerJid
            },
            message: { conversation: 'spam content ' + msgId },
            messageTimestamp: Math.floor(Date.now() / 1000)
        }]
    });

    // 1st cycle: send 3 rapid messages -> triggers 1st warn
    await messages_upsert(createSpamMsg('SPAM_BATCH1_1'), mockMenma);
    await messages_upsert(createSpamMsg('SPAM_BATCH1_2'), mockMenma);
    await messages_upsert(createSpamMsg('SPAM_BATCH1_3'), mockMenma);

    let count = await getWarnCount(groupJid, spammerNum);
    assert.equal(count, 1);
    assert.ok(
        sentMessages.some(m => m.includes('(1/4)')),
        `Message should contain "(1/4)", but sentMessages: ${JSON.stringify(sentMessages)}`
    );
    assert.equal(removedParticipants.length, 0);

    // 2nd cycle: send 3 rapid messages -> triggers 2nd warn
    await messages_upsert(createSpamMsg('SPAM_BATCH2_1'), mockMenma);
    await messages_upsert(createSpamMsg('SPAM_BATCH2_2'), mockMenma);
    await messages_upsert(createSpamMsg('SPAM_BATCH2_3'), mockMenma);

    count = await getWarnCount(groupJid, spammerNum);
    assert.equal(count, 2);
    assert.ok(
        sentMessages.some(m => m.includes('(2/4)')),
        `Message should contain "(2/4)", but sentMessages: ${JSON.stringify(sentMessages)}`
    );
    assert.equal(removedParticipants.length, 0);

    // 3rd cycle: send 3 rapid messages -> triggers 3rd warn (previously, hardcoded 3 would have kicked here)
    await messages_upsert(createSpamMsg('SPAM_BATCH3_1'), mockMenma);
    await messages_upsert(createSpamMsg('SPAM_BATCH3_2'), mockMenma);
    await messages_upsert(createSpamMsg('SPAM_BATCH3_3'), mockMenma);

    count = await getWarnCount(groupJid, spammerNum);
    assert.equal(count, 3);
    assert.ok(
        sentMessages.some(m => m.includes('(3/4)')),
        `Message should contain "(3/4)", but sentMessages: ${JSON.stringify(sentMessages)}`
    );
    // User should NOT be removed at 3 when max is 4
    assert.equal(removedParticipants.length, 0, 'User should not be expelled at 3 warns when max is 4');

    // 4th cycle: send 3 rapid messages -> triggers 4th warn and reaches maxWarns
    await messages_upsert(createSpamMsg('SPAM_BATCH4_1'), mockMenma);
    await messages_upsert(createSpamMsg('SPAM_BATCH4_2'), mockMenma);
    await messages_upsert(createSpamMsg('SPAM_BATCH4_3'), mockMenma);

    assert.ok(
        sentMessages.some(m => m.includes('4 avertissements. Éjection !')),
        `Kick message should indicate 4 avertissements, got: ${JSON.stringify(sentMessages)}`
    );
    assert.equal(removedParticipants.length, 1);
    assert.equal(removedParticipants[0], spammerJid);

    // Warns should be reset upon expulsion
    count = await getWarnCount(groupJid, spammerNum);
    assert.equal(count, 0);

    // Cleanup
    await WarnDB.destroy({ where: { groupId: groupJid } });
    await WarnConfigDB.destroy({ where: { groupId: groupJid } });
    await Antispam.destroy({ where: { id: groupJid } });
});
