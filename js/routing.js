import models from './models.json'

/* Routing */

const urlParams = new URLSearchParams(window.location.search)
const modelNumber = urlParams.get('model') - 1

/* Metadata */

function modelMetadata () {
  modelName = models.model[modelNumber].name
  modelInstitution = models.model[modelNumber].institution
  modelPath = models.model[modelNumber].path
  modelUrl = models.model[modelNumber].url
  modelScale = models.model[modelNumber].scale
}

/* Dimensions */

function modelDimensions () {
  if (typeof models.model[modelNumber].dimensions[0] !== 'undefined') {
    modelWidth = models.model[modelNumber].dimensions[0].width
    modelHeight = models.model[modelNumber].dimensions[0].height
    modelDepth = models.model[modelNumber].dimensions[0].depth
  }
}

let modelName = ''
let modelInstitution = ''
let modelPath = ''
let modelUrl = ''
let modelWidth = ''
let modelHeight = ''
let modelDepth = ''
let modelScale = ''

export { urlParams, modelNumber, modelMetadata, modelName, modelInstitution, modelPath, modelUrl, modelDimensions, modelWidth, modelHeight, modelDepth, modelScale }
