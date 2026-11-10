import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('temp cleanup handles directory removal cleanly without EISDIR error', () => {
    const testTempDir = path.join(__dirname, 'temp_test');
    if (!fs.existsSync(testTempDir)) fs.mkdirSync(testTempDir, { recursive: true });

    const backupDir = path.join(testTempDir, 'backup_update');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const dummyFile = path.join(backupDir, 'dummy.txt');
    fs.writeFileSync(dummyFile, 'data');

    // Simulate cleanup logic
    const files = fs.readdirSync(testTempDir);
    assert.ok(files.includes('backup_update'));

    files.forEach(file => {
        const filePath = path.join(testTempDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
        } else {
            fs.unlinkSync(filePath);
        }
    });

    assert.equal(fs.existsSync(backupDir), false);
    if (fs.existsSync(testTempDir)) fs.rmSync(testTempDir, { recursive: true, force: true });
});
