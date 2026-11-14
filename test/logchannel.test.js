import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setLogChannel, getLogChannel, deleteLogChannel, sendLogMessage } from '../Database/logchannel.js';
import { waitForDatabase } from '../Database/ready.js';
import { exportGroupConfig, importGroupConfig, auditGroupSecurity } from '../lib/groupConfigHelper.js';

test('LogChannel database operations work correctly', async () => {
    await waitForDatabase(1000);

    const testGroupJid = '120363999999999001@g.us';
    const testLogJid = '120363999999999002@g.us';

    // Cleanup before test
    await deleteLogChannel(testGroupJid);

    // Initial state should be null
    const initialConfig = await getLogChannel(testGroupJid);
    assert.equal(initialConfig, null, 'Config should be null before setup');

    // Create log channel config
    await setLogChannel(testGroupJid, testLogJid, 'oui', ['all']);

    const savedConfig = await getLogChannel(testGroupJid);
    assert.ok(savedConfig, 'Config should exist after setLogChannel');
    assert.equal(savedConfig.id, testGroupJid);
    assert.equal(savedConfig.logJid, testLogJid);
    assert.equal(savedConfig.status, 'oui');
    assert.deepEqual(savedConfig.events, ['all']);

    // Update log channel config
    await setLogChannel(testGroupJid, testLogJid, 'non', ['warn', 'automod']);
    const updatedConfig = await getLogChannel(testGroupJid);
    assert.equal(updatedConfig.status, 'non');
    assert.deepEqual(updatedConfig.events, ['warn', 'automod']);

    // Delete log channel config
    const deleted = await deleteLogChannel(testGroupJid);
    assert.equal(deleted, true);
    const afterDelete = await getLogChannel(testGroupJid);
    assert.equal(afterDelete, null);
});

test('sendLogMessage transmits formatted messages to logJid when enabled', async () => {
    await waitForDatabase(1000);

    const groupJid = '120363999999999010@g.us';
    const logJid = '120363999999999011@g.us';

    await setLogChannel(groupJid, logJid, 'oui', ['all']);

    let sentMessage = null;
    let sentToJid = null;

    const mockMenma = {
        sendMessage: async (dest, content) => {
            sentToJid = dest;
            sentMessage = content;
            return { key: { id: 'MOCK_KEY' } };
        }
    };

    // 1. Valid event logging
    const success = await sendLogMessage(mockMenma, groupJid, 'warn', 'Avertissement émis à @224611111111', { mentions: ['224611111111@s.whatsapp.net'], groupName: 'Test Group' });
    assert.equal(success, true, 'sendLogMessage should return true');
    assert.equal(sentToJid, logJid, 'Message should be sent to logJid');
    assert.ok(sentMessage.text.includes('📜'), 'Message should contain log header icon');
    assert.ok(sentMessage.text.includes('WARN'), 'Message should contain event type');
    assert.ok(sentMessage.text.includes('Avertissement émis'), 'Message should contain event body');

    // 2. Disabled log channel status
    await setLogChannel(groupJid, logJid, 'non', ['all']);
    const disabledResult = await sendLogMessage(mockMenma, groupJid, 'warn', 'Test when disabled');
    assert.equal(disabledResult, false, 'sendLogMessage should return false when status is disabled');

    // 3. Event type filtering
    await setLogChannel(groupJid, logJid, 'oui', ['automod', 'warn']);
    const filteredOutResult = await sendLogMessage(mockMenma, groupJid, 'join_leave', 'User joined');
    assert.equal(filteredOutResult, false, 'sendLogMessage should filter out unallowed event types');

    const allowedResult = await sendLogMessage(mockMenma, groupJid, 'automod', 'Auto-mod sanction applied');
    assert.equal(allowedResult, true, 'sendLogMessage should allow event types included in configuration');

    await deleteLogChannel(groupJid);
});

test('LogChannel config export, import, and security audit integration works', async () => {
    await waitForDatabase(1000);

    const groupA = '120363999999999020@g.us';
    const groupB = '120363999999999021@g.us';
    const logChannelJid = '120363999999999022@g.us';

    await setLogChannel(groupA, logChannelJid, 'oui', ['all']);

    // Export groupA config
    const exportedData = await exportGroupConfig(groupA);
    assert.ok(exportedData.logChannel, 'Exported config should contain logChannel field');
    assert.equal(exportedData.logChannel.logJid, logChannelJid);
    assert.equal(exportedData.logChannel.status, 'oui');

    // Import into groupB
    const importResult = await importGroupConfig(groupB, exportedData);
    assert.equal(importResult.success, true);
    assert.ok(importResult.updated.includes('logChannel'), 'Updated modules list should include logChannel');

    const importedGroupBConfig = await getLogChannel(groupB);
    assert.ok(importedGroupBConfig, 'Group B should have logChannel config');
    assert.equal(importedGroupBConfig.logJid, logChannelJid);

    // Run security audit on groupB
    const audit = await auditGroupSecurity(groupB, { isBotAdmin: true });
    const logChannelCheck = audit.checks.find(c => c.name === "Canal de Logs Audit");
    assert.ok(logChannelCheck, 'Audit checks should include Canal de Logs Audit');
    assert.equal(logChannelCheck.status, true, 'Canal de Logs Audit check should be true');
    assert.equal(logChannelCheck.points, 5, 'Canal de Logs Audit check should grant 5 points');

    await deleteLogChannel(groupA);
    await deleteLogChannel(groupB);
});
