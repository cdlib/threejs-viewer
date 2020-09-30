import models from './models.json'

const linksTemplate = document.querySelector('#linkstemplate')

function init () {
  const linksTemplateContent = linksTemplate.content
  const demoLink = linksTemplateContent.querySelector('a:first-child')
  const debugLink = linksTemplateContent.querySelector('.debuglink')
  const modelsArray = models.model

  // Initial Prototype Viewer:

  if (document.querySelector('#demo2links')) {
    const demo2Links = document.querySelector('#demo2links')

    modelsArray.forEach(function (theModel, index) {
      const modelHref = 'demo2.html?model=' + (index + 1)
      demoLink.setAttribute('href', modelHref)
      demoLink.innerText = theModel.name

      demo2Links.appendChild(document.importNode(linksTemplateContent, true))
    })
  }

  // Current Prototype Viewer:

  if (document.querySelector('#demo2links')) {
    const demo3Links = document.querySelector('#demo3links')

    modelsArray.forEach(function (theModel, index) {
      const modelHref = 'demo3.html?model=' + (index + 1)
      demoLink.setAttribute('href', modelHref)
      demoLink.innerText = theModel.name

      const debugHref = modelHref + '&debug=true'
      debugLink.setAttribute('href', debugHref)
      debugLink.hidden = false

      demo3Links.appendChild(document.importNode(linksTemplateContent, true))
    })
  }

  // Featured Objects from Institution:

  if (document.querySelector('#featuredlinks')) {
    const institution = 'UC Merced' // must match institution value exactly within models.json
    const featuredLinks = document.querySelector('#featuredlinks')
    const institutionHeading = document.querySelector('#institutionheading')

    modelsArray.forEach(function (theModel, index) {
      if (theModel.institution === institution) {
        const modelHref = 'demo3.html?model=' + (index + 1)
        demoLink.setAttribute('href', modelHref)
        demoLink.innerText = theModel.name
        institutionHeading.innerText = theModel.institution
      } else {
        return
      }

      debugLink.hidden = true

      featuredLinks.appendChild(document.importNode(linksTemplateContent, true))
    })
  }
}

if (linksTemplate) {
  init()
}
