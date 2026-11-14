import test from 'node:test';
import assert from 'node:assert/strict';

import '../commandes/groupe.js';
import { commands } from '../lib/menmacmd.js';
import { recordUserActivity, UserActivityDB } from '../Database/user_activity.js';

test('topactive command registration and alias check', () => {
    const cmd = commands.find(c => c.name === 'topactive' || (c.alias && c.alias.includes('topmsg')));
    assert.ok(cmd, 'topactive command should be registered in commands list');
    assert.equal(cmd.classe, 'groupe');
    assert.ok(cmd.alias.includes('topmsg'));
    assert.ok(cmd.alias.includes('active'));
    assert.ok(cmd.alias.includes('activity'));
    assert.ok(cmd.alias.includes('topmembres'));
});

test('topactive command restricts execution outside group', async () => {
    const cmd = commands.find(c => c.name === 'topactive' || (c.alias && c.alias.includes('topmsg')));

    let response = '';
    const repondre = (msg) => { response = msg; };

    await cmd.fonction('chat123@s.whatsapp.net', {}, {
        verif_Gp: false,
        repondre
    });

    assert.equal(response, 'Cette commande est utilisable uniquement en groupe.');
});

test('topactive command displays leaderboard with correct message counts and ranks', async () => {
    const cmd = commands.find(c => c.name === 'topactive' || (c.alias && c.alias.includes('topmsg')));

    await UserActivityDB.sync();
    await UserActivityDB.destroy({ where: { groupId: 'group_topactive_1' } });

    // Record activity for members
    await recordUserActivity('group_topactive_1', '224111111111'); // 1 msg
    await recordUserActivity('group_topactive_1', '224222222222');
    await recordUserActivity('group_topactive_1', '224222222222'); // 2 msgs
    await recordUserActivity('group_topactive_1', '224333333333');
    await recordUserActivity('group_topactive_1', '224333333333');
    await recordUserActivity('group_topactive_1', '224333333333'); // 3 msgs

    let sentPayload = null;

    const mockMenma = {
        sendMessage: async (jid, content, options) => {
            sentPayload = { jid, content, options };
        }
    };

    const mockMembers = [
        { id: '224111111111@s.whatsapp.net', admin: false },
        { id: '224222222222@s.whatsapp.net', admin: false },
        { id: '224333333333@s.whatsapp.net', admin: false }
    ];

    await cmd.fonction('group_topactive_1', mockMenma, {
        verif_Gp: true,
        mbre_membre: mockMembers,
        arg: [],
        repondre: () => {},
        resolveName: (jid) => jid.split('@')[0],
        ms: { key: { id: 'msg1' } }
    });

    assert.ok(sentPayload, 'Should send topactive payload');
    assert.ok(sentPayload.content.text.includes('🥇 *224333333333* : 3 message(s)'), 'First place should have 3 messages');
    assert.ok(sentPayload.content.text.includes('🥈 *224222222222* : 2 message(s)'), 'Second place should have 2 messages');
    assert.ok(sentPayload.content.text.includes('🥉 *224111111111* : 1 message(s)'), 'Third place should have 1 message');
});

test('topactive command displays individual member activity when mentioned or replied to', async () => {
    const cmd = commands.find(c => c.name === 'topactive' || (c.alias && c.alias.includes('topmsg')));

    await UserActivityDB.sync();
    await UserActivityDB.destroy({ where: { groupId: 'group_topactive_2' } });

    await recordUserActivity('group_topactive_2', '224999999999');
    await recordUserActivity('group_topactive_2', '224999999999');
    await recordUserActivity('group_topactive_2', '224999999999'); // 3 msgs

    let sentPayload = null;

    const mockMenma = {
        sendMessage: async (jid, content, options) => {
            sentPayload = { jid, content, options };
        }
    };

    const mockMembers = [
        { id: '224999999999@s.whatsapp.net', admin: false }
    ];

    await cmd.fonction('group_topactive_2', mockMenma, {
        verif_Gp: true,
        mbre_membre: mockMembers,
        mr: ['224999999999@s.whatsapp.net'],
        arg: [],
        repondre: () => {},
        resolveName: (jid) => 'UserTest',
        ms: { key: { id: 'msg2' } }
    });

    assert.ok(sentPayload, 'Should send individual member activity payload');
    assert.ok(sentPayload.content.text.includes('UserTest'), 'Should show resolved user name');
    assert.ok(sentPayload.content.text.includes('3'), 'Should show message count 3');
    assert.ok(sentPayload.content.text.includes('#1'), 'Should show rank #1');
});
