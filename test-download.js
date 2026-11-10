import fs from 'fs';
import { downloadFile } from './lib/fonctions.js';
import { ttdl } from './lib/dl.js';
async function test() {
    console.log("Testing TikTok...");
    try {
        const { video } = await ttdl('https://www.tiktok.com/@tiktok/video/7106594312292453675');
        console.log("TikTok URL:", video);
        if (video) {
            const file = await downloadFile(video, 'mp4');
            console.log("Downloaded to:", file);
            console.log("File exists:", fs.existsSync(file));
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}
test();
