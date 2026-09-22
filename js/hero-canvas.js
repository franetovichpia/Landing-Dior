import * as THREE from './vendor/three.module.min.js';

const canvas = document.getElementById('heroCanvas');
const hero = document.getElementById('inicio');
if (canvas && hero && 'IntersectionObserver' in window) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 3.6, 7.4);

  const WIDTH = 18;
  const DEPTH = 12;
  const SEGMENTS_X = 90;
  const SEGMENTS_Y = 56;

  const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH, SEGMENTS_X, SEGMENTS_Y);
  geometry.rotateX(-Math.PI / 2.3);
  const positionAttr = geometry.attributes.position;
  const basePositions = Float32Array.from(positionAttr.array);

  const material = new THREE.MeshBasicMaterial({
    color: 0xc9bad0,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  const terrain = new THREE.Mesh(geometry, material);
  scene.add(terrain);

  // Lightweight value-noise (no external deps) for organic, contour-like undulation.
  function ridge(x, y, t) {
    return (
      Math.sin(x * 0.45 + t) * Math.cos(y * 0.4 - t * 0.6) * 0.7 +
      Math.sin(x * 0.9 - t * 0.4 + y * 0.6) * 0.35 +
      Math.sin(y * 0.25 + t * 0.3) * 0.4
    );
  }

  let targetX = 0;
  let targetY = 0;
  window.addEventListener(
    'pointermove',
    (event) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  function resize() {
    const rect = hero.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  let isVisible = true;
  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
    },
    { threshold: 0 }
  );
  observer.observe(hero);

  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  let rafId = null;

  function renderStaticFrame() {
    const arr = positionAttr.array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 2] = basePositions[i + 2] + ridge(basePositions[i] * 0.4, basePositions[i + 1] * 0.4, 0) * 0.9;
    }
    positionAttr.needsUpdate = true;
    renderer.render(scene, camera);
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!isVisible) return;

    const t = clock.getElapsedTime() * 0.32;
    const arr = positionAttr.array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = basePositions[i];
      const y = basePositions[i + 1];
      arr[i + 2] = basePositions[i + 2] + ridge(x * 0.4, y * 0.4, t) * 0.9;
    }
    positionAttr.needsUpdate = true;

    camera.position.x += (targetX * 1.4 - camera.position.x) * 0.02;
    camera.position.y += (3.6 - targetY * 0.7 - camera.position.y) * 0.02;
    camera.lookAt(0, -0.4, 0);

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    renderStaticFrame();
  } else {
    animate();
  }

  document.addEventListener('visibilitychange', () => {
    if (prefersReducedMotion) return;
    if (document.hidden && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && rafId === null) {
      animate();
    }
  });
}
