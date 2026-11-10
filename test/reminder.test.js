import { test, describe, before, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  Reminder,
  createReminder,
  getUserReminders,
  deleteReminder,
  getDueReminders,
  markReminderCompleted,
  checkAndTriggerReminders,
  startReminderRunner,
  stopReminderRunner,
} from '../Database/reminder.js';
import { parseReminderDuration } from '../commandes/remind.js';
import { commands, loadPlugins } from '../lib/menmacmd.js';

describe('Reminder System Tests', () => {
  const testUser = '224600112233';
  const testChat = '120363000000000001@g.us';

  before(async () => {
    // S'assurer que le modèle est synchronisé avant d'exécuter les tests
    await Reminder.sync();
  });

  beforeEach(async () => {
    await Reminder.destroy({ where: { chatId: testChat } });
  });

  afterEach(async () => {
    stopReminderRunner();
    await Reminder.destroy({ where: { chatId: testChat } });
  });

  test('parseReminderDuration parses valid inputs and rejects invalid ones', () => {
    assert.equal(parseReminderDuration(''), null);
    assert.equal(parseReminderDuration('invalid'), null);
    assert.equal(parseReminderDuration('0m'), null);
    assert.equal(parseReminderDuration('-5s'), null);

    const sec = parseReminderDuration('30s');
    assert.ok(sec);
    assert.equal(sec.ms, 30000);
    assert.equal(sec.formatted, '30s');

    const min = parseReminderDuration('15m');
    assert.ok(min);
    assert.equal(min.ms, 15 * 60 * 1000);
    assert.equal(min.formatted, '15 min');

    const hr = parseReminderDuration('2h');
    assert.ok(hr);
    assert.equal(hr.ms, 2 * 3600 * 1000);
    assert.equal(hr.formatted, '2 h');

    const day = parseReminderDuration('1d');
    assert.ok(day);
    assert.equal(day.ms, 24 * 3600 * 1000);
    assert.equal(day.formatted, '1 j');
  });

  test('Database CRUD operations work correctly for reminders', async () => {
    // 1. Initial list empty
    let list = await getUserReminders(testUser, testChat);
    assert.equal(list.length, 0);

    // 2. Create reminder
    const targetTime = Date.now() + 60000;
    const r1 = await createReminder({
      userId: testUser,
      chatId: testChat,
      message: 'Acheter du pain',
      targetTime,
    });

    assert.ok(r1.id);
    assert.equal(r1.userId, testUser);
    assert.equal(r1.message, 'Acheter du pain');
    assert.equal(r1.status, 'pending');

    // 3. getUserReminders returns newly created reminder
    list = await getUserReminders(testUser, testChat);
    assert.equal(list.length, 1);
    assert.equal(list[0].id, r1.id);

    // 4. Delete reminder
    const deleted = await deleteReminder(r1.id, testUser);
    assert.equal(deleted, true);

    list = await getUserReminders(testUser, testChat);
    assert.equal(list.length, 0);
  });

  test('checkAndTriggerReminders delivers due reminders and marks them completed', async () => {
    // Crée un rappel qui est déjà échu (passé)
    const pastTime = Date.now() - 5000;
    const r = await createReminder({
      userId: testUser,
      chatId: testChat,
      message: 'Prendre mes vitamines',
      targetTime: pastTime,
    });

    let sentMessage = null;
    const mockMenma = {
      sendMessage: async (jid, content) => {
        sentMessage = { jid, content };
      },
    };

    const count = await checkAndTriggerReminders(mockMenma);
    assert.equal(count, 1);
    assert.ok(sentMessage);
    assert.equal(sentMessage.jid, testChat);
    assert.ok(sentMessage.content.text.includes('Prendre mes vitamines'));
    assert.ok(sentMessage.content.mentions.includes(`${testUser}@s.whatsapp.net`));

    // Vérifier que le statut est passé à 'completed'
    const dueAfter = await getDueReminders();
    const stillDue = dueAfter.find((item) => item.id === r.id);
    assert.equal(stillDue, undefined);
  });

  test('remind command creates, lists, and cancels reminders correctly', async () => {
    await loadPlugins();
    const remindCmd = commands.find(
      (c) => c.name === 'remind' || (c.alias && c.alias.includes('rappel'))
    );
    assert.ok(remindCmd);

    let replies = [];
    const repondre = async (msg) => {
      replies.push(msg);
    };

    const fakeOptions = {
      arg: ['10m', 'Réunion', 'Zoom'],
      repondre,
      auteur_Message: `${testUser}@s.whatsapp.net`,
      prefixe: '.',
      ms: { key: { participant: `${testUser}@s.whatsapp.net` } },
    };

    // 1. Création via la commande
    await remindCmd.fonction(testChat, {}, fakeOptions);
    const createReply = replies[replies.length - 1];
    assert.ok(createReply.includes('Réunion Zoom'));
    assert.ok(createReply.includes('10 min'));

    let active = await getUserReminders(testUser, testChat);
    assert.equal(active.length, 1);
    const createdId = active[0].id;

    // 2. Liste via la commande
    fakeOptions.arg = ['list'];
    await remindCmd.fonction(testChat, {}, fakeOptions);
    const listReply = replies[replies.length - 1];
    assert.ok(listReply.includes(`Réunion Zoom`));

    // 3. Suppression via la commande
    fakeOptions.arg = ['del', String(createdId)];
    await remindCmd.fonction(testChat, {}, fakeOptions);
    const delReply = replies[replies.length - 1];
    assert.ok(delReply.includes('annulé avec succès'));

    active = await getUserReminders(testUser, testChat);
    assert.equal(active.length, 0);
  });
});
