import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { translate } from '@vitalets/google-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runSync() {
    console.log("🔄 Début de la synchronisation des langues ...");
    console.log("Cela peut prendre un certain temps si beaucoup de phrases manquent.\n");

    const langsDir = path.join(__dirname, "languages");
    const frPath = path.join(langsDir, "fr.json");
    
    if (!fs.existsSync(frPath)) {
        console.error("❌ Fichier fr.json introuvable.");
        return;
    }
    
    let baseData;
    try {
        baseData = JSON.parse(fs.readFileSync(frPath, "utf8"));
    } catch (e) {
        console.error("❌ Erreur lors de la lecture de fr.json");
        return;
    }

    const files = fs.readdirSync(langsDir).filter(f => f.endsWith('.json') && f !== 'fr.json');
    let totalAdded = 0;

    // Fonction récursive pour traduire les clés
    async function syncObject(baseObj, targetObj, targetLangCode) {
        let addedCount = 0;
        for (const key in baseObj) {
            if (typeof baseObj[key] === "object" && baseObj[key] !== null) {
                if (!targetObj[key]) targetObj[key] = {};
                addedCount += await syncObject(baseObj[key], targetObj[key], targetLangCode);
            } else if (typeof baseObj[key] === "string") {
                if (!targetObj[key] || targetObj[key].trim() === "") {
                    try {
                        let textToTranslate = baseObj[key];
                        // Protection des variables {variable}
                        const vars = [];
                        textToTranslate = textToTranslate.replace(/\{([^}]+)\}/g, (match) => {
                            vars.push(match);
                            return `[VAR${vars.length - 1}]`;
                        });

                        const res = await translate(textToTranslate, { from: 'fr', to: targetLangCode === 'ht' ? 'ht' : targetLangCode });
                        let translatedText = res.text;

                        // Restauration des variables
                        vars.forEach((v, index) => {
                            translatedText = translatedText.replace(new RegExp(`\\[VAR${index}\\]`, 'g'), v).replace(new RegExp(`\\[ VAR${index} \\]`, 'g'), v);
                        });

                        targetObj[key] = translatedText;
                        addedCount++;
                        
                        // Petit délai pour éviter de spammer l'API de Google
                        await new Promise(r => setTimeout(r, 200));
                    } catch (e) {
                        console.error(`Erreur de traduction pour ${key} en ${targetLangCode}:`, e.message);
                    }
                }
            }
        }
        return addedCount;
    }

    for (const file of files) {
        const targetLangCode = file.replace(".json", "");
        const filePath = path.join(langsDir, file);
        let targetData = {};
        
        if (fs.existsSync(filePath)) {
            try {
                targetData = JSON.parse(fs.readFileSync(filePath, "utf8"));
            } catch (e) {
                targetData = {};
            }
        }

        console.log(`Traitement de ${file}...`);
        const added = await syncObject(baseData, targetData, targetLangCode);
        if (added > 0) {
            fs.writeFileSync(filePath, JSON.stringify(targetData, null, 2), "utf8");
        }
        totalAdded += added;
        console.log(`✅ ${file} : ${added} ajouts`);
    }

    console.log(`\n🎉 Synchronisation terminée avec succès! (${totalAdded} traductions ajoutées au total)`);
}

runSync();
