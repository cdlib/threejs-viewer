import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { modelMetadata, modelPath } from './routing.js'

function init () {
  modelMetadata()

  /* Camera, Scene, and Renderer */

  const container = document.querySelector('#demo2')

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

  function animate () {
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', function () {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
    animate()
  })

  /* Orbit Controls */

  var controls = new OrbitControls(camera, renderer.domElement)

  controls.rotateSpeed = 0.6

  controls.zoomSpeed = 0.2

  controls.enableDamping = true

  controls.dampingFactor = 0.1

  controls.addEventListener('change', function () {
    animate()
  })

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

    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z)
  }

  const gltfLoader = new GLTFLoader()

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('draco/')
  dracoLoader.preload()
  gltfLoader.setDRACOLoader(dracoLoader)

  gltfLoader.load(modelPath, (gltf) => {
    const root = gltf.scene

    scene.add(root)

    const box = new THREE.Box3().setFromObject(root)

    const boxSize = box.getSize(new THREE.Vector3()).length()

    const boxCenter = box.getCenter(new THREE.Vector3())

    frameArea(boxSize * 1, boxSize, boxCenter, camera)

    controls.maxDistance = boxSize * 2

    controls.target.copy(boxCenter)

    controls.update()

    controls.saveState()
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

  /* Reset Camera Control */

  const buttonResetCamera = document.querySelector('#resetcamera')

  buttonResetCamera.addEventListener('click', function () {
    controls.reset()
  })
}

if (document.querySelector('#demo2')) {
  init()
}
