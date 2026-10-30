import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  setScheduledMute,
  getScheduledMute,
  deleteScheduledMute,
  getAllScheduledMutes,
  checkAndApplyScheduledMutes,
  stopScheduledMuteRunner
} from '../Database/scheduled_mute.js';
import { exportGroupConfig, importGroupConfig } from '../lib/groupConfigHelper.js';
import { commands, loadPlugins } from '../lib/menmacmd.js';

describe('Scheduled Mute System Tests', () => {
  const testGroup = '120363999999999999@g.us';

  beforeEach(async () => {
    await deleteScheduledMute(testGroup);
  });

  afterEach(async () => {
    stopScheduledMuteRunner();
    await deleteScheduledMute(testGroup);
  });

  test('setScheduledMute, getScheduledMute, deleteScheduledMute, and getAllScheduledMutes work correctly', async () => {
    // 1. Initially should be null
    let config = await getScheduledMute(testGroup);
    assert.equal(config, null);

    // 2. Set schedule
    await setScheduledMute(testGroup, {
      status: 'oui',
      muteTime: '23:00',
      unmuteTime: '06:00',
      timezone: 'UTC'
    });

    config = await getScheduledMute(testGroup);
    assert.ok(config);
    assert.equal(config.groupId, testGroup);
    assert.equal(config.status, 'oui');
    assert.equal(config.muteTime, '23:00');
    assert.equal(config.unmuteTime, '06:00');

    // 3. Appears in getAllScheduledMutes
    const all = await getAllScheduledMutes();
    const found = all.find(item => item.groupId === testGroup);
    assert.ok(found);
    assert.equal(found.muteTime, '23:00');

    // 4. Delete schedule
    const deleted = await deleteScheduledMute(testGroup);
    assert.equal(deleted, true);

    config = await getScheduledMute(testGroup);
    assert.equal(config, null);
  });

  test('checkAndApplyScheduledMutes triggers groupSettingUpdate when current UTC time matches muteTime', async () => {
    const now = new Date();
    const currentHH = String(now.getUTCHours()).padStart(2, '0');
    const currentMM = String(now.getUTCMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHH}:${currentMM}`;

    await setScheduledMute(testGroup, {
      status: 'oui',
      muteTime: currentTimeStr,
      unmuteTime: '11:11',
      timezone: 'UTC'
    });

    let groupSettingUpdateCalledWith = null;
    let sentMessage = null;

    const mockMenma = {
      groupSettingUpdate: async (jid, setting) => {
        groupSettingUpdateCalledWith = { jid, setting };
      },
      sendMessage: async (jid, msg) => {
        sentMessage = { jid, msg };
      }
    };

    await checkAndApplyScheduledMutes(mockMenma);

    assert.ok(groupSettingUpdateCalledWith);
    assert.equal(groupSettingUpdateCalledWith.jid, testGroup);
    assert.equal(groupSettingUpdateCalledWith.setting, 'announcement');
    assert.ok(sentMessage);
    assert.ok(sentMessage.msg.text.includes('Fermeture programmée'));

    // Check lastAction was updated to 'mute'
    const updatedRecord = await getScheduledMute(testGroup);
    assert.equal(updatedRecord.lastAction, 'mute');
  });

  test('exportGroupConfig and importGroupConfig include scheduled mute configuration', async () => {
    await setScheduledMute(testGroup, {
      status: 'oui',
      muteTime: '21:30',
      unmuteTime: '06:30',
      timezone: 'UTC'
    });

    const exported = await exportGroupConfig(testGroup);
    assert.ok(exported.protections.scheduledMute);
    assert.equal(exported.protections.scheduledMute.status, 'oui');
    assert.equal(exported.protections.scheduledMute.muteTime, '21:30');
    assert.equal(exported.protections.scheduledMute.unmuteTime, '06:30');

    // Test import to a new target group
    const targetGroup = '120363888888888888@g.us';
    await deleteScheduledMute(targetGroup);

    const importRes = await importGroupConfig(targetGroup, exported);
    assert.equal(importRes.success, true);
    assert.ok(importRes.updated.includes('scheduledMute'));

    const importedConfig = await getScheduledMute(targetGroup);
    assert.ok(importedConfig);
    assert.equal(importedConfig.status, 'oui');
    assert.equal(importedConfig.muteTime, '21:30');
    assert.equal(importedConfig.unmuteTime, '06:30');

    await deleteScheduledMute(targetGroup);
  });

  test('automute command configures scheduled mute correctly', async () => {
    await loadPlugins();
    const automuteCmd = commands.find(c => c.name === 'automute');
    assert.ok(automuteCmd);

    let lastReply = null;
    const repondre = async (msg) => {
      lastReply = msg;
    };

    // 1. Set schedule via command
    await automuteCmd.fonction(testGroup, {}, {
      verif_Gp: true,
      verif_Admin: true,
      verif_menmaAdmin: true,
      arg: ['22:00', '07:00'],
      repondre,
      prefixe: '.'
    });

    assert.ok(lastReply);
    assert.ok(lastReply.includes('22:00'));

    const dbRecord = await getScheduledMute(testGroup);
    assert.ok(dbRecord);
    assert.equal(dbRecord.status, 'oui');
    assert.equal(dbRecord.muteTime, '22:00');
    assert.equal(dbRecord.unmuteTime, '07:00');

    // 2. Disable schedule via command
    await automuteCmd.fonction(testGroup, {}, {
      verif_Gp: true,
      verif_Admin: true,
      verif_menmaAdmin: true,
      arg: ['off'],
      repondre,
      prefixe: '.'
    });

    assert.ok(lastReply.includes('désactivées'));

    const dbRecordAfterOff = await getScheduledMute(testGroup);
    assert.equal(dbRecordAfterOff, null);
  });
});
