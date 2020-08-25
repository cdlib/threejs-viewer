/* Model Routing */

function router () {
  if (urlParams.get('model') === '1') {
    // George Washington downloaded from: https://3d.si.edu/object/3d/george-washington:789cf90a-4387-4ac1-9e96-c7d6a7b9d26f
    modelUrl = 'models/george-washington/george-washington-greenough-statue-(1840)-150k-4096-web.gltf'
  } else if (urlParams.get('model') === '2') {
    // Blue Crab downloaded from: https://3d.si.edu/object/3d/blue-crab:b0bf6d44-af22-40dc-bd85-7d66255be4a7
    modelUrl = 'models/blue-crab/blue-crab-150k-4096-web.gltf'
  } else if (urlParams.get('model') === '3') {
    // Side Chair downloaded from: https://3d.si.edu/object/3d/side-chair:57d30b85-3549-40dc-99c3-255249867462
    modelUrl = 'models/side-chair/pergolesi_side_chair_mesh-100k-web.gltf'
  } else if (urlParams.get('model') === '4') {
    // Apolo Interior downloaded from: https://3d.si.edu/object/3d/command-module-apollo-11:d8c63e8a-4ebc-11ea-b77f-2e728ce88125
    modelUrl = 'models/apollo-interior/apollo_interior-medium_resolution.gltf'
  } else if (urlParams.get('model') === '5') {
    // Space Shuttle downloaded from: https://3d.si.edu/object/3d/orbiter-space-shuttle-ov-103-discovery:d8c636ce-4ebc-11ea-b77f-2e728ce88125
    modelUrl = 'models/space-shuttle/Orbiter_Space_Shuttle_OV-103_Discovery-150k-4096.gltf'
  } else if (urlParams.get('model') === '6') {
    // Avocado GLTF downloaded from: https://poly.google.com/view/196c4VRe6Ch
    modelUrl = 'models/avocado/Avocado.gltf'
  } else {
    document.querySelector('.container').innerText = 'Invalid model parameter or number in URL query string.'
  }
}

const urlParams = new URLSearchParams(window.location.search)
let modelUrl = ''

export { router, urlParams, modelUrl }
