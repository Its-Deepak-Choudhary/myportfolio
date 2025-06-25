<!-- External Libraries -->
<!-- Forked from https://codepen.io/vcomics/pen/NVwyGq -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/100/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js"></script>
<script src="https://unpkg.com/three@0.84.0/examples/js/controls/OrbitControls.js"></script>

<style>
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #000;
    font-family: monospace;
    color: white;
  }
  
  body {

  font-family: Bague, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
    background: rgb(48, 68, 67);
  
  background:  #628f84;
  background: #768ca8;
  background: #d7dddd;
  background: #e4eeef;


}

body:after {
  content: "";
  position: fixed;
  top: -10rem;
  left: -10rem;
  width: calc(100vw + 100rem);
  height: calc(100vh + 100rem);
  background-image: image-set(url("https://i.imgur.com/N0STPcn.png") type("image/png"));
  opacity: 0.4;
  z-index: 1000;
  animation: noise 1s steps(2) infinite;
}

@keyframes noise {
  0% { transform: translate3d(0, 9rem, 0); }
  50% { transform: translate3d(-9rem, -4rem, 0); }
  100% { transform: translate3d(-7rem, 0, 0); }
}

  .header {
    position: fixed;
    top: 0;
    width: 100%;
    padding: 1rem;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }

  #canvas-container {
  height: 200vh;
  width: 100%;
  position: relative;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: block;
  z-index: 1;
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 15%;
  transform: translateY(-50%);
  text-align: left;
  z-index: 2;
  font-size: 35px;
  font-weight: 400;
  mix-blend-mode: difference;
  color: grey;
  max-width: 50%;
  line-height: 1.3;
  pointer-events: none;
}


.color-change {
  color: inherit; /* Will invert depending on background */
}

</style>
<div id="canvas-container"></div>

<div class="overlay-text">
  <div><span class="color-change">This is placeholder text for a brief overview of my writing. It will eventually describe the focus, tone, and themes of my work. </span> </div>
</div>


<script>
  window.addEventListener('load', init, false);

  function init() {
    createWorld();
    createLights();
    createPrimitive();
    animation();
  }

  var Theme = {
    primary: 0xd7dddd,
    secundary: 0x0000FF,
    danger: 0xFF0000,
    darker: 0x101010
  };

  var scene, camera, renderer, controls;
  var _group = new THREE.Group();

  function createWorld() {
    const _width = window.innerWidth;
  const _height = document.getElementById('canvas-container').clientHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(Theme.primary, 9, 13);
    scene.background = null;


    camera = new THREE.PerspectiveCamera(35, _width / _height, 1, 1000);
    camera.position.set(0, 0, 10);

 renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(_width, _height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.update();

document.getElementById('canvas-container').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize() {
    const _width = window.innerWidth;
    const _height = window.innerHeight;
    renderer.setSize(_width, _height);
    camera.aspect = _width / _height;
    camera.updateProjectionMatrix();
  }

  function createLights() {
    const hemiLight = new THREE.HemisphereLight(Theme.primary, Theme.darker, 1);
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    dirLight.position.set(10, 20, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 5000;
    dirLight.shadow.mapSize.height = 5000;
    dirLight.penumbra = 0.8;

    scene.add(hemiLight);
    scene.add(dirLight);
  }

  function CreateBook() {
    this.mesh = new THREE.Object3D();

    const geo_cover = new THREE.BoxGeometry(2.4, 3, 0.05);
    const lmo_cover = new THREE.BoxGeometry(0.05, 3, 0.59);
    const ppr_cover = new THREE.BoxGeometry(2.3, 2.8, 0.5);

    const dartmouthGreens = [0x475b47];
    const randomGreen = dartmouthGreens[Math.floor(Math.random() * dartmouthGreens.length)];

    const mat = new THREE.MeshPhongMaterial({ color: randomGreen });
    const mat_paper = new THREE.MeshPhongMaterial({ color: 0xFFFFFF});

    const _cover1 = new THREE.Mesh(geo_cover, mat);
    const _cover2 = new THREE.Mesh(geo_cover, mat);
    const _lomo = new THREE.Mesh(lmo_cover, mat);
    const _paper = new THREE.Mesh(ppr_cover, mat_paper);

    [_cover1, _cover2, _lomo, _paper].forEach(mesh => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    _cover1.position.z = 0.3;
    _cover2.position.z = -0.3;
    _lomo.position.x = 2.4 / 2;

    this.mesh.add(_cover1, _cover2, _lomo, _paper);
  }

  function isTooClose(newObj, others, minDistance = 1.5) {
    const newPos = newObj.position;
    for (let existing of others) {
      const dx = newPos.x - existing.position.x;
      const dy = newPos.y - existing.position.y;
      const dz = newPos.z - existing.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < minDistance) return true;
    }
    return false;
  }

  function createPrimitive() {
    const placedBooks = [];
    const a = 2;

    for (let i = 0; i < 12; i++) {
      const _object = new CreateBook();
      const s = 0.1 + Math.random() * 0.4;
      _object.mesh.scale.set(s, s, s);

      let tries = 0;
      do {
        _object.mesh.position.x = (Math.random() - 0.5) * a * 2;
        _object.mesh.position.y = (Math.random() - 0.5) * a * 2;
        _object.mesh.position.z = (Math.random() - 0.5) * a * 2;
        tries++;
      } while (isTooClose(_object.mesh, placedBooks) && tries < 20);

      _object.mesh.rotation.x = Math.random() * 2 * Math.PI;
      _object.mesh.rotation.y = Math.random() * 2 * Math.PI;
      _object.mesh.rotation.z = Math.random() * 2 * Math.PI;

      TweenMax.to(_object.mesh.rotation, 8 + Math.random() * 8, {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
        yoyo: true,
        repeat: -1,
        ease: Sine.easeInOut,
        delay: 0.05 * i
      });

      _group.add(_object.mesh);
      placedBooks.push(_object.mesh);
    }

    scene.add(_group);
     _group.position.x = 2; 
  }

  function animation() {
    _group.rotation.x -= 0.003;
    _group.rotation.y -= 0.003;
    _group.rotation.z -= 0.003;
    controls.update();
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
  }
</script>