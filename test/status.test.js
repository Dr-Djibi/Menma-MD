import test from 'node:test';
import assert from 'node:assert/strict';
import { getBotJid, getStatusParticipants, postStatusToWhatsApp } from '../commandes/status.js';

test('getBotJid extracts normalized JID correctly from sock user object', () => {
    const mockMenma = { user: { id: '123456789:12@s.whatsapp.net' } };
    const botJid = getBotJid(mockMenma);
    assert.equal(botJid, '123456789@s.whatsapp.net');
});

test('getStatusParticipants includes bot JID and target JIDs', () => {
    const mockMenma = {
        user: { id: '123456789@s.whatsapp.net' },
        store: {
            contacts: {
                '111@s.whatsapp.net': { id: '111@s.whatsapp.net' }
            }
        }
    };
    const participants = getStatusParticipants(mockMenma, ['222@s.whatsapp.net']);
    assert.ok(participants.includes('123456789@s.whatsapp.net'));
    assert.ok(participants.includes('111@s.whatsapp.net'));
    assert.ok(participants.includes('222@s.whatsapp.net'));
});

test('postStatusToWhatsApp passes correct options including statusJidList, broadcast and participant', async () => {
    let sentTo = null;
    let sentContent = null;
    let sentOptions = null;

    const mockMenma = {
        user: { id: '123456789@s.whatsapp.net' },
        sendMessage: async (jid, content, options) => {
            sentTo = jid;
            sentContent = content;
            sentOptions = options;
            return { key: { id: 'test_id' } };
        }
    };

    await postStatusToWhatsApp(mockMenma, { text: 'Hello Status' });

    assert.equal(sentTo, 'status@broadcast');
    assert.equal(sentContent.text, 'Hello Status');
    assert.equal(sentOptions.broadcast, true);
    assert.equal(sentOptions.participant, '123456789@s.whatsapp.net');
    assert.ok(Array.isArray(sentOptions.statusJidList));
    assert.ok(sentOptions.statusJidList.includes('123456789@s.whatsapp.net'));
});

test('messages_upsert resolves author correctly for status@broadcast without returning Inconnu ()', async () => {
    const { messages_upsert } = await import('../lib/events/message_upsert.js');

    const logs = [];
    const origLog = console.log;
    console.log = (...args) => {
        logs.push(args.join(' '));
        origLog(...args);
    };

    try {
        const mockMenma = {
            user: { id: '224612414116@s.whatsapp.net' },
            config: {
                NOM_BOT: 'MENMA-MD',
                NOM_OWNER: 'Dr Djibi',
                OWNER: '224612414116',
                NUMERO_DEV: '224612414116',
                PREFIX: '🔮'
            },
            sendMessage: async () => ({})
        };

        // 1. Outgoing status message (fromMe = true, key.participant undefined)
        const outgoingStatusPayload = {
            type: 'notify',
            messages: [{
                key: {
                    remoteJid: 'status@broadcast',
                    fromMe: true,
                    id: 'STATUS_TEST_1'
                },
                message: {
                    extendedTextMessage: { text: 'salut' }
                },
                messageTimestamp: Math.floor(Date.now() / 1000)
            }]
        };

        await messages_upsert(outgoingStatusPayload, mockMenma);

        const outgoingAuthorLog = logs.find(l => l.includes('AUTEUR'));
        assert.ok(outgoingAuthorLog, 'Log should contain AUTEUR line');
        assert.ok(!outgoingAuthorLog.includes('Inconnu ()'), 'Outgoing status author should not be Inconnu ()');
        assert.ok(outgoingAuthorLog.includes('224612414116'), 'Outgoing status author should contain bot/owner number');

        // 2. Incoming status message from contact (fromMe = false, key.participant defined)
        logs.length = 0;
        const incomingStatusPayload = {
            type: 'notify',
            messages: [{
                key: {
                    remoteJid: 'status@broadcast',
                    fromMe: false,
                    participant: '237692227432@s.whatsapp.net',
                    id: 'STATUS_TEST_2'
                },
                pushName: 'Vanina',
                message: {
                    extendedTextMessage: { text: 'Je ne pense pas' }
                },
                messageTimestamp: Math.floor(Date.now() / 1000)
            }]
        };

        await messages_upsert(incomingStatusPayload, mockMenma);

        const incomingAuthorLog = logs.find(l => l.includes('AUTEUR'));
        assert.ok(incomingAuthorLog, 'Log should contain AUTEUR line');
        assert.ok(!incomingAuthorLog.includes('Inconnu ()'), 'Incoming status author should not be Inconnu ()');
        assert.ok(incomingAuthorLog.includes('Vanina'), 'Incoming status author should contain pushName');
        assert.ok(incomingAuthorLog.includes('237692227432'), 'Incoming status author should contain participant number');
    } finally {
        console.log = origLog;
    }
});
