import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import CameraControls from 'camera-controls'
import * as holdEvent from 'hold-event'
import * as routing from './routing.js'

CameraControls.install({ THREE: THREE })

const container = document.querySelector('#demo3')

function init () {
  routing.router()
  const urlParams = routing.urlParams
  const modelUrl = routing.modelUrl

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

  gltfLoader.load(modelUrl, (gltf) => {
    const root = gltf.scene

    scene.add(root)

    const box = new THREE.Box3().setFromObject(root)
    const boxSize = box.getSize(new THREE.Vector3()).length()
    const boxCenter = box.getCenter(new THREE.Vector3())

    frameArea(boxSize * 1, boxSize, boxCenter, camera)

    /* Camera Controls */

    cameraControls.fitTo(box)
    cameraControls.rotateTo(30 * THREE.Math.DEG2RAD, 80 * THREE.Math.DEG2RAD)

    const buttonReset = document.querySelector('#resetcamera')

    buttonReset.addEventListener('click', function () {
      cameraControls.rotateTo(0 * THREE.Math.DEG2RAD, 90 * THREE.Math.DEG2RAD, true)
      cameraControls.fitTo(box, true)
      cameraControls.rotateTo(30 * THREE.Math.DEG2RAD, 80 * THREE.Math.DEG2RAD, true)
      removeGrids()
      resizeContainer()
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

    /* Model Scale and Measurement */

    const boxXLength = box.getSize(new THREE.Vector3()).x
    const boxYLength = box.getSize(new THREE.Vector3()).y
    const boxZLength = box.getSize(new THREE.Vector3()).z

    const modelSize = document.querySelector('#modelsize')
    const modelSelect = document.querySelector('#modelselect')
    const modelWidth = document.querySelector('#modelwidth output')
    const modelHeight = document.querySelector('#modelheight output')
    const modelDepth = document.querySelector('#modeldepth output')
    const gridKey = document.querySelector('#gridkey output')

    const gridDivisions = 10

    let initialXLength = ''
    let initialYLength = ''
    let initialZLength = ''
    let initialGridCellSize = boxSize / gridDivisions

    // initially scale model default unit to meters (three.js standard unit):

    if (urlParams.get('scale') === 'mm') {
      modelSelect.options[0].selected = true
      initialXLength = boxXLength / 1000
      initialYLength = boxYLength / 1000
      initialZLength = boxZLength / 1000
      initialGridCellSize = initialGridCellSize / 1000
    } else if (urlParams.get('scale') === 'cm') {
      modelSelect.options[1].selected = true
      initialXLength = boxXLength / 100
      initialYLength = boxYLength / 100
      initialZLength = boxZLength / 100
      initialGridCellSize = initialGridCellSize / 100
    } else if (urlParams.get('scale') === 'm') {
      modelSelect.options[5].selected = true
      initialXLength = boxXLength
      initialYLength = boxYLength
      initialZLength = boxZLength
    } else {
      // unknown or missing unit
      modelSize.setAttribute('hidden', true)
    }

    let finalXLength = ''
    let finalYLength = ''
    let finalZLength = ''
    let finalGridCellSize = ''
    let gridKeyLabel = ''

    // rescale meters to final unit:

    function scaleTo () {
      if (modelSelect.value === 'mm') {
        finalXLength = initialXLength * 1000
        finalYLength = initialYLength * 1000
        finalZLength = initialZLength * 1000
        gridKeyLabel = 'millimeters'
        finalGridCellSize = initialGridCellSize * 1000
      } else if (modelSelect.value === 'cm') {
        finalXLength = initialXLength * 100
        finalYLength = initialYLength * 100
        finalZLength = initialZLength * 100
        gridKeyLabel = 'centimeters'
        finalGridCellSize = initialGridCellSize * 100
      } else if (modelSelect.value === 'in') {
        finalXLength = initialXLength * 39.37
        finalYLength = initialYLength * 39.37
        finalZLength = initialZLength * 39.37
        gridKeyLabel = 'inches'
        finalGridCellSize = initialGridCellSize * 39.37
      } else if (modelSelect.value === 'ft') {
        finalXLength = initialXLength * 3.281
        finalYLength = initialYLength * 3.281
        finalZLength = initialZLength * 3.281
        gridKeyLabel = 'feet'
        finalGridCellSize = initialGridCellSize * 3.281
      } else if (modelSelect.value === 'yd') {
        finalXLength = initialXLength * 1.094
        finalYLength = initialYLength * 1.094
        finalZLength = initialZLength * 1.094
        gridKeyLabel = 'yards'
        finalGridCellSize = initialGridCellSize * 1.094
      } else if (modelSelect.value === 'm') {
        finalXLength = initialXLength
        finalYLength = initialYLength
        finalZLength = initialZLength
        gridKeyLabel = 'meters'
        finalGridCellSize = initialGridCellSize
      }

      modelWidth.innerText = finalXLength.toFixed(1)
      modelHeight.innerText = finalYLength.toFixed(1)
      modelDepth.innerText = finalZLength.toFixed(1)
      gridKey.innerText = finalGridCellSize.toFixed(1) + ' ' + gridKeyLabel
    }

    scaleTo()

    modelSelect.addEventListener('change', scaleTo)

    /* Measurement Grid */

    const boxYHalfLength = boxYLength / 2
    const boxZHalfLength = boxZLength / 2
    const gridOptionsButton = document.querySelector('#gridoptionsbutton')
    const gridOptions = document.querySelector('#gridoptions')
    const gridXRadioButton = document.querySelector('#gridxbutton')
    const gridYRadioButton = document.querySelector('#gridybutton')

    const gridX = new THREE.GridHelper(boxSize, gridDivisions, 0x000000, 0x000000)
    gridX.position.y = -boxYHalfLength

    const gridY = new THREE.GridHelper(boxSize, gridDivisions, 0x000000, 0x000000)
    gridY.position.z = -boxZHalfLength
    gridY.rotateX(90 * THREE.Math.DEG2RAD)

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
        cameraControls.rotateTo(0 * THREE.Math.DEG2RAD, 90 * THREE.Math.DEG2RAD, true)
      } else {
        removeGrids()
      }
      resizeContainer()
    })

    gridXRadioButton.addEventListener('change', gridToggle)
    gridYRadioButton.addEventListener('change', gridToggle)
  })

  /* Fullscreen Control */

  const elFullscreen = document.querySelector('.container canvas')

  const buttonFullscreen = document.querySelector('#fullscreen')

  buttonFullscreen.addEventListener('click', function () {
    // Standard
    if (elFullscreen.requestFullscreen) {
      elFullscreen.requestFullscreen()

    // Firefox
    } else if (elFullscreen.mozRequestFullScreen) {
      elFullscreen.mozRequestFullScreen()

    // Chrome, Safari, and Opera
    } else if (elFullscreen.webkitRequestFullscreen) {
      elFullscreen.webkitRequestFullscreen()

    // IE/Edge
    } else if (elFullscreen.msRequestFullscreen) {
      elFullscreen.msRequestFullscreen()
    }
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
