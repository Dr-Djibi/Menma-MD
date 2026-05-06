# 📖 Guide de Déploiement Simplifié

Vous voulez déployer **Menma-MD** ? C'est très simple.

## 1. Session ID & Variables (.env)
1. **Session ID** : Allez sur [Menma Session Site](https://victorious-catriona-dsck-fb522085.koyeb.app/) et connectez-vous pour avoir votre `SESSION_ID`.
2. **Génération du .env** : Vous pouvez créer votre fichier de configuration facilement ici : [Générateur de .env](https://victorious-catriona-dsck-fb522085.koyeb.app/env.html)

## 2. Déploiement
Utilisez les boutons de déploiement direct dans le [README.md](./README.md).
Il utilise notre dépôt de déploiement optimisé :
- **Dockerfile** : `https://github.com/Dr-Djibi/Deploie-menma-md`

## 3. Variables à remplir
Lors du déploiement, vous pouvez utiliser le fichier généré à l'étape 1 ou remplir manuellement ces variables :

```text
SESSION_ID=Menma_md_
NUMERO_OWNER=224XXXXXXXX
NOM_BOT=𝙼𝙴𝙽𝙼𝙰-𝙼𝙳
PREFIX=.
MODE=private
LECTURE_AUTO_STATUS=non
AUTO_LIKE_STATUS=oui
LIKE_STATUS_EMOJIS=💚,❤️,✨,🔥,🙌
ZONE_DE_TEMPS=Africa/Conakry
DATABASE_URL=
STICKER_PACKNAME=Menma-MD
STICKER_AUTHOR=Dr-Djibi
MENU=https://files.catbox.moe/h0va1p.jpg
```

C'est tout !
