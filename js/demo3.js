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
    // Avocado GLTF downloaded from: https://poly.google.com/view/196c4VRe6Ch
    model = 'models/avocado/Avocado.gltf'
  } else if (urlParams.get('model') === '2') {
    // George Washington statue downloaded from: https://3d.si.edu/object/3d/george-washington:789cf90a-4387-4ac1-9e96-c7d6a7b9d26f
    model = 'models/smithsonian/george-washington-greenough-statue-(1840)-150k-4096-web.gltf'
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

  camera.position.set(1, 0, 1)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  container.appendChild(renderer.domElement)

  /* Camera Controls */

  const cameraControls = new CameraControls(camera, renderer.domElement)

  const clock = new THREE.Clock()

  // const mesh = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
  // )
  // scene.add(mesh)

  // const gridHelper = new THREE.GridHelper(50, 50)
  // gridHelper.position.y = -1
  // scene.add(gridHelper)

  function animate () {
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', function () {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
    animate()
  })

  // cameraControls.addEventListener('control', function () {
  //   animate()
  // })

  renderer.render(scene, camera);

  (function anim () {
    const delta = clock.getDelta()
    const hasControlsUpdated = cameraControls.update(delta)

    requestAnimationFrame(anim)

    if (hasControlsUpdated) {
      renderer.render(scene, camera)
      console.log('rendered')
    }
  })()

  /* Lights */

  var light = new THREE.AmbientLight(0x404040)

  scene.add(light)

  renderer.physicallyCorrectLights = true

  /* Light Intensity Control */

  const intensitySlider = document.querySelector('#intensity')

  function updateIntensity () {
    light.intensity = intensitySlider.value
    animate()
  }

  intensitySlider.addEventListener('input', updateIntensity)

  updateIntensity()

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

    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
  }

  const gltfLoader = new GLTFLoader()

  gltfLoader.load(model, (gltf) => {
    const root = gltf.scene

    scene.add(root)

    const box = new THREE.Box3().setFromObject(root)

    const boxSize = box.getSize(new THREE.Vector3()).length()

    const boxCenter = box.getCenter(new THREE.Vector3())

    frameArea(boxSize * 1, boxSize, boxCenter, camera)

    // controls.maxDistance = boxSize * 2

    // controls.target.copy(boxCenter)

    // controls.update()

    // controls.saveState()

    cameraControls.setTarget(boxCenter.x, boxCenter.y, boxCenter.z)

    cameraControls.fitTo(box, true)

    cameraControls.saveState()

    console.log(boxSize)

    /* Button Controls */

    const buttonZoomIn = document.querySelector('#zoomin')

    buttonZoomIn.addEventListener('click', function () {
      cameraControls.zoom(camera.zoom / 4, true)
    })

    const buttonZoomOut = document.querySelector('#zoomout')

    buttonZoomOut.addEventListener('click', function () {
      cameraControls.zoom(-camera.zoom / 4, true)
    })

    const buttonRotateRight = document.querySelector('#rotateright')

    buttonRotateRight.addEventListener('click', function () {
      cameraControls.rotate(0.25, 0, true)
    })

    const buttonRotateLeft = document.querySelector('#rotateleft')

    buttonRotateLeft.addEventListener('click', function () {
      cameraControls.rotate(-0.25, 0, true)
    })

    const buttonRotateUp = document.querySelector('#rotateup')

    buttonRotateUp.addEventListener('click', function () {
      cameraControls.rotate(0, -0.25, true)
    })

    const buttonRotateDown = document.querySelector('#rotatedown')

    buttonRotateDown.addEventListener('click', function () {
      cameraControls.rotate(0, 0.25, true)
    })

    const buttonPanUp = document.querySelector('#panup')

    buttonPanUp.addEventListener('click', function () {
      cameraControls.truck(0, -boxSize * 0.05, true)
    })

    const buttonPanDown = document.querySelector('#pandown')

    buttonPanDown.addEventListener('click', function () {
      cameraControls.truck(0, boxSize * 0.05, true)
    })

    const buttonPanLeft = document.querySelector('#panleft')

    buttonPanLeft.addEventListener('click', function () {
      cameraControls.truck(boxSize * 0.05, 0, true)
    })

    const buttonPanRight = document.querySelector('#panright')

    buttonPanRight.addEventListener('click', function () {
      cameraControls.truck(-boxSize * 0.05, 0, true)
    })

    const buttonReset = document.querySelector('#resetcamera')

    buttonReset.addEventListener('click', function () {
      cameraControls.reset(true)
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

    const wKey = new holdEvent.KeyboardKeyHold(KEYCODE.W, 100)
    const aKey = new holdEvent.KeyboardKeyHold(KEYCODE.A, 100)
    const sKey = new holdEvent.KeyboardKeyHold(KEYCODE.S, 100)
    const dKey = new holdEvent.KeyboardKeyHold(KEYCODE.D, 100)
    aKey.addEventListener('holding', function (event) { cameraControls.truck(-boxSize / 2000 * event.deltaTime, 0, true) })
    dKey.addEventListener('holding', function (event) { cameraControls.truck(boxSize / 2000 * event.deltaTime, 0, true) })
    wKey.addEventListener('holding', function (event) { cameraControls.forward(boxSize / 2000 * event.deltaTime, true) })
    sKey.addEventListener('holding', function (event) { cameraControls.forward(-boxSize / 2000 * event.deltaTime, true) })

    const leftKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_LEFT, 100)
    const rightKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_RIGHT, 100)
    const upKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_UP, 100)
    const downKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_DOWN, 100)
    leftKey.addEventListener('holding', function (event) { cameraControls.rotate(-0.1 * THREE.Math.DEG2RAD * event.deltaTime, 0, true) })
    rightKey.addEventListener('holding', function (event) { cameraControls.rotate(0.1 * THREE.Math.DEG2RAD * event.deltaTime, 0, true) })
    upKey.addEventListener('holding', function (event) { cameraControls.rotate(0, -0.05 * THREE.Math.DEG2RAD * event.deltaTime, true) })
    downKey.addEventListener('holding', function (event) { cameraControls.rotate(0, 0.05 * THREE.Math.DEG2RAD * event.deltaTime, true) })
  })
}

if (container) {
  init()
}
