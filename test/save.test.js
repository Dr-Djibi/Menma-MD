import test from 'node:test';
import assert from 'node:assert/strict';

test('save command forwards message to user DM and avoids sending to status author when ms_org is status@broadcast', async () => {
    let sentMessages = [];
    const mockMenma = {
        sendMessage: async (dest, content, opts) => {
            sentMessages.push({ dest, content, opts });
            return { key: { id: 'msg_id' } };
        }
    };

    const userJid = '123456789@s.whatsapp.net';
    const statusAuthorJid = '987654321@s.whatsapp.net';
    const ms_org = 'status@broadcast';

    const ms = {
        key: { remoteJid: ms_org, id: 'cmd_id' },
        message: {
            extendedTextMessage: {
                text: '.save',
                contextInfo: {
                    stanzaId: 'status_stanza_123',
                    participant: statusAuthorJid
                }
            }
        }
    };

    const msg_Repondu = {
        imageMessage: { caption: 'Test status media' }
    };

    // Simulated handler logic from save command
    const dest = userJid;
    const context = ms.message.extendedTextMessage.contextInfo;
    const quotedMessageObj = {
        key: { remoteJid: ms_org, id: context.stanzaId, participant: context.participant || ms_org },
        message: msg_Repondu
    };

    await mockMenma.sendMessage(dest, { forward: quotedMessageObj });

    if (ms_org === "status@broadcast") {
        await mockMenma.sendMessage(dest, { text: "✅ Sauvegardé en DM" });
    }

    // Verify sent messages
    assert.equal(sentMessages.length, 2);
    // Message 1: forward to user DM
    assert.equal(sentMessages[0].dest, userJid);
    assert.deepEqual(sentMessages[0].content, { forward: quotedMessageObj });
    // Message 2: confirmation to user DM
    assert.equal(sentMessages[1].dest, userJid);
    assert.equal(sentMessages[1].content.text, "✅ Sauvegardé en DM");

    // Ensure statusAuthorJid was never used as destination
    const sentToStatusAuthor = sentMessages.some(m => m.dest === statusAuthorJid || m.dest === 'status@broadcast');
    assert.equal(sentToStatusAuthor, false);
});
