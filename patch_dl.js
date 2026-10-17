import fs from 'fs';

const filePath = '/home/menma/MENMA_MD/commandes/dl.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ensure sendMediaSafely is imported from fonctions.js
if (!content.includes('sendMediaSafely')) {
    content = content.replace('import { downloadFile', 'import { downloadFile, sendMediaSafely');
}

// 2. Patch .tiktok
content = content.replace(
    /const \{ video \} = await ttdl\(arg\[0\]\);\s+if \(!video\) return repondre\(trd\("tiktok.error"\)\);\s+await menma.sendMessage\(ms_org, \{ video: \{ url: video \}, caption: FOOTER \}, \{ quoted: ms \}\);/,
    `const { video } = await ttdl(arg[0]);
        if (!video) return repondre(trd("tiktok.error"));
        const filePath = await downloadFile(video, "mp4");
        await sendMediaSafely(menma, ms_org, ms, filePath, "video", FOOTER);
        setTimeout(() => { if(fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 10000);`
);

// 3. Patch .fb
content = content.replace(
    /const videoUrl = await fbdl\(arg\[0\]\);\s+if \(!videoUrl\) return repondre\(trd\("facebook.error"\)\);\s+await menma.sendMessage\(ms_org, \{ video: \{ url: videoUrl \}, caption: FOOTER \}, \{ quoted: ms \}\);/,
    `const videoUrl = await fbdl(arg[0]);
        if (!videoUrl) return repondre(trd("facebook.error"));
        const filePath = await downloadFile(videoUrl, "mp4");
        await sendMediaSafely(menma, ms_org, ms, filePath, "video", FOOTER);
        setTimeout(() => { if(fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 10000);`
);

// 4. Patch .twitter
content = content.replace(
    /const videoUrl = await twitterdl\(arg\[0\]\);\s+if \(!videoUrl\) return repondre\(trd\("twitter.error"\)\);\s+await menma.sendMessage\(ms_org, \{ video: \{ url: videoUrl \}, caption: FOOTER \}, \{ quoted: ms \}\);/,
    `const videoUrl = await twitterdl(arg[0]);
        if (!videoUrl) return repondre(trd("twitter.error"));
        const filePath = await downloadFile(videoUrl, "mp4");
        await sendMediaSafely(menma, ms_org, ms, filePath, "video", FOOTER);
        setTimeout(() => { if(fs.existsSync(filePath)) fs.unlinkSync(filePath); }, 10000);`
);

fs.writeFileSync(filePath, content);
