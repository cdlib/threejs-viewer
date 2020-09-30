import models from './models.json'

const modelsArray = models.model

if (document.querySelector('#linkstemplate')) {
  // Setup links template:

  const linksTemplate = document.querySelector('#linkstemplate')
  const linksTemplateContent = linksTemplate.content

  const modelLink = linksTemplateContent.querySelector('a:first-child')
  const debugLink = linksTemplateContent.querySelector('.debuglink')

  // Links for featured objects:

  if (document.querySelector('#featuredlinks')) {
    const institution = 'UC Merced'
    const featuredLinks = document.querySelector('#featuredlinks')
    const institutionHeading = document.querySelector('#institutionheading')

    modelsArray.forEach(function (theModel, index) {
      if (theModel.institution === institution) {
        const modelHref = 'currentviewer.html?model=' + (index + 1)
        modelLink.setAttribute('href', modelHref)
        modelLink.innerText = theModel.name
        institutionHeading.innerText = theModel.institution
      } else {
        return
      }

      debugLink.hidden = true

      featuredLinks.appendChild(document.importNode(linksTemplateContent, true))
    })
  }

  // Links for current prototype viewer:

  if (document.querySelector('#currentviewerlinks')) {
    const currentViewerLinks = document.querySelector('#currentviewerlinks')

    modelsArray.forEach(function (theModel, index) {
      const modelHref = 'currentviewer.html?model=' + (index + 1)
      modelLink.setAttribute('href', modelHref)
      modelLink.innerText = theModel.name

      const debugHref = modelHref + '&debug=true'
      debugLink.setAttribute('href', debugHref)
      debugLink.hidden = false

      currentViewerLinks.appendChild(document.importNode(linksTemplateContent, true))
    })
  }

  // Links for initial prototype viewer:

  if (document.querySelector('#initialviewerlinks')) {
    const initialViewerLinks = document.querySelector('#initialviewerlinks')

    modelsArray.forEach(function (theModel, index) {
      const modelHref = 'initialviewer.html?model=' + (index + 1)
      modelLink.setAttribute('href', modelHref)
      modelLink.innerText = theModel.name

      initialViewerLinks.appendChild(document.importNode(linksTemplateContent, true))
    })
  }
}
