import fs from 'fs';

const fonctionsPath = '/home/menma/MENMA_MD/lib/fonctions.js';
let fonctionsCode = fs.readFileSync(fonctionsPath, 'utf8');

const helper = `
async function sendMediaSafely(menma, ms_org, ms, filePath, type, caption = "", fileName = null) {
    if (!filePath || !fs.existsSync(filePath)) return;
    const stats = fs.statSync(filePath);
    if (stats.size > 30 * 1024 * 1024) {
        const catboxUrl = await uploadToCatbox(filePath);
        await menma.sendMessage(ms_org, { text: \`🎥 Fichier trop lourd (>30Mo).\\n🔗 Lien : \${catboxUrl}\\n\${caption}\` }, { quoted: ms });
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

if (!fonctionsCode.includes('sendMediaSafely')) {
    fonctionsCode += '\n' + helper + '\nmodule.exports.sendMediaSafely = sendMediaSafely;\n';
    fs.writeFileSync(fonctionsPath, fonctionsCode);
}
