import test from 'node:test';
import assert from 'node:assert/strict';
import { WarnDB, addWarn, getWarnCount, delWarn, resetWarn, getWarnsByGroup } from '../Database/warns.js';

test('Warning database system operations and edge cases', async (t) => {
  const testGroup = 'testGroup123@g.us';
  const testGroup2 = 'testGroup456@g.us';
  const user1 = '224600000001';
  const user2 = '224600000002';

  // Ensure DB table is synced first
  await WarnDB.sync();
  // Cleanup initial state
  await WarnDB.destroy({ where: {} });

  await t.test('getWarnCount returns 0 for a new user', async () => {
    const count = await getWarnCount(testGroup, user1);
    assert.equal(count, 0);
  });

  await t.test('addWarn increments warn count', async () => {
    const c1 = await addWarn(testGroup, user1);
    assert.equal(c1, 1);

    const c2 = await addWarn(testGroup, user1);
    assert.equal(c2, 2);

    const checkCount = await getWarnCount(testGroup, user1);
    assert.equal(checkCount, 2);
  });

  await t.test('delWarn decrements warn count down to minimum 0', async () => {
    const c1 = await delWarn(testGroup, user1);
    assert.equal(c1, 1);

    const c2 = await delWarn(testGroup, user1);
    assert.equal(c2, 0);

    // Decrementing further stays at 0
    const c3 = await delWarn(testGroup, user1);
    assert.equal(c3, 0);

    // Non-existent record decrement stays 0
    const cNonExistent = await delWarn(testGroup, '999999999999');
    assert.equal(cNonExistent, 0);
  });

  await t.test('resetWarn resets count to 0', async () => {
    await addWarn(testGroup, user1);
    await addWarn(testGroup, user1);
    assert.equal(await getWarnCount(testGroup, user1), 2);

    const res = await resetWarn(testGroup, user1);
    assert.equal(res, 0);
    assert.equal(await getWarnCount(testGroup, user1), 0);
  });

  await t.test('getWarnsByGroup returns active warnings for specific group only', async () => {
    // Add warns for user1 and user2 in testGroup
    await addWarn(testGroup, user1); // 1 warn
    await addWarn(testGroup, user1); // 2 warns
    await addWarn(testGroup, user2); // 1 warn

    // Add warn for user1 in testGroup2
    await addWarn(testGroup2, user1); // 1 warn in group 2

    const group1Warns = await getWarnsByGroup(testGroup);
    assert.equal(group1Warns.length, 2);

    const u1 = group1Warns.find(w => w.userId === user1);
    assert.ok(u1);
    assert.equal(u1.count, 2);

    const u2 = group1Warns.find(w => w.userId === user2);
    assert.ok(u2);
    assert.equal(u2.count, 1);

    const group2Warns = await getWarnsByGroup(testGroup2);
    assert.equal(group2Warns.length, 1);
    assert.equal(group2Warns[0].userId, user1);
    assert.equal(group2Warns[0].count, 1);

    // After resetting user2 in testGroup, warnlist for testGroup should only contain user1
    await resetWarn(testGroup, user2);
    const group1Updated = await getWarnsByGroup(testGroup);
    assert.equal(group1Updated.length, 1);
    assert.equal(group1Updated[0].userId, user1);
  });

  // Cleanup after test
  await WarnDB.destroy({ where: {} });
});
