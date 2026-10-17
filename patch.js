import fs from 'fs';

const filePath = '/home/menma/MENMA_MD/commandes/auto_download.js';
let content = fs.readFileSync(filePath, 'utf8');

const helperFunction = `
async function sendMediaSafely(menma, ms_org, ms, filePath, type, caption = STYLE.GENERATED_BY, fileName = null) {
    if (!filePath || !fs.existsSync(filePath)) return;
    const stats = fs.statSync(filePath);
    // Si la vidéo/audio dépasse 30 Mo
    if (stats.size > 30 * 1024 * 1024) {
        const catboxUrl = await uploadToCatbox(filePath);
        await menma.sendMessage(ms_org, { text: \`🎥 Fichier trop lourd pour WhatsApp.\\n🔗 Lien de téléchargement : \${catboxUrl}\\n\${caption}\` }, { quoted: ms });
    } else {
        if (type === "video") {
            await menma.sendMessage(ms_org, { video: { url: filePath }, caption }, { quoted: ms });
        } else if (type === "audio") {
            await menma.sendMessage(ms_org, { audio: { url: filePath }, mimetype: 'audio/mp4', fileName }, { quoted: ms });
        } else {
            await menma.sendMessage(ms_org, { image: { url: filePath }, caption }, { quoted: ms });
        }
    }
}
`;

// Insert the helper function right before handleAutoDownload
content = content.replace('async function handleAutoDownload', helperFunction + '\nasync function handleAutoDownload');

// Replace TikTok logic
content = content.replace(
    /if \(mediaType === "tiktok"\) \{[\s\S]*?else if \(mediaType === "instagram"\)/,
    `if (mediaType === "tiktok") {
            const { video, slides } = await ttdl(matchUrl);
            if (video) {
                filePath = await downloadFile(video, "mp4");
                await sendMediaSafely(menma, ms_org, ms, filePath, "video");
            } else if (slides && slides.length > 0) {
                for (const img of slides) {
                    const p = await downloadFile(img, "jpg");
                    pathsToClean.push(p);
                    await sendMediaSafely(menma, ms_org, ms, p, "image");
                    await sleep(1500);
                }
            }
        }

        else if (mediaType === "instagram")`
);

// Replace FB logic
content = content.replace(
    /else if \(mediaType === "facebook"\) \{[\s\S]*?else if \(mediaType === "twitter"\)/,
    `else if (mediaType === "facebook") {
            const videoUrl = await fbdl(matchUrl);
            if (videoUrl) {
                filePath = await downloadFile(videoUrl, "mp4");
                await sendMediaSafely(menma, ms_org, ms, filePath, "video");
            }
        }

        else if (mediaType === "twitter")`
);

// Replace Twitter logic
content = content.replace(
    /else if \(mediaType === "twitter"\) \{[\s\S]*?else if \(mediaType === "youtube"\)/,
    `else if (mediaType === "twitter") {
            const videoUrl = await twitterdl(matchUrl);
            if (videoUrl) {
                filePath = await downloadFile(videoUrl, "mp4");
                await sendMediaSafely(menma, ms_org, ms, filePath, "video");
            }
        }

        else if (mediaType === "youtube")`
);

// Replace YouTube logic
content = content.replace(
    /else if \(mediaType === "youtube"\) \{[\s\S]*?else if \(mediaType === "spotify"\)/,
    `else if (mediaType === "youtube") {
            const result = await ytdl(matchUrl, 'video');
            if (result && result.videoUrl) {
                filePath = await downloadFile(result.videoUrl, "mp4");
                await sendMediaSafely(menma, ms_org, ms, filePath, "video", \`🎥 *\${result.title || "Vidéo YouTube"}*\\n\${STYLE.GENERATED_BY}\`);
            }
        }

        else if (mediaType === "spotify")`
);

// Replace Pinterest logic
content = content.replace(
    /else if \(mediaType === "pinterest"\) \{[\s\S]*?\/\/ Réaction de succès/,
    `else if (mediaType === "pinterest") {
            const result = await pinterestdl(matchUrl);
            if (result && result.download_url) {
                const isVideo = result.media_type === "video";
                const ext = isVideo ? "mp4" : "jpg";
                filePath = await downloadFile(result.download_url, ext);
                await sendMediaSafely(menma, ms_org, ms, filePath, isVideo ? "video" : "image");
            }
        }

        // Réaction de succès`
);

fs.writeFileSync(filePath, content);
console.log("Patched auto_download.js");
