import * as THREE from 'three';
import './skins.css';

// Original procedural paint concepts: broad color and pattern inspiration,
// no Instagram photos, artist tags, portraits, logos, or copied vehicle wraps.
const liveries = [
  { name: 'CBD CHROME', base: 0x102536, accent: 0x08d9ef, glow: 0xff5d3d, detail: 'Electric cyan · sunset orange' },
  { name: 'SHENG STAR', base: 0x35114d, accent: 0xf12b9b, glow: 0xffd441, detail: 'Violet · hot pink · gold' },
  { name: 'SAVANNAH PULSE', base: 0xb83f12, accent: 0xffca22, glow: 0x111a22, detail: 'Copper · gold · charcoal' },
  { name: 'NIGHT RUNNER', base: 0x12151c, accent: 0x6a37ff, glow: 0x00f0b5, detail: 'Midnight · ultraviolet · mint' },
  { name: 'GREEN MACHINE', base: 0x176b28, accent: 0xc6ff24, glow: 0xfff0a3, detail: 'Kijani · lime · warm white' },
  { name: 'GLOW DISTRICT', base: 0x170d2a, accent: 0xff168c, glow: 0x00eaff, detail: 'Neon pink · laser cyan' },
  { name: 'AFTER HOURS', base: 0x080d18, accent: 0xff3d2e, glow: 0x9dff00, detail: 'Hot red · acid lime' },
  { name: 'KIBERA LIGHTS', base: 0x142014, accent: 0xffb000, glow: 0xf423d7, detail: 'Amber · magenta · forest' },
  { name: 'NAIROBI NEON', base: 0x071b32, accent: 0x00a9ff, glow: 0xffe600, detail: 'Electric blue · signal yellow' },
];
const routes = ['14', '46', '101'];
let selected = 0;
let selectedRoute = localStorage.getItem('matatu-route-number') || '46';
const uniforms = new Set();
const baseCompile = THREE.MeshStandardMaterial.prototype.onBeforeCompile;
const baseCacheKey = THREE.MeshStandardMaterial.prototype.customProgramCacheKey;

function paintMaterial(material) {
  const color = material.color?.getHex();
  return color === 0x68e900 || color === 0x96ff25;
}

THREE.MeshStandardMaterial.prototype.onBeforeCompile = function (shader, renderer) {
  baseCompile.call(this, shader, renderer);
  if (!paintMaterial(this)) return;
  const palette = liveries[selected];
  const record = {
    base: { value: new THREE.Color(palette.base) },
    accent: { value: new THREE.Color(palette.accent) },
    glow: { value: new THREE.Color(palette.glow) },
  };
  uniforms.add(record);
  Object.assign(shader.uniforms, { uLiveryBase: record.base, uLiveryAccent: record.accent, uLiveryGlow: record.glow });
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec2 vLiveryUv;')
    .replace('#include <uv_vertex>', '#include <uv_vertex>\nvLiveryUv = uv;');
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `#include <common>
      varying vec2 vLiveryUv;
      uniform vec3 uLiveryBase;
      uniform vec3 uLiveryAccent;
      uniform vec3 uLiveryGlow;`)
    .replace('#include <color_fragment>', `#include <color_fragment>
      vec2 uvL = vLiveryUv;
      float diagonal = abs(fract((uvL.x * 1.55 + uvL.y * 0.62) * 8.0) - 0.5);
      float chevron = 1.0 - smoothstep(0.075, 0.145, diagonal);
      float routeBand = smoothstep(0.45, 0.49, sin(uvL.y * 19.0 + sin(uvL.x * 14.0) * 1.7));
      vec2 emblemUv = fract(uvL * vec2(3.0, 2.0)) - 0.5;
      float emblem = 1.0 - smoothstep(0.16, 0.21, length(emblemUv));
      vec3 liveryColor = uLiveryBase;
      liveryColor = mix(liveryColor, uLiveryAccent, max(chevron * 0.92, routeBand * 0.72));
      liveryColor = mix(liveryColor, uLiveryGlow, emblem * 0.88);
      diffuseColor.rgb = liveryColor;`);
};
THREE.MeshStandardMaterial.prototype.customProgramCacheKey = function () {
  return `${baseCacheKey.call(this)}|matatu-livery-v2-${paintMaterial(this) ? 'paint' : 'plain'}`;
};

