import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import CameraControls from 'camera-controls'
import * as holdEvent from 'hold-event'

CameraControls.install({ THREE: THREE })

const container = document.querySelector('#demo3')

function init () {
  /* Test Models. Download from URLs below into ./models */

  const urlParams = new URLSearchParams(window.location.search)
  let model = ''

  if (urlParams.get('model') === '1') {
    // George Washington downloaded from: https://3d.si.edu/object/3d/george-washington:789cf90a-4387-4ac1-9e96-c7d6a7b9d26f
    model = 'models/george-washington/george-washington-greenough-statue-(1840)-150k-4096-web.gltf'
  } else if (urlParams.get('model') === '2') {
    // Blue Crab downloaded from: https://3d.si.edu/object/3d/blue-crab:b0bf6d44-af22-40dc-bd85-7d66255be4a7
    model = 'models/blue-crab/blue-crab-150k-4096-web.gltf'
  } else if (urlParams.get('model') === '3') {
    // Side Chair downloaded from: https://3d.si.edu/object/3d/side-chair:57d30b85-3549-40dc-99c3-255249867462
    model = 'models/side-chair/pergolesi_side_chair_mesh-100k-web.gltf'
  } else if (urlParams.get('model') === '4') {
    // Apolo Interior downloaded from: https://3d.si.edu/object/3d/command-module-apollo-11:d8c63e8a-4ebc-11ea-b77f-2e728ce88125
    model = 'models/apollo-interior/apollo_interior-medium_resolution.gltf'
  } else if (urlParams.get('model') === '5') {
    // Avocado GLTF downloaded from: https://poly.google.com/view/196c4VRe6Ch
    model = 'models/avocado/Avocado.gltf'
  } else {
    document.querySelector('.container').innerText = 'Invalid model parameter or number in URL query string.'
  }

  /* Camera, Scene, and Renderer */

  const scene = new THREE.Scene()

  const fov = 35
  const aspect = container.clientWidth / container.clientHeight
  const near = 0.1
  const far = 100

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

  camera.position.set(0, 0, 1)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  container.appendChild(renderer.domElement)

  /* Camera Controls */

  const cameraControls = new CameraControls(camera, renderer.domElement)

  const clock = new THREE.Clock()

  function resizeContainer () {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', resizeContainer)

  renderer.render(scene, camera);

  (function anim () {
    const delta = clock.getDelta()
    const hasControlsUpdated = cameraControls.update(delta)

    requestAnimationFrame(anim)

    if (hasControlsUpdated) {
      renderer.render(scene, camera)
    }
  })()

  /* Lights */

  const light = new THREE.AmbientLight(0x404040)

  scene.add(light)

  renderer.physicallyCorrectLights = true

  /* Light Intensity Control */

  const intensitySlider = document.querySelector('#intensity')

  function updateIntensity () {
    light.intensity = intensitySlider.value
    renderer.render(scene, camera)
  }

  intensitySlider.addEventListener('input', updateIntensity)

  updateIntensity()

  // Auto camera positioning with GLTF loader for displaying models at similar size in viewport. Adapted from: https://threejsfundamentals.org/threejs/lessons/threejs-load-gltf.html:

  function frameArea (sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5)
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY)

    const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize()

    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter))
    camera.near = boxSize / 100
    camera.far = boxSize * 100
    camera.updateProjectionMatrix()
  }

  const gltfLoader = new GLTFLoader()

  gltfLoader.load(model, (gltf) => {
    const root = gltf.scene

    // rotate object a little off X and Y center:
    root.rotateX(5 * THREE.Math.DEG2RAD)
    root.rotateY(-30 * THREE.Math.DEG2RAD)

    scene.add(root)

    const box = new THREE.Box3().setFromObject(root)
    const boxSize = box.getSize(new THREE.Vector3()).length()
    const boxCenter = box.getCenter(new THREE.Vector3())

    frameArea(boxSize * 1, boxSize, boxCenter, camera)

    /* Camera Controls */

    cameraControls.fitTo(box)

    const buttonReset = document.querySelector('#resetcamera')

    buttonReset.addEventListener('click', function () {
      cameraControls.rotateTo(0 * THREE.Math.DEG2RAD, 90 * THREE.Math.DEG2RAD, true)
      cameraControls.fitTo(box, true)
      removeGrids()
    })

    /* Keyboard Controls */

    const KEYCODE = {
      W: 87,
      A: 65,
      S: 83,
      D: 68,
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40
    }

    // WASD keys for panning and zooming:

    const wKey = new holdEvent.KeyboardKeyHold(KEYCODE.W, 100)
    const aKey = new holdEvent.KeyboardKeyHold(KEYCODE.A, 100)
    const sKey = new holdEvent.KeyboardKeyHold(KEYCODE.S, 100)
    const dKey = new holdEvent.KeyboardKeyHold(KEYCODE.D, 100)
    wKey.addEventListener('holding', function (event) { cameraControls.forward(boxSize * 0.0005 * event.deltaTime, true) })
    aKey.addEventListener('holding', function (event) { cameraControls.truck(-boxSize * 0.0005 * event.deltaTime, 0, true) })
    sKey.addEventListener('holding', function (event) { cameraControls.forward(-boxSize * 0.0005 * event.deltaTime, true) })
    dKey.addEventListener('holding', function (event) { cameraControls.truck(boxSize * 0.0005 * event.deltaTime, 0, true) })

    // Arrow keys for rotating:

    const leftKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_LEFT, 100)
    const rightKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_RIGHT, 100)
    const upKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_UP, 100)
    const downKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_DOWN, 100)
    leftKey.addEventListener('holding', function (event) { cameraControls.rotate(-0.1 * THREE.Math.DEG2RAD * event.deltaTime, 0, true) })
    rightKey.addEventListener('holding', function (event) { cameraControls.rotate(0.1 * THREE.Math.DEG2RAD * event.deltaTime, 0, true) })
    upKey.addEventListener('holding', function (event) { cameraControls.rotate(0, -0.05 * THREE.Math.DEG2RAD * event.deltaTime, true) })
    downKey.addEventListener('holding', function (event) { cameraControls.rotate(0, 0.05 * THREE.Math.DEG2RAD * event.deltaTime, true) })

    /* Debug Menu */

    const debugBoxSize = document.querySelector('#boxsize')
    const debugCameraNear = document.querySelector('#cameranear')
    const debugCameraFar = document.querySelector('#camerafar')
    const debugMenu = document.querySelector('#debugmenu')

    if (urlParams.get('debug') === 'true') {
      debugMenu.hidden = false
      const boxHelper = new THREE.Box3Helper(box, 0xff0000)
      scene.add(boxHelper)
      resizeContainer()
    }

    debugBoxSize.innerText = boxSize.toFixed(3)
    debugCameraNear.innerText = camera.near.toFixed(3)
    debugCameraFar.innerText = camera.far.toFixed(3)

    /* Measurement Grid */

    const boxYHalfLength = Math.round(box.getSize(new THREE.Vector3()).x / 2)
    const boxZHalfLength = Math.round(box.getSize(new THREE.Vector3()).z / 2)
    const gridOptionsButton = document.querySelector('#gridoptionsbutton')
    const gridOptions = document.querySelector('#gridoptions')
    const gridXRadioButton = document.querySelector('#gridxbutton')
    const gridYRadioButton = document.querySelector('#gridybutton')

    const gridX = new THREE.GridHelper(boxSize, 10, 0x000000, 0x000000)
    gridX.position.y = -boxYHalfLength
    gridX.rotateX(5 * THREE.Math.DEG2RAD)
    gridX.rotateY(-30 * THREE.Math.DEG2RAD)

    const gridY = new THREE.GridHelper(boxSize, 10, 0x000000, 0x000000)
    gridY.position.z = -boxZHalfLength
    gridY.rotateX(95 * THREE.Math.DEG2RAD)
    gridY.rotateZ(30 * THREE.Math.DEG2RAD)

    function gridToggle () {
      if (gridXRadioButton.checked === true) {
        scene.add(gridX)
        scene.remove(gridY)
      }
      if (gridYRadioButton.checked === true) {
        scene.add(gridY)
        scene.remove(gridX)
      }
      renderer.render(scene, camera)
    }

    function removeGrids () {
      scene.remove(gridX)
      scene.remove(gridY)
      gridOptionsButton.checked = false
      gridOptions.hidden = true
    }

    gridOptionsButton.checked = false

    gridOptionsButton.addEventListener('change', function () {
      if (gridOptions.hidden === true) {
        gridToggle()
        gridOptions.hidden = false
      } else {
        removeGrids()
      }
      resizeContainer()
    })

    gridXRadioButton.addEventListener('change', gridToggle)
    gridYRadioButton.addEventListener('change', gridToggle)

    const gridKeyIn = document.querySelector('#gridkeyin span')
    const gridKeyFt = document.querySelector('#gridkeyft span')

    gridKeyIn.innerText = (boxSize / 10 * 39.37).toFixed(2) // meters to inches
    gridKeyFt.innerText = (boxSize / 10 * 3.281).toFixed(2) // meters to feet
  })

  /* Model Loading Status */

  const loadingProgress = document.querySelector('#progressbar')
  const loadingError = document.querySelector('#loaderror')

  THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    loadingProgress.hidden = false
    const loadValue = Math.round(itemsLoaded / itemsTotal * 100)
    loadingProgress.value = loadValue
    loadingProgress.innerText = 'Model ' + loadValue + '% loaded'
  }

  THREE.DefaultLoadingManager.onLoad = function () {
    loadingProgress.hidden = true
  }

  THREE.DefaultLoadingManager.onError = function () {
    loadingError.hidden = false
  }

  /* Directions Menu */

  const elDirections = document.querySelector('#directions')
  const buttonDirections = document.querySelector('#toggledirections')
  buttonDirections.hidden = false

  buttonDirections.addEventListener('click', function () {
    if (elDirections.hidden === true) {
      elDirections.hidden = false
      buttonDirections.innerText = 'Hide how to move object'
      buttonDirections.setAttribute('aria-expanded', true)
    } else {
      elDirections.hidden = true
      buttonDirections.innerText = 'Show how to move object'
      buttonDirections.setAttribute('aria-expanded', false)
    }
    resizeContainer()
  })
}

if (container) {
  init()
}
