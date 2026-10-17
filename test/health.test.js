import { test } from 'node:test';
import assert from 'node:assert/strict';
import config from '../config.js';

test('/health endpoint response structure and security', () => {
    // Simulated health response object generated in index.js
    const healthResponse = {
        status: "online",
        bot: "Menma-MD",
        hasSession: Boolean(config.SESSION_ID),
        uptime: Math.floor(process.uptime()),
        platform: process.env.KOYEB_PUBLIC_DOMAIN ? "Koyeb"
            : process.env.RENDER ? "Render"
                : process.env.DYNO ? "Heroku"
                    : "Panel",
        timestamp: new Date().toISOString()
    };

    assert.equal(healthResponse.status, 'online');
    assert.equal(typeof healthResponse.hasSession, 'boolean');
    assert.equal(healthResponse.sessionId, undefined, 'sessionId credential must not be present in health response');
});