function makePreview(panel) {
  const canvas = panel.querySelector('#garage-preview');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth || 620, canvas.clientHeight || 360, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x10151c);
  scene.fog = new THREE.Fog(0x10151c, 16, 38);
  const camera = new THREE.PerspectiveCamera(36, 1.72, 0.1, 100);
  camera.position.set(8, 5.2, 10.5);
  camera.lookAt(0, 1.3, 0);
  scene.add(new THREE.HemisphereLight(0xc9f7ff, 0x191025, 2.1));
  const keyLight = new THREE.PointLight(0x13dfff, 42, 24);
  keyLight.position.set(-5, 6, 4); scene.add(keyLight);
  const pinkLight = new THREE.PointLight(0xff168c, 34, 24);
  pinkLight.position.set(5, 3, -3); scene.add(pinkLight);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(12, 48), new THREE.MeshStandardMaterial({ color: 0x1b222a, metalness: .35, roughness: .65 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.03; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.5, .035, 8, 96), new THREE.MeshBasicMaterial({ color: 0x16d9ed }));
  ring.rotation.x = Math.PI / 2; ring.position.y = .03; scene.add(ring);
  const bus = new THREE.Group(); scene.add(bus);
  const paint = new THREE.MeshStandardMaterial({ color: liveries[selected].base, metalness: .34, roughness: .29 });
  const accent = new THREE.MeshStandardMaterial({ color: liveries[selected].accent, emissive: liveries[selected].accent, emissiveIntensity: .28, metalness: .24, roughness: .26 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x11151a, metalness: .38, roughness: .28 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x55b6cf, emissive: 0x092331, metalness: .42, roughness: .16, transparent: true, opacity: .8 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd7e9ef, metalness: .88, roughness: .19 });
  function box(w,h,d,mat,x,y,z) { const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); m.position.set(x,y,z); m.castShadow=true; bus.add(m); return m; }
  box(6.6,1.65,3.05,paint,0,1.15,0);
  box(4.8,1.55,2.88,dark,-.2,2.72,0);
  box(4.72,.13,2.98,accent,-.2,3.57,0);
  box(.08,1.08,2.62,glass,2.22,2.72,0);
  box(.34,.95,2.86,accent,3.34,1.85,0);
  for (const z of [-1,1]) {
    box(4.4,.12,.07,accent,-.15,1.88,z*1.55);
    box(3.5,.1,.08,chrome,-.35,1.42,z*1.57);
    for (const x of [-2.05,2.05]) {
      const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.56,.56,.34,20),dark);
      wheel.rotation.x=Math.PI/2; wheel.position.set(x,.56,z*1.52); bus.add(wheel);
      const hub=new THREE.Mesh(new THREE.CylinderGeometry(.23,.23,.36,16),chrome);
      hub.rotation.x=Math.PI/2; hub.position.copy(wheel.position); bus.add(hub);
    }
  }
  // original abstract zig-zag decals on both flanks
  for (const side of [-1,1]) for (let i=0;i<7;i++) {
    const decal=box(.22,.62,.045, i%2 ? accent : chrome, -2.35+i*.72, 2.3, side*1.57);
    decal.rotation.z=(i%2 ? -1 : 1)*.52;
  }
  for (const z of [-.9,.9]) {
    box(.08,.26,.45,chrome,3.53,1.85,z);
    const lamp=box(.09,.18,.33,new THREE.MeshBasicMaterial({color:0xfff2ad}),3.6,1.86,z);
  }
  const badgeCanvas=document.createElement('canvas'); badgeCanvas.width=512; badgeCanvas.height=128;
  const ctx=badgeCanvas.getContext('2d');
  const badgeTexture=new THREE.CanvasTexture(badgeCanvas); badgeTexture.colorSpace=THREE.SRGBColorSpace;
  const badge=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.58),new THREE.MeshBasicMaterial({map:badgeTexture,transparent:true,side:THREE.DoubleSide}));
  badge.position.set(0,3.82,0); bus.add(badge);
  const updateBadge=()=>{ctx.clearRect(0,0,512,128);ctx.fillStyle='#061018';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#'+liveries[selected].accent.toString(16).padStart(6,'0');ctx.lineWidth=9;ctx.strokeRect(5,5,502,118);ctx.fillStyle='#fff';ctx.font='900 72px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(`ROUTE ${selectedRoute}`,256,66);badgeTexture.needsUpdate=true};
  updateBadge();
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  let frame=0;
  function render(){if(!panel.isConnected){observer.disconnect();renderer.dispose();return}frame++;bus.rotation.y=Math.sin(frame*.006)*.16;ring.rotation.z=frame*.002;renderer.render(scene,camera);requestAnimationFrame(render)}
  window.addEventListener('matatu:livery-change',e=>{const s=e.detail;paint.color.setHex(s.base);accent.color.setHex(s.accent);accent.emissive.setHex(s.accent);accent.emissiveIntensity=.2+((s.index%3)*.1);keyLight.color.setHex(s.accent);pinkLight.color.setHex(s.glow);updateBadge()});
  window.addEventListener('matatu:route-change',e=>{selectedRoute=e.detail.route;updateBadge()});
  resize();render();
}

