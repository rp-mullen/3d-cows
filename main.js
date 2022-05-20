import './style.css'

import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);

renderer.render( scene, camera );


const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,20,20);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);


/*
// background texture
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
const stageTexture = new THREE.TextureLoader().load('stage.jpg');
const scifiTexture = new THREE.TextureLoader().load('scifi.jpg');
scene.background = stageTexture;
*/

var texture = new THREE.TextureLoader().load('/assets/cowtexture.png');

var pieces = [];

const mtlLoader = new MTLLoader();
function loadObject(o,n) {
  mtlLoader.load(
    '/assets/'+o+'.mtl',
    (materials) => {
      materials.preload()

      const objLoader = new OBJLoader()
      objLoader.setMaterials(materials);
      objLoader.load('/assets/'+o+'.obj', (object) => {
        object.name = n

        const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 80 ));
        object.position.set(x,y,z);

        object.scale.x = 7
        object.scale.y = 7
        object.scale.z = 7

        object.traverse( function(child) {
          if ( child instanceof THREE.Mesh ) {
            child.material.map = texture;
          }
        })

        object.rotation.x = randomIntFromInterval(-0.5,0.5)
        object.rotation.y = randomIntFromInterval(-0.5,0.5)
        object.rotation.z = randomIntFromInterval(-0.5,0.5)

        scene.add(object)
      })
    }
  )
}

function getObject(n) {
  return scene.getObjectByName(n);
}


camera.position.y += 20
camera.position.z += 10

function loadNCows(N) {
  for (var i = 0; i < N; i++) {
    loadObject('cow','cow'+i);
    pieces.push('cow'+i);
  }
}



function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

loadNCows(10);

var drifts = []
var rotations = []

for (var i  = 0; i < pieces.length; i++) {
  let dir = [];
  let rot = [];
  for (var j = 0; j < 3; j++) {
    dir.push(randomIntFromInterval(-1,1));
    rot.push(randomIntFromInterval(-1,1));
  }
  drifts.push(dir)
}




function animate() {
  requestAnimationFrame( animate );

  for (var i = 0; i < pieces.length; i++) {
    //console.log('p: '+pieces[i])
    camera.rotation.y -= Math.PI / 3;
    camera.rotation.x -= Math.PI / 3;
    camera.rotation.z -= Math.PI / 3;
    var object = getObject(pieces[i]);

    object.rotation.x += drifts[i][0]*0.005;
    object.rotation.y += drifts[i][1]*0.005;
    object.rotation.z += drifts[i][2]*0.005;

    object.position.x += drifts[i][0]*0.0008
    object.position.y += drifts[i][1]*0.0008
    object.position.z += drifts[i][2]*0.0008

  }

  camera.position.z -= 0.008;
  controls.update();
  renderer.render( scene, camera );
}

animate()
