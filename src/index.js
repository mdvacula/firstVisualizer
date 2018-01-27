  //imports
const THREE = require('three');

//set window size for Fast Fourier Transform
let fftSize = 1024;

//variable for audio file with default set
let audioFile = "../assets/flags-feat-yuna.mp3";
//bool to handle pausing
let isPlaying = false;

//logic for loading a new song
// **CLEAN UP
let audioInput = document.getElementById("songFile");
audioInput.onchange = (event) => {
  let fileList = audioInput.files;
  audioFile = URL.createObjectURL(fileList[0]);
  audio.pause();
  isPlaying = false;
  audioLoader.load(audioFile, (buffer) => {
    audio.setBuffer(buffer);
    audio.setLoop(true);
    audio.play();
    isPlaying = true;
  });
}

//Logic for play pause button
//**CLEAN UP**
let playPause = document.getElementById("playPause");
playPause.onclick = (event) => {
  event.preventDefault();
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    console.log("click");
    audio.play();
    isPlaying = true;
  }
}

//init Threejs objects
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

let container = document.getElementById('container');
container.appendChild(renderer.domElement);

let audioLoader = new THREE.AudioLoader();

let listener = new THREE.AudioListener();

let audio = new THREE.Audio(listener);

audioLoader.load(audioFile, (buffer) => {
  audio.setBuffer(buffer);
  audio.setLoop(true);
  audio.play();
  isPlaying = true;
});

let analyser = new THREE.AudioAnalyser(audio, fftSize);

let uniforms = {
  tAudioData: {
    value: new THREE.DataTexture(analyser.data, fftSize / 2, 1, THREE.LuminanceFormat)
  }
};

console.log(uniforms.tAudioData.value);

//set material properties
let material = new THREE.ShaderMaterial({uniforms: uniforms,
   vertexShader: document.getElementById('vertexShader').textContent,
   fragmentShader: document.getElementById('fragmentShader').textContent});

//set geometry params
let geometry = new THREE.PlaneBufferGeometry(1.5, 1);

//set mesh
let mesh = new THREE.Mesh(geometry, material);
//add mesh
scene.add(mesh);

//funciton to handle animation
let animate = () => {
  requestAnimationFrame(animate);
  render();
};

//function to handle rendering
let render = () => {
  analyser.getFrequencyData();
  uniforms.tAudioData.value.needsUpdate = true;
  renderer.render(scene, camera);
};

//call animation function
animate();
