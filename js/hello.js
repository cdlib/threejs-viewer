import * as THREE from 'three'

// Adapted from: https://discoverthreejs.com/book/first-steps/resize/

function init () {
  const container = document.querySelector('#demo1')

  const scene = new THREE.Scene()

  const fov = 35
  const aspect = container.clientWidth / container.clientHeight
  const near = 0.1
  const far = 100

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

  camera.position.z = 10

  const geometry = new THREE.BoxBufferGeometry(2, 2, 2)

  const material = new THREE.MeshNormalMaterial()

  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)

  const light = new THREE.DirectionalLight(0xffffff, 5.0)

  light.position.set(10, 10, 10)

  scene.add(light)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

  renderer.setSize(container.clientWidth, container.clientHeight)

  renderer.setPixelRatio(window.devicePixelRatio)

  container.appendChild(renderer.domElement)

  renderer.setAnimationLoop(() => {
    update()
    render()
  })

  function update () {
    mesh.rotation.z += 0.01
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01
  }

  function render () {
    renderer.render(scene, camera)
  }

  function onWindowResize () {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }

  window.addEventListener('resize', onWindowResize)
}

if (document.querySelector('#demo1')) {
  init()
}
