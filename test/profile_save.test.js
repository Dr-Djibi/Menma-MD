import test from 'node:test';
import assert from 'node:assert/strict';
import { commands } from '../lib/menmacmd.js';
import '../commandes/fun.js';
import '../commandes/status.js';

test('profile command resolves target by phone number and sends result exclusively to user DM', async () => {
    const profileCmd = commands.find(c => c.name === 'profile');
    assert.ok(profileCmd, 'profile command must be registered');
    assert.equal(!profileCmd.react, true, 'profile command should have no automatic reaction for silence');

    let sentMessages = [];
    const mockMenma = {
        sendMessage: async (dest, content, opts) => {
            sentMessages.push({ dest, content, opts });
            return { key: { id: 'sent_id' } };
        },
        profilePictureUrl: async (jid, type) => {
            assert.equal(jid, '33612345678@s.whatsapp.net');
            return 'https://example.com/pp.jpg';
        },
        fetchStatus: async (jid) => {
            assert.equal(jid, '33612345678@s.whatsapp.net');
            return { status: 'Hello World Bio' };
        }
    };

    const groupJid = '123456789-group@g.us';
    const userJid = '22461234567@s.whatsapp.net';
    const ms = { key: { remoteJid: groupJid, id: 'cmd_msg' } };

    await profileCmd.fonction(groupJid, mockMenma, {
        repondre: () => { throw new Error('repondre should not be called'); },
        mr: [],
        auteur_Msg_Repondu: '',
        auteur_Message: userJid,
        ms,
        arg: ['+33 6 12 34 56 78'],
        resolveName: (jid) => 'Test User'
    });

    // Verify messages: sent ONLY to userJid (DM) and never to groupJid or target
    assert.equal(sentMessages.length, 1);
    assert.equal(sentMessages[0].dest, userJid);
    assert.ok(sentMessages[0].content.image, 'Should send image');
    assert.equal(sentMessages[0].content.image.url, 'https://example.com/pp.jpg');
    assert.ok(sentMessages[0].content.caption.includes('Hello World Bio'));
    assert.ok(sentMessages[0].content.caption.includes('33612345678'));

    const sentToGroupOrTarget = sentMessages.some(m => m.dest === groupJid || m.dest === '33612345678@s.whatsapp.net');
    assert.equal(sentToGroupOrTarget, false, 'No message should be sent to group or target');
});

test('profile command sends error only to user DM when profile fetch fails', async () => {
    const profileCmd = commands.find(c => c.name === 'profile');
    let sentMessages = [];
    const mockMenma = {
        sendMessage: async (dest, content, opts) => {
            sentMessages.push({ dest, content, opts });
            return { key: { id: 'sent_id' } };
        },
        profilePictureUrl: async () => {
            throw new Error('Not found');
        },
        fetchStatus: async () => {
            throw new Error('Not found');
        }
    };

    const groupJid = '123456789-group@g.us';
    const userJid = '22461234567@s.whatsapp.net';
    const ms = { key: { remoteJid: groupJid, id: 'cmd_msg' } };

    await profileCmd.fonction(groupJid, mockMenma, {
        repondre: () => {},
        mr: [],
        auteur_Msg_Repondu: '',
        auteur_Message: userJid,
        ms,
        arg: ['999999999'],
        resolveName: () => ''
    });

    assert.equal(sentMessages.length, 1);
    assert.equal(sentMessages[0].dest, userJid);
    assert.equal(sentMessages.some(m => m.dest === groupJid), false);
});

test('save command saves quoted message to user DM and keeps public group silent', async () => {
    const saveCmd = commands.find(c => c.name === 'save');
    assert.ok(saveCmd, 'save command must be registered');
    assert.equal(!saveCmd.react, true, 'save command should have no automatic reaction for silence');

    let sentMessages = [];
    const mockMenma = {
        sendMessage: async (dest, content, opts) => {
            sentMessages.push({ dest, content, opts });
            return { key: { id: 'sent_id' } };
        }
    };

    const groupJid = '987654321-group@g.us';
    const userJid = '22461234567@s.whatsapp.net';
    const quotedAuthor = '33799999999@s.whatsapp.net';

    const ms = {
        key: { remoteJid: groupJid, id: 'save_cmd_msg' },
        message: {
            extendedTextMessage: {
                text: '.save',
                contextInfo: {
                    stanzaId: 'stanza_abc',
                    participant: quotedAuthor
                }
            }
        }
    };

    const msg_Repondu = {
        conversation: 'Secret message to save'
    };

    await saveCmd.fonction(groupJid, mockMenma, {
        ms,
        msg_Repondu,
        auteur_Message: userJid
    });

    assert.equal(sentMessages.length, 2);
    // Message 1: forward to user DM
    assert.equal(sentMessages[0].dest, userJid);
    assert.deepEqual(sentMessages[0].content, {
        forward: {
            key: { remoteJid: groupJid, id: 'stanza_abc', participant: quotedAuthor },
            message: msg_Repondu
        }
    });

    // Message 2: confirmation in user DM
    assert.equal(sentMessages[1].dest, userJid);
    assert.equal(sentMessages[1].content.text, '✅ Sauvegardé en DM');

    // Never notify the public group or the quoted author
    const sentToGroup = sentMessages.some(m => m.dest === groupJid || m.dest === quotedAuthor);
    assert.equal(sentToGroup, false, 'No message should be sent to public chat or target');
});

test('save command sends usage error only to user DM when no message is quoted', async () => {
    const saveCmd = commands.find(c => c.name === 'save');
    let sentMessages = [];
    const mockMenma = {
        sendMessage: async (dest, content, opts) => {
            sentMessages.push({ dest, content, opts });
            return { key: { id: 'sent_id' } };
        }
    };

    const groupJid = '987654321-group@g.us';
    const userJid = '22461234567@s.whatsapp.net';
    const ms = { key: { remoteJid: groupJid, id: 'save_cmd_msg' } };

    await saveCmd.fonction(groupJid, mockMenma, {
        ms,
        msg_Repondu: null,
        auteur_Message: userJid
    });

    assert.equal(sentMessages.length, 1);
    assert.equal(sentMessages[0].dest, userJid);
    assert.equal(sentMessages.some(m => m.dest === groupJid), false);
});
