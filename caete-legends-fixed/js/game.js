// game.js - minimal Three.js scene starter (non-blocking)
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('game-root');
  if (!container) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Renderer appended to DOM but set to pointer-events none so it doesn't block UI interactions
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.pointerEvents = 'none';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 0, 10);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  // simple geometry (for visual reference)
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshStandardMaterial({ color: 0x4488ff, transparent: true, opacity: 0.06 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0,0,-5);
  scene.add(cube);

  function onResize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  (function loop(){
    cube.rotation.x += 0.001;
    cube.rotation.y += 0.002;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
});
