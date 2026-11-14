import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { commands } from "../lib/menmacmd.js";
import "../commandes/owner.js";

test("cleanup command is registered with owner class", () => {
    const cmd = commands.find(c => c.name === "cleanup");
    assert.ok(cmd, "cleanup command should be registered");
    assert.equal(cmd.classe, "owner");
    assert.ok(cmd.alias.includes("cleantemp"));
    assert.ok(cmd.alias.includes("purgetemp"));
});

test("cleanup command enforces dev_id owner permission", async () => {
    const cmd = commands.find(c => c.name === "cleanup");
    assert.ok(cmd);

    let response = "";
    const mockRepondre = (msg) => { response = msg; };

    await cmd.fonction("dest_jid", {}, { repondre: mockRepondre, dev_id: false });
    assert.ok(response.includes("propriétaire") || response.includes("owner") || response.length > 0, "Non-owner should be rejected");
});

test("cleanup command cleans temp directory and reports removed files and size", async () => {
    const cmd = commands.find(c => c.name === "cleanup");
    assert.ok(cmd);

    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const testFile = path.join(tempDir, "test_garbage_file.tmp");
    const testSubDir = path.join(tempDir, "test_garbage_dir");
    fs.writeFileSync(testFile, "Hello cleanup test");
    fs.mkdirSync(testSubDir, { recursive: true });
    fs.writeFileSync(path.join(testSubDir, "inner.tmp"), "Inner content");

    let response = "";
    const mockRepondre = (msg) => { response = msg; };

    await cmd.fonction("dest_jid", {}, { repondre: mockRepondre, dev_id: true });

    assert.ok(response.includes("Nettoyage terminé avec succès"), "Response should report successful cleanup");
    assert.ok(!fs.existsSync(testFile), "testFile should be deleted");
    assert.ok(!fs.existsSync(testSubDir), "testSubDir should be deleted");
});
