import test from 'node:test';
import assert from 'node:assert/strict';
import { buildThemeMedia, getDefaultThemeUrl } from '../lib/themeHelper.js';

test('buildThemeMedia falls back to default theme URL when given an invalid URL', async () => {
    const invalidUrl = 'https://invalid-domain-that-does-not-exist-xyz123.com/nonexistent.jpg';
    const media = await buildThemeMedia(invalidUrl);
    assert.ok(media);
    assert.ok(media.image || media.video);
});
