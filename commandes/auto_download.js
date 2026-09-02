import { ttdl, fbdl, igdl, twitterdl, ytdl, spotifydl, pinterestdl } from "../lib/dl.js";
import { downloadFile, sleep, uploadToCatbox, sendMediaSafely } from "../lib/fonctions.js";
import fs from "fs";
import config from "../config.js";
import { getChatSetting, updateChatSetting } from "../Database/chats_settings.js";
import { menmacmd } from "../lib/menmacmd.js";
import STYLE from "../lib/styleHelper.js";

// Regex de détection des liens pour chaque plateforme
const TIKTOK_REGEX = /https?:\/\/((?:vm|vt|www|m)\.)?tiktok\.com\/[^\s]+/i;
const INSTAGRAM_REGEX = /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[^\s]+/i;
const FACEBOOK_REGEX = /https?:\/\/(www\.)?(facebook\.com|fb\.watch)\/[^\s]+/i;
const TWITTER_REGEX = /https?:\/\/((?:www\.)?twitter\.com|(?:www\.)?x\.com)\/[^\s]+/i;
const YOUTUBE_REGEX = /https?:\/\/((?:www\.)?youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[^\s]+/i;
const SPOTIFY_REGEX = /https?:\/\/open\.spotify\.com\/track\/[^\s]+/i;
const PINTEREST_REGEX = /https?:\/\/(www\.)?(pinterest\.com|pin\.it)\/[^\s]+/i;


async function sendMediaSafely(menma, ms_org, ms, filePath, type, caption = STYLE.GENERATED_BY, fileName = null) {
    if (!filePath || !fs.existsSync(filePath)) return;
    const stats = fs.statSync(filePath);
    // Si la vidéo/audio dépasse 30 Mo
    if (stats.size > 30 * 1024 * 1024) {
        const catboxUrl = await uploadToCatbox(filePath);
        await menma.sendMessage(ms_org, { text: `🎥 Fichier trop lourd pour WhatsApp.\n🔗 Lien de téléchargement : ${catboxUrl}\n${caption}` }, { quoted: ms });
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

async function handleAutoDownload(ms_org, menma, texte, ms, verif_Gp) {
    if (!texte) return;

    // Vérifier si le mode autodownload est activé pour ce chat
    const state = await getChatSetting(ms_org, "autodownload");
    if (state !== "oui") return;

    // Ne pas intercepter si le texte commence par le préfixe (c'est une commande manuelle)
    const prefix = config.PREFIX || "";
    if (prefix && texte.trim().startsWith(prefix)) return;

    let mediaType = "";
    let matchUrl = "";

    if (texte.match(TIKTOK_REGEX)) {
        mediaType = "tiktok";
        matchUrl = texte.match(TIKTOK_REGEX)[0];
    } else if (texte.match(INSTAGRAM_REGEX)) {
        mediaType = "instagram";
        matchUrl = texte.match(INSTAGRAM_REGEX)[0];
    } else if (texte.match(FACEBOOK_REGEX)) {
        mediaType = "facebook";
        matchUrl = texte.match(FACEBOOK_REGEX)[0];
    } else if (texte.match(TWITTER_REGEX)) {
        mediaType = "twitter";
        matchUrl = texte.match(TWITTER_REGEX)[0];
    } else if (texte.match(YOUTUBE_REGEX)) {
        mediaType = "youtube";
        matchUrl = texte.match(YOUTUBE_REGEX)[0];
    } else if (texte.match(SPOTIFY_REGEX)) {
        mediaType = "spotify";
        matchUrl = texte.match(SPOTIFY_REGEX)[0];
    } else if (texte.match(PINTEREST_REGEX)) {
        mediaType = "pinterest";
        matchUrl = texte.match(PINTEREST_REGEX)[0];
    }

    if (!mediaType || !matchUrl) return;

    let filePath = null;
    let pathsToClean = [];

    try {
        // ── Réaction initiale (⏳) ──
        await menma.sendMessage(ms_org, { react: { text: "⏳", key: ms.key } }).catch(() => { });

        if (mediaType === "tiktok") {
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

        else if (mediaType === "instagram") {
            const results = await igdl(matchUrl);
            if (results && results.length > 0) {
                for (const item of results) {
                    const mediaUrl = item.url || item;
                    const type = item.type || (typeof item === 'string' && item.includes(".mp4") ? "video" : "image");
                    const ext = type === "video" ? "mp4" : "jpg";
                    const p = await downloadFile(mediaUrl, ext);
                    pathsToClean.push(p);
                    if (type === "video") {
                        await menma.sendMessage(ms_org, { video: { url: p }, caption: STYLE.GENERATED_BY }, { quoted: ms });
                    } else {
                        await menma.sendMessage(ms_org, { image: { url: p }, caption: STYLE.GENERATED_BY }, { quoted: ms });
                    }
                    await sleep(1500);
                }
            }
        }

        else if (mediaType === "facebook") {
            const videoUrl = await fbdl(matchUrl);
            if (videoUrl) {
                filePath = await downloadFile(videoUrl, "mp4");
                await sendMediaSafely(menma, ms_org, ms, filePath, "video");
            }
        }

        else if (mediaType === "twitter") {
            const videoUrl = await twitterdl(matchUrl);
            if (videoUrl) {
                filePath = await downloadFile(videoUrl, "mp4");
                await sendMediaSafely(menma, ms_org, ms, filePath, "video");
            }
        }

        else if (mediaType === "youtube") {
            const result = await ytdl(matchUrl, 'video');
            if (result && result.videoUrl) {
                filePath = await downloadFile(result.videoUrl, "mp4");
                await sendMediaSafely(menma, ms_org, ms, filePath, "video", `🎥 *${result.title || "Vidéo YouTube"}*\n${STYLE.GENERATED_BY}`);
            }
        }

        else if (mediaType === "spotify") {
            const result = await spotifydl(matchUrl);
            if (result && result.audio) {
                filePath = await downloadFile(result.audio, "mp3");
                await menma.sendMessage(ms_org, { audio: { url: filePath }, mimetype: 'audio/mp4', fileName: `${result.title}.mp3` }, { quoted: ms });
            }
        }

        else if (mediaType === "pinterest") {
            const result = await pinterestdl(matchUrl);
            if (result && result.download_url) {
                const isVideo = result.media_type === "video";
                const ext = isVideo ? "mp4" : "jpg";
                filePath = await downloadFile(result.download_url, ext);
                await sendMediaSafely(menma, ms_org, ms, filePath, isVideo ? "video" : "image");
            }
        }

        // Réaction de succès (✅) si on a pu récupérer quelque chose
        if (filePath || pathsToClean.length > 0) {
            await menma.sendMessage(ms_org, { react: { text: "✅", key: ms.key } }).catch(() => { });
        } else {
            await menma.sendMessage(ms_org, { react: { text: "❌", key: ms.key } }).catch(() => { });
        }

    } catch (err) {
        console.error(`[AUTO DOWNLOAD ERR] (${mediaType})`, err.message);
        await menma.sendMessage(ms_org, { react: { text: "❌", key: ms.key } }).catch(() => { });
    } finally {
        // Nettoyage des fichiers temporaires
        if (filePath && fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch { }
        }
        for (const p of pathsToClean) {
            if (p && fs.existsSync(p)) {
                try { fs.unlinkSync(p); } catch { }
            }
        }
    }
}

// Commande activable pour allumer/éteindre
menmacmd({
    name: "autodownload",
    devOnly: true,
    alias: ["autodl", "adl"],
    classe: "owner",
    react: "📥",
    desc: "Active ou désactive le téléchargement automatique des liens (TikTok, Insta, YT, FB, Twitter/X, Spotify)"
}, async (ms_org, menma, { arg, repondre }) => {

    const modeInput = arg.join("").toLowerCase();
    const current = await getChatSetting(ms_org, "autodownload");

    if (!modeInput) {
        let msg = STYLE.TOP("📥 AUTO DOWNLOAD") + `\n`;
        msg += STYLE.LINE(`Statut actuel : *${current === "oui" ? "ACTIVED ✅" : "DISABLED ❌"}*\n`);
        msg += STYLE.INTER() + `\n`;
        msg += STYLE.LINE(`Activer : *.autodownload on*\n`);
        msg += STYLE.LINE(`Désactiver : *.autodownload off*\n`);
        msg += STYLE.BTM + STYLE.GENERATED_BY;
        return repondre(msg);
    }

    if (modeInput === "on" || modeInput === "oui" || modeInput === "active") {
        await updateChatSetting(ms_org, "autodownload", "oui");
        return repondre(STYLE.STATUS("Auto Download", "📥", true));
    } else if (modeInput === "off" || modeInput === "non" || modeInput === "desactive") {
        await updateChatSetting(ms_org, "autodownload", "non");
        return repondre(STYLE.STATUS("Auto Download", "📥", false));
    } else {
        return repondre("❌ Option invalide. Utilisez *.autodownload on* ou *.autodownload off*.");
    }
});

export { handleAutoDownload };
