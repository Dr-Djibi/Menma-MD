import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BanDB,
  AntibanDB,
  addBan,
  removeBan,
  isBanned,
  getBanList,
  clearBans,
  setAntibanStatus,
  getAntibanStatus,
  setAntibanAction,
  getAntibanAction,
} from '../Database/ban.js';
import { commands } from '../lib/menmacmd.js';
import '../commandes/ban.js';
import { messages_upsert } from '../lib/events/message_upsert.js';

test('Ban and Antiban database operations and edge cases', async (t) => {
  const testGroup = 'banGroup123@g.us';
  const user1 = '224600000001';
  const user2 = '224600000002';

  await BanDB.sync();
  await AntibanDB.sync();
  await BanDB.destroy({ where: {} });
  await AntibanDB.destroy({ where: {} });

  await t.test('isBanned returns false for unbanned user', async () => {
    const banned = await isBanned(testGroup, user1);
    assert.equal(banned, false);
  });

  await t.test('addBan adds user to ban list', async () => {
    await addBan(testGroup, user1, 'Spamming links', 'AdminTest');
    const banned = await isBanned(testGroup, user1);
    assert.equal(banned, true);

    const list = await getBanList(testGroup);
    assert.equal(list.length, 1);
    assert.equal(list[0].userId, user1);
    assert.equal(list[0].reason, 'Spamming links');
    assert.equal(list[0].bannedBy, 'AdminTest');
  });

  await t.test('removeBan removes user from ban list', async () => {
    const removed = await removeBan(testGroup, user1);
    assert.equal(removed, true);

    const banned = await isBanned(testGroup, user1);
    assert.equal(banned, false);

    const nonExistent = await removeBan(testGroup, user2);
    assert.equal(nonExistent, false);
  });

  await t.test('clearBans removes all bans for a group', async () => {
    await addBan(testGroup, user1, 'Reason 1');
    await addBan(testGroup, user2, 'Reason 2');
    assert.equal((await getBanList(testGroup)).length, 2);

    await clearBans(testGroup);
    assert.equal((await getBanList(testGroup)).length, 0);
  });

  await t.test('setAntibanStatus and setAntibanAction work correctly', async () => {
    assert.equal(await getAntibanStatus(testGroup), 'non');
    assert.equal(await getAntibanAction(testGroup), 'kick');

    await setAntibanStatus(testGroup, 'oui');
    assert.equal(await getAntibanStatus(testGroup), 'oui');

    await setAntibanAction(testGroup, 'supp');
    assert.equal(await getAntibanAction(testGroup), 'supp');

    await setAntibanStatus(testGroup, 'off');
    assert.equal(await getAntibanStatus(testGroup), 'non');
  });

  await BanDB.destroy({ where: {} });
  await AntibanDB.destroy({ where: {} });
});

