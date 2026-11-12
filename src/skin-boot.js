import * as THREE from 'three';
import './skins.css';

// Original procedural liveries, inspired by broad Kenyan matatu color and
// geometric-art traditions. No Instagram photos, logos, portraits, or lettering
// are downloaded or copied into the game.
const liveries = [
  { name: 'CBD CHROME', base: 0x102536, accent: 0x08d9ef, glow: 0xff5d3d, detail: 'Electric cyan · sunset orange' },
  { name: 'SHENG STAR', base: 0x35114d, accent: 0xf12b9b, glow: 0xffd441, detail: 'Violet · hot pink · gold' },
  { name: 'SAVANNAH PULSE', base: 0xb83f12, accent: 0xffca22, glow: 0x111a22, detail: 'Copper · gold · charcoal' },
  { name: 'NIGHT RUNNER', base: 0x12151c, accent: 0x6a37ff, glow: 0x00f0b5, detail: 'Midnight · ultraviolet · mint' },
  { name: 'GREEN MACHINE', base: 0x176b28, accent: 0xc6ff24, glow: 0xfff0a3, detail: 'Kijani · lime · warm white' },
];
let selected = 0;
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
  Object.assign(shader.uniforms, {
    uLiveryBase: record.base,
    uLiveryAccent: record.accent,
    uLiveryGlow: record.glow,
  });

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
      // Bold original wrap: broken diagonal stripes, a route band and a
      // small graphic medallion. UV math keeps the livery light and asset-free.
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
  return `${baseCacheKey.call(this)}|matatu-livery-v1-${paintMaterial(this) ? 'paint' : 'plain'}`;
};

function makePicker() {
  const panel = document.createElement('section');
  panel.className = 'livery-picker';
  panel.setAttribute('aria-label', 'Matatu livery selector');
  panel.innerHTML = `
    <div class="livery-heading"><span class="livery-icon">✦</span><div><small>MATATU GARAGE</small><strong>CUSTOM PAINT</strong></div></div>
    <div class="livery-current"><span id="livery-name"></span><span id="livery-detail"></span></div>
    <div class="livery-options" role="group" aria-label="Choose a paint skin"></div>
    <div class="livery-foot"><span>ORIGINAL NGANYA-INSPIRED DESIGNS</span><span>SKINS <b id="livery-count"></b></span></div>`;
  document.body.append(panel);
  const options = panel.querySelector('.livery-options');
  liveries.forEach((skin, index) => {
    const button = document.createElement('button');
    button.className = 'livery-swatch';
    button.type = 'button';
    button.title = skin.name;
    button.setAttribute('aria-label', `Select ${skin.name} livery`);
    button.style.setProperty('--swatch', `#${skin.base.toString(16).padStart(6, '0')}`);
    button.style.setProperty('--stripe', `#${skin.accent.toString(16).padStart(6, '0')}`);
    button.innerHTML = '<span class="swatch-mark">✦</span>';
    button.addEventListener('click', () => select(index));
    options.append(button);
  });
  select(0);
}

function select(index) {
  selected = (index + liveries.length) % liveries.length;
  const skin = liveries[selected];
  for (const record of uniforms) {
    record.base.value.setHex(skin.base);
    record.accent.value.setHex(skin.accent);
    record.glow.value.setHex(skin.glow);
  }
  const name = document.getElementById('livery-name');
  if (!name) return;
  name.textContent = skin.name;
  document.getElementById('livery-detail').textContent = skin.detail;
  document.getElementById('livery-count').textContent = `${String(selected + 1).padStart(2, '0')} / ${liveries.length}`;
  document.querySelectorAll('.livery-swatch').forEach((button, i) => {
    button.classList.toggle('selected', i === selected);
    button.setAttribute('aria-pressed', String(i === selected));
  });
  window.dispatchEvent(new CustomEvent('matatu:livery-change', { detail: { ...skin, index: selected } }));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', makePicker, { once: true });
} else {
  makePicker();
}
await import('./main.js');
