/* global THREE */
const THREE = window.THREE;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const ambientLight = new THREE.AmbientLight(0x00ff88, 0.6);
scene.add(ambientLight);

const particles = new THREE.Points(
  new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 200 }, () => new THREE.Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 10 - 5))
  ),
  new THREE.PointsMaterial({ color: 0xff69b4, size: 0.05 })
);
scene.add(particles);

camera.position.z = 10;

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

export function setLightByTurn(isPlayerTurn) {
  ambientLight.color.set(isPlayerTurn ? 0x00ff88 : 0xff4444);
}

