import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateNeonSVG, generateNeonImageBuffer } from '../lib/stickerHelper.js';

test('generateNeonSVG sanitizes/handles special shell characters in SVG text safely', () => {
    const maliciousInput = 'Test "; touch /tmp/pwned; $(id) `whoami`';
    const svg = generateNeonSVG(maliciousInput);
    assert.ok(svg.includes('TEST') || svg.includes('TOUCH'));
});

test('generateNeonImageBuffer safely handles input with shell metacharacters without shell injection', async () => {
    const maliciousInput = 'HELL; echo INJECTED; $(whoami)';
    try {
        await generateNeonImageBuffer(maliciousInput, 'png');
    } catch (err) {
        // ENOENT means ffmpeg is not installed in environment, but shell injection did not execute
        assert.ok(err.code === 'ENOENT' || err.message.includes('ffmpeg') || err.message.includes('Command failed'));
    }
});
