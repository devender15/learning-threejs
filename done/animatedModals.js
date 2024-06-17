import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const monkeyUrl = new URL("/models/doggo2.glb", import.meta.url);
// const monkeyUrl = new URL("/models/man.max", import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

renderer.setClearColor(0xa3a3a3);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
// orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const assetLoader = new GLTFLoader();

let mixer;

assetLoader.load(
  monkeyUrl.href,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;
    // const clip = THREE.AnimationClip.findByName(clips, "HeadAction");
    // const action = mixer.clipAction(clip);
    // action.play();
    clips.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
    });
  },
  undefined,
  (err) => {
    console.log(err);
  }
);

const clock = new THREE.Clock();

function animate() {
  if (mixer) {
    mixer.update(clock.getDelta());
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