test('Ban moderation commands execution and protection logic', async (t) => {
  const testGroup = 'banGroupCmd@g.us';
  const targetUser = '224699999999';
  const targetJid = `${targetUser}@s.whatsapp.net`;

  await BanDB.sync();
  await AntibanDB.sync();
  await BanDB.destroy({ where: {} });
  await AntibanDB.destroy({ where: {} });

  const banCmd = commands.find(c => c.name === 'ban');
  const unbanCmd = commands.find(c => c.name === 'unban');
  const banlistCmd = commands.find(c => c.name === 'banlist');
  const antibanCmd = commands.find(c => c.name === 'antiban');

  assert.ok(banCmd, 'ban command should be registered');
  assert.ok(unbanCmd, 'unban command should be registered');
  assert.ok(banlistCmd, 'banlist command should be registered');
  assert.ok(antibanCmd, 'antiban command should be registered');

  await t.test('.ban command bans a user and sends notification', async () => {
    let sentMsg = null;
    let removedParticipant = null;

    const mockMenma = {
      user: { id: '224611111111:1@s.whatsapp.net' },
      groupParticipantsUpdate: async (groupJid, participants, action) => {
        if (action === 'remove') {
          removedParticipant = participants[0];
        }
      },
      sendMessage: async (jid, msg) => {
        sentMsg = msg;
      }
    };

    let replyMsg = null;
    const com_options = {
      repondre: (msg) => { replyMsg = msg; },
      verif_Gp: true,
      verif_Admin: true,
      verif_menmaAdmin: true,
      arg: [targetUser, 'Insulting', 'members'],
      auteur_Message: '224611111111@s.whatsapp.net',
      resolveName: () => 'AdminUser',
      admins: ['224611111111@s.whatsapp.net']
    };

    await banCmd.fonction(testGroup, mockMenma, com_options);

    assert.equal(removedParticipant, targetJid);
    assert.ok(sentMsg);
    assert.ok(sentMsg.text.includes(targetUser));
    assert.ok(sentMsg.text.includes('Raison'));
    assert.equal(await isBanned(testGroup, targetUser), true);
  });

  await t.test('.ban command protects admins from being banned', async () => {
    let replyMsg = null;
    const adminUser = '224622222222';
    const adminJid = `${adminUser}@s.whatsapp.net`;

    const mockMenma = {
      user: { id: '224611111111:1@s.whatsapp.net' },
      sendMessage: async () => {}
    };

    const com_options = {
      repondre: (msg) => { replyMsg = msg; },
      verif_Gp: true,
      verif_Admin: true,
      verif_menmaAdmin: true,
      arg: [adminUser],
      auteur_Message: '224611111111@s.whatsapp.net',
      admins: [adminJid]
    };

    await banCmd.fonction(testGroup, mockMenma, com_options);
    assert.ok(replyMsg.includes('Impossible de bannir un administrateur'));
  });

  await t.test('.banlist command displays list of banned members', async () => {
    let sentMsg = null;
    const mockMenma = {
      sendMessage: async (jid, msg) => { sentMsg = msg; }
    };

    const com_options = {
      repondre: (msg) => {},
      verif_Gp: true,
      resolveName: (jid) => jid.split('@')[0]
    };

    await banlistCmd.fonction(testGroup, mockMenma, com_options);
    assert.ok(sentMsg);
    assert.ok(sentMsg.text.includes(targetUser));
    assert.ok(sentMsg.text.includes('Raison'));
  });

  await t.test('.unban command unbans a user', async () => {
    let sentMsg = null;
    const mockMenma = {
      sendMessage: async (jid, msg) => { sentMsg = msg; }
    };

    const com_options = {
      repondre: (msg) => {},
      verif_Gp: true,
      verif_Admin: true,
      arg: [targetUser]
    };

    await unbanCmd.fonction(testGroup, mockMenma, com_options);
    assert.ok(sentMsg);
    assert.ok(sentMsg.text.includes('retiré de la liste des membres bannis'));
    assert.equal(await isBanned(testGroup, targetUser), false);
  });

  await BanDB.destroy({ where: {} });
  await AntibanDB.destroy({ where: {} });
});

test('Antiban enforcement in message_upsert filters messages from banned users', async (t) => {
  const groupJid = 'antibanEnforce@g.us';
  const bannedUserNum = '224688888888';
  const bannedUserJid = `${bannedUserNum}@s.whatsapp.net`;

  await BanDB.sync();
  await AntibanDB.sync();
  await BanDB.destroy({ where: {} });
  await AntibanDB.destroy({ where: {} });

  await addBan(groupJid, bannedUserNum, 'Repeated offenses');
  await setAntibanStatus(groupJid, 'oui');
  await setAntibanAction(groupJid, 'kick');

  let deletedKey = null;
  let sentSanctionMsg = null;
  let kickedParticipant = null;

  const mockMenma = {
    user: { id: '224600000000:1@s.whatsapp.net', lid: '224600000000@lid' },
    config: { NOM_BOT: 'Menma', OWNER: ['224611111111'], NUMERO_DEV: ['224611111111'] },
    groupMetadata: async () => ({
      id: groupJid,
      subject: 'Antiban Group Test',
      participants: [
        { id: '224600000000@s.whatsapp.net', admin: 'admin' },
        { id: bannedUserJid, admin: null }
      ]
    }),
    groupParticipantsUpdate: async (jid, participants, action) => {
      if (action === 'remove') {
        kickedParticipant = participants[0];
      }
    },
    sendMessage: async (jid, content) => {
      if (content && content.delete) {
        deletedKey = content.delete;
      } else if (content && content.text) {
        sentSanctionMsg = content.text;
      }
    }
  };

  const fakeMessage = {
    type: 'notify',
    messages: [
      {
        key: {
          remoteJid: groupJid,
          fromMe: false,
          id: 'MSG_BANNED_123',
          participant: bannedUserJid
        },
        messageTimestamp: Math.floor(Date.now() / 1000),
        message: {
          conversation: 'Bonjour tout le monde !'
        }
      }
    ]
  };

  await messages_upsert(fakeMessage, mockMenma);

  assert.ok(deletedKey, 'Banned user message key should be deleted');
  assert.equal(deletedKey.id, 'MSG_BANNED_123');
  assert.ok(sentSanctionMsg, 'Sanction notification message should be sent');
  assert.ok(sentSanctionMsg.includes('banni') || sentSanctionMsg.includes('retiré'));
  assert.equal(kickedParticipant, bannedUserJid);

  await BanDB.destroy({ where: {} });
  await AntibanDB.destroy({ where: {} });
});
