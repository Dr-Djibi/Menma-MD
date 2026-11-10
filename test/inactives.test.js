import test from 'node:test';
import assert from 'node:assert/strict';

import '../commandes/groupe.js';
import { commands } from '../lib/menmacmd.js';
import { recordUserActivity, UserActivityDB } from '../Database/user_activity.js';

test('inactives command registration and alias check', () => {
    const cmd = commands.find(c => c.name === 'inactives' || (c.alias && c.alias.includes('ghosts')));
    assert.ok(cmd, 'inactives command should be registered in commands list');
    assert.equal(cmd.classe, 'groupe');
    assert.ok(cmd.alias.includes('ghosts'));
    assert.ok(cmd.alias.includes('inactifs'));
});

test('inactives command restricts execution outside group', async () => {
    const cmd = commands.find(c => c.name === 'inactives' || (c.alias && c.alias.includes('ghosts')));

    let response = '';
    const repondre = (msg) => { response = msg; };

    await cmd.fonction('chat123@s.whatsapp.net', {}, {
        verif_Gp: false,
        verif_Admin: true,
        repondre
    });

    assert.equal(response, 'Cette commande est utilisable uniquement en groupe.');
});

test('inactives command restricts non-admin execution', async () => {
    const cmd = commands.find(c => c.name === 'inactives' || (c.alias && c.alias.includes('ghosts')));

    let response = '';
    const repondre = (msg) => { response = msg; };

    await cmd.fonction('group123@g.us', {}, {
        verif_Gp: true,
        verif_Admin: false,
        repondre
    });

    assert.equal(response, 'Cette commande est réservée aux administrateurs.');
});

test('inactives command lists only zero-message members and ignores active members', async () => {
    const cmd = commands.find(c => c.name === 'inactives' || (c.alias && c.alias.includes('ghosts')));

    await UserActivityDB.sync();
    await UserActivityDB.destroy({ where: {} });

    // Record activity for member 224333333333 so they are active
    await recordUserActivity('group123@g.us', '224333333333');

    let sentPayload = null;
    let fallbackReply = null;

    const mockMenma = {
        user: { id: '224000000000:1@s.whatsapp.net' },
        sendMessage: async (jid, content, options) => {
            sentPayload = { jid, content, options };
        }
    };

    const repondre = (msg) => { fallbackReply = msg; };

    const mockMembers = [
        { id: '224000000000@s.whatsapp.net', admin: false }, // Bot itself
        { id: '224111111111@s.whatsapp.net', admin: 'admin' }, // Admin
        { id: '224333333333@s.whatsapp.net', admin: false }, // ACTIVE member (1 msg)
        { id: '224444444444@s.whatsapp.net', admin: false }  // INACTIVE member (0 msgs)
    ];

    await cmd.fonction('group123@g.us', mockMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        mbre_membre: mockMembers,
        arg: [],
        repondre,
        prefixe: '.',
        resolveName: (jid) => jid.split('@')[0],
        ms: { key: { id: 'msg1' } }
    });

    assert.ok(sentPayload, 'Should send formatted list message');
    assert.match(sentPayload.content.text, /MEMBRES/i);
    assert.doesNotMatch(sentPayload.content.text, /\(@224444444444\)/, 'Output should not repeat mention/number in parentheses');
    assert.ok(sentPayload.content.text.includes('*224444444444* - 0 msg'), 'Output should format name cleanly without extra parentheses');
    assert.ok(sentPayload.content.mentions.includes('224444444444@s.whatsapp.net'), 'Inactive member should be listed');
    assert.equal(sentPayload.content.mentions.includes('224333333333@s.whatsapp.net'), false, 'Active member must NOT be listed');
    assert.equal(sentPayload.content.mentions.includes('224111111111@s.whatsapp.net'), false, 'Admins must be protected');
    assert.equal(sentPayload.content.mentions.includes('224000000000@s.whatsapp.net'), false, 'Bot must be protected');
});

test('inactives command kick action expels only zero-message ghost members', async () => {
    const cmd = commands.find(c => c.name === 'inactives' || (c.alias && c.alias.includes('ghosts')));

    await UserActivityDB.sync();
    await UserActivityDB.destroy({ where: {} });

    // 224333333333 is active
    await recordUserActivity('group123@g.us', '224333333333');

    let kickedJids = null;
    let response = '';

    const mockMenma = {
        user: { id: '224000000000:1@s.whatsapp.net' },
        groupParticipantsUpdate: async (jid, participants, action) => {
            if (action === 'remove') kickedJids = participants;
        }
    };

    const repondre = (msg) => { response = msg; };

    const mockMembers = [
        { id: '224111111111@s.whatsapp.net', admin: 'admin' },
        { id: '224333333333@s.whatsapp.net', admin: false }, // active
        { id: '224555555555@s.whatsapp.net', admin: false }  // ghost (0 msgs)
    ];

    await cmd.fonction('group123@g.us', mockMenma, {
        verif_Gp: true,
        verif_Admin: true,
        verif_menmaAdmin: true,
        mbre_membre: mockMembers,
        arg: ['kick'],
        repondre,
        prefixe: '.',
        ms: { key: { id: 'msg1' } }
    });

    assert.deepEqual(kickedJids, ['224555555555@s.whatsapp.net']);
    assert.match(response, /1.*membre\(s\)/);
});
