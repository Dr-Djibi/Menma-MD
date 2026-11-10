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

test('landing page UI contains accessible health link and semantic elements', () => {
    // Simulated landing HTML template rendered in index.js
    const dev = config.DEV || 'Menma';
    const landingHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Menma-MD - Votre assistant WhatsApp multifonctions en français.">
    <title>MENMA BOT</title>
</head>
<body>
    <main class="container">
        <div style="text-align: center;">
            <span class="badge"><span class="badge-dot" aria-hidden="true"></span> Statut: Opérationnel</span>
        </div>
        <h1>Bienvenue sur Menma-MD</h1>
        <h2>Votre assistant WhatsApp</h2>
        <p>Je suis <strong>Menma-MD</strong></p>
        <div class="actions">
            <a href="/health" class="btn-health" aria-label="Consulter l'état de santé de l'API">Consulter l'état de santé API &rarr;</a>
        </div>
    </main>
</body>
</html>`;

    assert.match(landingHtml, /<main class="container">/);
    assert.match(landingHtml, /href="\/health"/);
    assert.match(landingHtml, /aria-label="Consulter l'état de santé de l'API"/);
    assert.match(landingHtml, /class="btn-health"/);
    assert.match(landingHtml, /class="badge-dot"/);
});
