import test from 'node:test';
import assert from 'node:assert/strict';
import { WarnDB, WarnConfigDB, setMaxWarns, getMaxWarns } from '../Database/warns.js';
import { trd } from '../lib/i18n.js';

test('Integration test for dynamic warning threshold formatting', async (t) => {
  const groupJid = '1234567890@g.us';
  const targetUser = '224600000099';

  await WarnDB.sync();
  await WarnConfigDB.sync();
  await WarnDB.destroy({ where: {} });
  await WarnConfigDB.destroy({ where: {} });

  await t.test('setMaxWarns dynamically updates threshold used by trd template', async () => {
    await setMaxWarns(groupJid, 5);
    const max = await getMaxWarns(groupJid);
    assert.equal(max, 5);

    const warnSuccessMsg = trd("warn_cmd.success", { user: targetUser, count: 2, max });
    assert.ok(warnSuccessMsg.includes("2/5"), `Message output should contain "2/5", got: "${warnSuccessMsg}"`);

    const kickMsg = trd("warn_cmd.kick", { user: targetUser, max });
    assert.ok(kickMsg.includes("5"), `Kick message should contain max threshold "5", got: "${kickMsg}"`);

    const getWarnMsg = trd("getwarn.success", { user: targetUser, count: 3, max });
    assert.ok(getWarnMsg.includes("3/5"), `Getwarn output should contain "3/5", got: "${getWarnMsg}"`);

    const delWarnMsg = trd("delwarn.success", { user: targetUser, count: 1, max });
    assert.ok(delWarnMsg.includes("1/5"), `Delwarn output should contain "1/5", got: "${delWarnMsg}"`);
  });

  await WarnDB.destroy({ where: {} });
  await WarnConfigDB.destroy({ where: {} });
});
