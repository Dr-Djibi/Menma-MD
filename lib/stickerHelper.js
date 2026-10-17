import e from"fs";import a from"path";import l from"crypto";import{execFile as w}from"child_process";import{tmpdir as f}from"os";import y from"node-webpmux";import{fileURLToPath as S}from"url";const k=S(import.meta.url),$=a.dirname(k),g={DEFAULT:"default",CROPPED:"cropped",FULL:"full",CIRCLE:"circle",ROUNDED:"rounded"},x=[{grad:["#FF007F","#7F00FF","#00F0FF"],corner:"#FF007F",glow:"#00F0FF",textShadow:"#FF007F"},{grad:["#FFE259","#F5AF19","#FFA751"],corner:"#F5AF19",glow:"#FFE259",textShadow:"#FFA751"},{grad:["#00FF87","#60EFFF","#0575E6"],corner:"#00FF87",glow:"#60EFFF",textShadow:"#0575E6"},{grad:["#FF416C","#FF4B2B","#8A2387"],corner:"#FF416C",glow:"#FF4B2B",textShadow:"#8A2387"},{grad:["#00F2FE","#4FACFE","#0000FF"],corner:"#00F2FE",glow:"#4FACFE",textShadow:"#0000FF"},{grad:["#F355E6","#9020F5","#3A1C71"],corner:"#F355E6",glow:"#9020F5",textShadow:"#3A1C71"}];function E(c,o=10){const n=c.split(/\s+/),i=[];let t="";for(const r of n)if(r.length>o){t&&(i.push(t),t="");let s=r;for(;s.length>o;)i.push(s.substring(0,o)),s=s.substring(o);t=s}else(t+" "+r).trim().length<=o?t=(t+" "+r).trim():(t&&i.push(t),t=r);return t&&i.push(t),i}function m(c,o=0){const n=x[o%x.length],i=E(c,12),t=120,r=t*1.2,p=(512-i.length*r)/2+t/2,F=i.map((u,h)=>`<text x="256" y="${p+h*r}" dominant-baseline="middle" text-anchor="middle" class="neon-text" filter="url(#glow)">${u.toUpperCase()}</text>`).join(`
`);return`
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
        <defs>
            <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${n.grad[0]}" />
                <stop offset="50%" stop-color="${n.grad[1]}" />
                <stop offset="100%" stop-color="${n.grad[2]}" />
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
        ${F}
    </svg>
    `}async function q(c){const o=a.join(f(),l.randomBytes(6).toString("hex"));e.mkdirSync(o);for(let t=0;t<6;t++)e.writeFileSync(a.join(o,`frame_${t}.svg`),m(c,t));const n=a.join(f(),`${l.randomBytes(6).toString("hex")}.webp`);await d("ffmpeg",["-framerate","2","-i",a.join(o,"frame_%d.svg"),"-vf","scale=512:512","-loop","0","-vcodec","libwebp","-quality","80",n]);const i=e.readFileSync(n);return e.rmSync(o,{recursive:!0}),e.unlinkSync(n),i}async function D(c,o="png"){const n=m(c),i=l.randomBytes(6).toString("hex"),t=a.join(f(),`${i}.tmp`),r=a.join(f(),`${i}.${o}`);e.writeFileSync(t,Buffer.from(n,"utf-8"));try{await d("ffmpeg",["-i",t,"-lossless","0","-qscale","50",r]);const s=e.readFileSync(r);return e.existsSync(t)&&e.unlinkSync(t),e.existsSync(r)&&e.unlinkSync(r),s}catch(s){throw e.existsSync(t)&&e.unlinkSync(t),e.existsSync(r)&&e.unlinkSync(r),s}}async function d(c,o){return new Promise((n,i)=>{w(c,o,(t,r,s)=>{t?i(t):n(r)})})}class U{constructor(o,n={}){this.imageBuffer=o,this.options={pack:n.pack||"Menma-MD",author:n.author||"Dr Djibi",type:n.type||g.DEFAULT,quality:n.quality||50,categories:n.categories||["\u{1F929}"]}}async toBuffer(){const{type:o}=this.options,n=l.randomBytes(6).toString("hex"),i=a.join(f(),`${n}.tmp`),t=a.join(f(),`${n}.webp`);e.writeFileSync(i,this.imageBuffer);let r="";o===g.FULL?r="scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000":o===g.CIRCLE?r="scale=512:512:force_original_aspect_ratio=increase,crop=512:512,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte(sqrt(pow(X-256,2)+pow(Y-256,2)),256),255,0)'":o===g.ROUNDED?r="scale=512:512:force_original_aspect_ratio=increase,crop=512:512,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lt(X,64)*lt(Y,64),if(lte(sqrt(pow(X-64,2)+pow(Y-64,2)),64),255,0),if(gt(X,448)*lt(Y,64),if(lte(sqrt(pow(X-448,2)+pow(Y-64,2)),64),255,0),if(lt(X,64)*gt(Y,448),if(lte(sqrt(pow(X-64,2)+pow(Y-448,2)),64),255,0),if(gt(X,448)*gt(Y,448),if(lte(sqrt(pow(X-448,2)+pow(Y-448,2)),64),255,0),255))))'":r="scale=512:512:force_original_aspect_ratio=increase,crop=512:512";try{await d("ffmpeg",["-i",i,"-vcodec","libwebp","-vf",r,"-lossless","0","-qscale",String(this.options.quality),"-loop","0","-preset","default","-an","-vsync","0",t]);let s=e.readFileSync(t);return s=await this.addExif(s),e.existsSync(i)&&e.unlinkSync(i),e.existsSync(t)&&e.unlinkSync(t),s}catch(s){throw e.existsSync(i)&&e.unlinkSync(i),e.existsSync(t)&&e.unlinkSync(t),s}}async addExif(o){if(!this.options.pack&&!this.options.author)return o;const n=l.randomBytes(6).toString("hex"),i=a.join(f(),`${n}_exif.webp`);e.writeFileSync(i,o);const t=new y.Image,r={"sticker-pack-id":"menma-md","sticker-pack-name":this.options.pack,"sticker-pack-publisher":this.options.author,emojis:this.options.categories},s=Buffer.from([73,73,42,0,8,0,0,0,1,0,65,87,7,0,0,0,0,0,22,0,0,0]),p=Buffer.from(JSON.stringify(r),"utf-8"),F=Buffer.concat([s,p]);F.writeUIntLE(p.length,14,4),await t.load(i),t.exif=F;const u=await t.save(null);return e.existsSync(i)&&e.unlinkSync(i),u}}export{U as Sticker,g as StickerTypes,q as generateAnimatedSticker,D as generateNeonImageBuffer,m as generateNeonSVG};
