import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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

  gltfLoader.load(model, (gltf) => {
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
