// 3D "lazy susan" picker built with three.js.
// createWheel(container) returns { setItems, spinTo, resumeIdle } or null if WebGL is unavailable.
import * as THREE from 'three';

const PALETTE = [
  { bg: '#D9502B', fg: '#FFF8EE' },
  { bg: '#F2A541', fg: '#2A1C10' },
  { bg: '#2F6B4F', fg: '#FFF8EE' },
  { bg: '#C77D4F', fg: '#FFF8EE' },
  { bg: '#E9D8B4', fg: '#2A1C10' },
  { bg: '#5C8A6E', fg: '#FFF8EE' },
  { bg: '#B8452A', fg: '#FFF8EE' },
  { bg: '#8A9B3A', fg: '#FFF8EE' },
];

const TAU = Math.PI * 2;
const R = 2;

export function createWheel(container) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    if (!renderer.getContext()) return null;
  } catch (e) {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  const camBase = new THREE.Vector3(0, 4.35, 4.6);
  const lookAt = new THREE.Vector3(0, -0.1, 0.25);

  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x3a3226, 1.15));
  const sun = new THREE.DirectionalLight(0xffffff, 1.7);
  sun.position.set(2.5, 6.5, 2.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -3.5, right: 3.5, top: 3.5, bottom: -3.5, near: 1, far: 16 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.3;
  ground.receiveShadow = true;
  scene.add(ground);

  // Everything that spins lives in this group.
  const spinner = new THREE.Group();
  scene.add(spinner);

  const woodTex = makeWoodTexture();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.14, R + 0.2, 0.24, 128),
    new THREE.MeshStandardMaterial({ color: 0xffffff, map: woodTex, roughness: 0.65 })
  );
  base.position.y = -0.13;
  base.castShadow = true;
  base.receiveShadow = true;
  spinner.add(base);

  const faceCanvas = document.createElement('canvas');
  faceCanvas.width = faceCanvas.height = 1024;
  const faceTex = new THREE.CanvasTexture(faceCanvas);
  faceTex.colorSpace = THREE.SRGBColorSpace;
  faceTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const face = new THREE.Mesh(new THREE.CircleGeometry(R, 160), new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.5 }));
  face.rotation.x = -Math.PI / 2;
  face.position.y = 0.001;
  face.receiveShadow = true;
  spinner.add(face);

  const cream = new THREE.MeshStandardMaterial({ color: 0xf6eedd, roughness: 0.35, metalness: 0.05 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R + 0.03, 0.065, 20, 160), cream);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.02;
  rim.castShadow = true;
  spinner.add(rim);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.18, 64), cream);
  hub.position.y = 0.09;
  hub.castShadow = true;
  spinner.add(hub);
  const hubDot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.04, 48),
    new THREE.MeshStandardMaterial({ color: 0xd9502b, roughness: 0.4 })
  );
  hubDot.position.y = 0.2;
  spinner.add(hubDot);

  const pegs = new THREE.Group();
  spinner.add(pegs);
  const pegGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16);

  // Pointer sits at the front (+z, toward the camera) and points at the center.
  const pointer = new THREE.Group();
  const pointerMat = new THREE.MeshStandardMaterial({ color: 0xd9502b, roughness: 0.35 });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.46, 32), pointerMat);
  cone.rotation.x = -Math.PI / 2;
  cone.castShadow = true;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), pointerMat);
  knob.position.z = 0.24;
  knob.castShadow = true;
  pointer.add(cone, knob);
  pointer.position.set(0, 0.24, R + 0.32);
  scene.add(pointer);

  let labels = [];
  let theta = 0;
  let idle = true;
  let anim = null;
  let lastIdx = -1;
  let wobble = 0;
  let disposed = false;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawFace() {
    const ctx = faceCanvas.getContext('2d');
    const S = faceCanvas.width;
    const c = S / 2;
    const r = S / 2;
    const n = Math.max(labels.length, 1);
    const step = TAU / n;
    ctx.clearRect(0, 0, S, S);

    for (let i = 0; i < n; i++) {
      let pal = PALETTE[i % PALETTE.length];
      if (n > 1 && i === n - 1 && (n - 1) % PALETTE.length === 0) pal = PALETTE[2];
      const a0 = i * step - step / 2;
      const a1 = i * step + step / 2;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.arc(c, c, r, a0, a1);
      ctx.closePath();
      ctx.fillStyle = pal.bg;
      ctx.fill();

      // subtle inner shading toward the center
      const g = ctx.createRadialGradient(c, c, 0, c, c, r);
      g.addColorStop(0, 'rgba(0,0,0,0.18)');
      g.addColorStop(0.45, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(255,255,255,0.06)');
      ctx.fillStyle = g;
      ctx.fill();

      if (n > 1) {
        ctx.strokeStyle = 'rgba(255,248,238,0.9)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.lineTo(c + Math.cos(a1) * r, c + Math.sin(a1) * r);
        ctx.stroke();
      }

      const text = labels[i] || '';
      if (text) {
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(i * step);
        const outer = r - 46;
        const inner = 190;
        const maxW = outer - inner;
        let size = 50;
        ctx.font = `700 ${size}px "DM Sans", system-ui, sans-serif`;
        while (ctx.measureText(text).width > maxW && size > 26) {
          size -= 2;
          ctx.font = `700 ${size}px "DM Sans", system-ui, sans-serif`;
        }
        let shown = text;
        while (ctx.measureText(shown).width > maxW && shown.length > 4) shown = shown.slice(0, -2) + '…';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = pal.fg;
        ctx.shadowColor = 'rgba(0,0,0,0.25)';
        ctx.shadowBlur = pal.fg === '#FFF8EE' ? 6 : 0;
        ctx.fillText(shown, outer, 2);
        ctx.restore();
      }
    }

    // center plate
    ctx.beginPath();
    ctx.arc(c, c, 160, 0, TAU);
    ctx.fillStyle = '#F6EEDD';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.stroke();

    faceTex.needsUpdate = true;

    // pegs at sector boundaries
    pegs.clear();
    if (labels.length > 1) {
      const pegMat = cream;
      for (let i = 0; i < n; i++) {
        const a = i * step + step / 2;
        const peg = new THREE.Mesh(pegGeo, pegMat);
        // canvas angle a maps to local (cos a, sin a) on the x/z plane
        peg.position.set(Math.cos(a) * (R - 0.09), 0.07, Math.sin(a) * (R - 0.09));
        peg.castShadow = true;
        pegs.add(peg);
      }
    }
  }

  function setItems(newLabels) {
    labels = newLabels.slice();
    drawFace();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => !disposed && drawFace());
    idle = true;
    lastIdx = -1;
  }

  function indexUnderPointer() {
    const n = Math.max(labels.length, 1);
    const step = TAU / n;
    const phi = theta + Math.PI / 2;
    return ((Math.round(phi / step) % n) + n) % n;
  }

  function spinTo(index) {
    const n = Math.max(labels.length, 1);
    const step = TAU / n;
    return new Promise((resolve) => {
      const base = index * step - Math.PI / 2;
      let target = base + TAU * Math.ceil((theta - base) / TAU);
      target += TAU * (reduceMotion ? 1 : 5);
      target += (Math.random() - 0.5) * step * 0.5;
      idle = false;
      anim = { from: theta, to: target, start: performance.now(), duration: reduceMotion ? 700 : 4300, resolve };
    });
  }

  function resumeIdle() {
    if (!anim) idle = true;
  }

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fit = camera.aspect < 1.2 ? 1.2 / camera.aspect : 1;
    camera.position.copy(camBase).multiplyScalar(fit);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  let last = performance.now();
  function frame(now) {
    if (disposed) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (anim) {
      const t = Math.min((now - anim.start) / anim.duration, 1);
      const e = 1 - Math.pow(1 - t, 4);
      theta = anim.from + (anim.to - anim.from) * e;
      const idx = indexUnderPointer();
      if (idx !== lastIdx) {
        lastIdx = idx;
        wobble = 1;
      }
      if (t >= 1) {
        const done = anim.resolve;
        anim = null;
        done();
      }
    } else if (idle && !reduceMotion) {
      theta += dt * 0.12;
    }

    wobble *= 0.86;
    pointer.rotation.y = Math.sin(now / 30) * wobble * 0.18 + wobble * 0.22;
    spinner.rotation.y = theta;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { setItems, spinTo, resumeIdle, indexUnderPointer };
}

function makeWoodTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#8A5A36';
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 70; i++) {
    const y = Math.random() * c.height;
    ctx.strokeStyle = `rgba(${Math.random() < 0.5 ? '60,35,18' : '170,120,80'},${0.08 + Math.random() * 0.15})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= c.width; x += 32) ctx.lineTo(x, y + Math.sin(x / 40 + i) * 2);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 1);
  return t;
}