function makeGarage() {
  const panel=document.createElement('section');
  panel.className='garage-screen';
  panel.setAttribute('aria-label','Matatu garage and game start');
  panel.innerHTML=`
    <div class="garage-backdrop"></div>
    <header class="garage-top"><div class="garage-logo"><span>MR</span><div><b>MATATU RUN</b><small>NAIROBI · KENYA</small></div></div><div class="garage-build">GARAGE / 01 <i></i> VEHICLE SELECT</div></header>
    <main class="garage-layout">
      <section class="garage-copy"><p class="garage-kicker"><i></i> NAIROBI AFTER DARK</p><h1>OWN THE<br><em>STREETS.</em></h1><p class="garage-description">Your matatu. Your route. Your city.<br>Choose a livery and roll out.</p>
        <div class="route-select"><div class="selector-label">SELECT MATATU ROUTE <span>ROUTE BADGE</span></div><div class="route-options" role="group" aria-label="Matatu route number"></div></div>
        <div class="skin-select"><div class="selector-label">PAINT SHOP <span id="garage-skin-count"></span></div><div class="garage-skins" role="group" aria-label="Choose a matatu skin"></div></div>
        <button id="drive-now" class="drive-now" type="button"><span>START SHIFT</span><b>→</b></button><div class="garage-controls">WASD DRIVE <i>·</i> F STAGE <i>·</i> C CAMERA</div>
      </section>
      <section class="preview-wrap"><canvas id="garage-preview" aria-label="Live 3D matatu skin preview"></canvas><div class="preview-tag"><span class="preview-dot"></span> LIVE 3D PREVIEW <small>GARAGE LIGHTS ON</small></div><div class="preview-shadow"></div></section>
    </main>
    <footer class="garage-footer"><span>MATATU RUN 3D</span><span>ORIGINAL NAIROBI MATATU GAME</span><span>PRESS ENTER TO DRIVE</span></footer>`;
  document.body.append(panel);
  const skins=panel.querySelector('.garage-skins');
  liveries.forEach((skin,index)=>{const button=document.createElement('button');button.type='button';button.className='garage-swatch';button.title=skin.name;button.setAttribute('aria-label',`Preview ${skin.name}`);button.style.setProperty('--swatch',`#${skin.base.toString(16).padStart(6,'0')}`);button.style.setProperty('--stripe',`#${skin.accent.toString(16).padStart(6,'0')}`);button.innerHTML=`<i></i><span>${skin.name}</span>`;button.addEventListener('click',()=>select(index));skins.append(button)});
  const routeOptions=panel.querySelector('.route-options');
  routes.forEach(route=>{const button=document.createElement('button');button.type='button';button.className='route-chip';button.textContent=route;button.setAttribute('aria-label',`Select route ${route}`);button.addEventListener('click',()=>setRoute(route));routeOptions.append(button)});
  function setRoute(route){selectedRoute=route;localStorage.setItem('matatu-route-number',route);panel.querySelectorAll('.route-chip').forEach(button=>{const active=button.textContent===route;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active))});window.dispatchEvent(new CustomEvent('matatu:route-change',{detail:{route}}))}
  setRoute(routes.includes(selectedRoute)?selectedRoute:'46');
  const start=()=>{if(panel.dataset.started)return;panel.dataset.started='true';const button=panel.querySelector('#drive-now');button.disabled=true;button.innerHTML='<span>STARTING SHIFT…</span><b>◌</b>';document.body.classList.add('game-starting');import('./main.js').then(()=>{panel.classList.add('garage-leaving');setTimeout(()=>{panel.remove();document.body.classList.remove('game-starting')},650)}).catch(error=>{console.error(error);button.disabled=false;button.innerHTML='<span>RETRY START</span><b>↻</b>';delete panel.dataset.started;document.body.classList.remove('game-starting')})};
  panel.querySelector('#drive-now').addEventListener('click',start);
  panel.addEventListener('keydown',e=>{if(e.code==='Enter'){e.preventDefault();start()}if(e.code==='ArrowRight')select(selected+1);if(e.code==='ArrowLeft')select(selected-1)});
  panel.tabIndex=0;
  panel.querySelectorAll('.garage-swatch').forEach((button,index)=>{button.addEventListener('click',()=>{panel.querySelectorAll('.garage-swatch').forEach((item,i)=>{item.classList.toggle('selected',i===index);item.setAttribute('aria-pressed',String(i===index))});panel.querySelector('#garage-skin-count').textContent=`${String(index+1).padStart(2,'0')} / ${liveries.length}`})});
  select(selected);
  makePreview(panel);
}

function select(index) {
  selected=(index+liveries.length)%liveries.length;
  const skin=liveries[selected];
  for(const record of uniforms){record.base.value.setHex(skin.base);record.accent.value.setHex(skin.accent);record.glow.value.setHex(skin.glow)}
  document.querySelectorAll('.garage-swatch').forEach((button,i)=>{button.classList.toggle('selected',i===selected);button.setAttribute('aria-pressed',String(i===selected))});
  const count=document.getElementById('garage-skin-count');if(count)count.textContent=`${String(selected+1).padStart(2,'0')} / ${liveries.length}`;
  window.dispatchEvent(new CustomEvent('matatu:livery-change',{detail:{...skin,index:selected}}));
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',makeGarage,{once:true});else makeGarage();
// Import gameplay only after the player selects START SHIFT.
