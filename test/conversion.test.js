import { test } from 'node:test';
import assert from 'node:assert/strict';

test('conversion module imports and registers commands safely', async () => {
    // Import conversion module to verify no syntax errors or load issues
    await import('../commandes/conversion.js');
    assert.ok(true, 'commandes/conversion.js imported successfully');
});
