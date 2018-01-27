const THREE = require('three');

let fftSize = 128;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

let audioLoader = new THREE.AudioLoader();

let listener = new THREE.AudioListener();

let audio = new THREE.Audio(listener);

audioLoader.load('../assets/flags-feat-yuna.mp3', (buffer) => {
  audio.setBuffer(buffer);
  audio.setLoop(true);
  audio.play();
});

let analyser = new THREE.AudioAnalyser(audio, fftSize);

let uniforms = {
  tAudioData: {
    value: new THREE.DataTexture(analyser.data, fftSize / 2, 1, THREE.LuminanceFormat)
  }
};

let material = new THREE.ShaderMaterial({uniforms: uniforms, vertexShader: document.getElementById('vertexShader').textContent, fragmentShader: document.getElementById('fragmentShader').textContent});

let geometry = new THREE.PlaneBufferGeometry(1, 1);

let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let animate = () => {
  requestAnimationFrame(animate);
  render();
};

let render = () => {
  analyser.getFrequencyData();
  uniforms.tAudioData.value.needsUpdate = true;
  renderer.render(scene, camera);
};

animate();
