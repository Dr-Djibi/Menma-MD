import i from"fs";import a from"path";import l from"crypto";import{exec as w}from"child_process";import{tmpdir as f}from"os";import y from"node-webpmux";import{fileURLToPath as S}from"url";const k=S(import.meta.url),j=a.dirname(k),F={DEFAULT:"default",CROPPED:"cropped",FULL:"full",CIRCLE:"circle",ROUNDED:"rounded"},x=[{grad:["#FF007F","#7F00FF","#00F0FF"],corner:"#FF007F",glow:"#00F0FF",textShadow:"#FF007F"},{grad:["#FFE259","#F5AF19","#FFA751"],corner:"#F5AF19",glow:"#FFE259",textShadow:"#FFA751"},{grad:["#00FF87","#60EFFF","#0575E6"],corner:"#00FF87",glow:"#60EFFF",textShadow:"#0575E6"},{grad:["#FF416C","#FF4B2B","#8A2387"],corner:"#FF416C",glow:"#FF4B2B",textShadow:"#8A2387"},{grad:["#00F2FE","#4FACFE","#0000FF"],corner:"#00F2FE",glow:"#4FACFE",textShadow:"#0000FF"},{grad:["#F355E6","#9020F5","#3A1C71"],corner:"#F355E6",glow:"#9020F5",textShadow:"#3A1C71"}];function E(c,o=10){const r=c.split(/\s+/),e=[];let t="";for(const n of r)if(n.length>o){t&&(e.push(t),t="");let s=n;for(;s.length>o;)e.push(s.substring(0,o)),s=s.substring(o);t=s}else(t+" "+n).trim().length<=o?t=(t+" "+n).trim():(t&&e.push(t),t=n);return t&&e.push(t),e}function m(c,o=0){const r=x[o%x.length],e=E(c,12),t=120,n=t*1.2,p=(512-e.length*n)/2+t/2,g=e.map((u,h)=>`<text x="256" y="${p+h*n}" dominant-baseline="middle" text-anchor="middle" class="neon-text" filter="url(#glow)">${u.toUpperCase()}</text>`).join(`
`);return`
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
        <defs>
            <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${r.grad[0]}" />
                <stop offset="50%" stop-color="${r.grad[1]}" />
                <stop offset="100%" stop-color="${r.grad[2]}" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <style>
                .neon-text {
                    font-family: 'Impact', sans-serif;
                    font-size: ${t}px;
                    font-weight: 900;
                    fill: #FFFFFF;
                    stroke: url(#neonGrad);
                    stroke-width: 6px;
                    paint-order: stroke;
                    stroke-linejoin: round;
                }
            </style>
        </defs>
        <rect width="100%" height="100%" fill="#000000" />
        ${g}
    </svg>
    `}async function q(c){const o=a.join(f(),l.randomBytes(6).toString("hex"));i.mkdirSync(o);for(let t=0;t<6;t++)i.writeFileSync(a.join(o,`frame_${t}.svg`),m(c,t));const r=a.join(f(),`${l.randomBytes(6).toString("hex")}.webp`);await d(`ffmpeg -framerate 2 -i ${o}/frame_%d.svg -vf "scale=512:512" -loop 0 -vcodec libwebp -quality 80 ${r}`);const e=i.readFileSync(r);return i.rmSync(o,{recursive:!0}),i.unlinkSync(r),e}async function D(c,o="png"){const r=m(c),e=l.randomBytes(6).toString("hex"),t=a.join(f(),`${e}.tmp`),n=a.join(f(),`${e}.${o}`);i.writeFileSync(t,Buffer.from(r,"utf-8"));try{await d(`ffmpeg -i ${t} -lossless 0 -qscale 50 ${n}`);const s=i.readFileSync(n);return i.existsSync(t)&&i.unlinkSync(t),i.existsSync(n)&&i.unlinkSync(n),s}catch(s){throw i.existsSync(t)&&i.unlinkSync(t),i.existsSync(n)&&i.unlinkSync(n),s}}async function d(c){return new Promise((o,r)=>{w(c,(e,t,n)=>{e?r(e):o(t)})})}class U{constructor(o,r={}){this.imageBuffer=o,this.options={pack:r.pack||"Menma-MD",author:r.author||"Dr Djibi",type:r.type||F.DEFAULT,quality:r.quality||50,categories:r.categories||["\u{1F929}"]}}async toBuffer(){const{type:o}=this.options,r=l.randomBytes(6).toString("hex"),e=a.join(f(),`${r}.tmp`),t=a.join(f(),`${r}.webp`);i.writeFileSync(e,this.imageBuffer);let n="";o===F.FULL?n="scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000":o===F.CIRCLE?n="scale=512:512:force_original_aspect_ratio=increase,crop=512:512,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte(sqrt(pow(X-256,2)+pow(Y-256,2)),256),255,0)'":o===F.ROUNDED?n="scale=512:512:force_original_aspect_ratio=increase,crop=512:512,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lt(X,64)*lt(Y,64),if(lte(sqrt(pow(X-64,2)+pow(Y-64,2)),64),255,0),if(gt(X,448)*lt(Y,64),if(lte(sqrt(pow(X-448,2)+pow(Y-64,2)),64),255,0),if(lt(X,64)*gt(Y,448),if(lte(sqrt(pow(X-64,2)+pow(Y-448,2)),64),255,0),if(gt(X,448)*gt(Y,448),if(lte(sqrt(pow(X-448,2)+pow(Y-448,2)),64),255,0),255))))'":n="scale=512:512:force_original_aspect_ratio=increase,crop=512:512";try{await d(`ffmpeg -i ${e} -vcodec libwebp -vf "${n}" -lossless 0 -qscale ${this.options.quality} -loop 0 -preset default -an -vsync 0 ${t}`);let s=i.readFileSync(t);return s=await this.addExif(s),i.existsSync(e)&&i.unlinkSync(e),i.existsSync(t)&&i.unlinkSync(t),s}catch(s){throw i.existsSync(e)&&i.unlinkSync(e),i.existsSync(t)&&i.unlinkSync(t),s}}async addExif(o){if(!this.options.pack&&!this.options.author)return o;const r=l.randomBytes(6).toString("hex"),e=a.join(f(),`${r}_exif.webp`);i.writeFileSync(e,o);const t=new y.Image,n={"sticker-pack-id":"menma-md","sticker-pack-name":this.options.pack,"sticker-pack-publisher":this.options.author,emojis:this.options.categories},s=Buffer.from([73,73,42,0,8,0,0,0,1,0,65,87,7,0,0,0,0,0,22,0,0,0]),p=Buffer.from(JSON.stringify(n),"utf-8"),g=Buffer.concat([s,p]);g.writeUIntLE(p.length,14,4),await t.load(e),t.exif=g;const u=await t.save(null);return i.existsSync(e)&&i.unlinkSync(e),u}}export{U as Sticker,F as StickerTypes,q as generateAnimatedSticker,D as generateNeonImageBuffer,m as generateNeonSVG};
