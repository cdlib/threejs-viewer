import models from './models.json'

/* Demo Link Generation */

const linksTemplate = document.querySelector('#linkstemplate')

function init () {
  const linksTemplateContent = linksTemplate.content
  const demoLink = linksTemplateContent.querySelector('a:first-child')
  const debugLink = linksTemplateContent.querySelector('.debuglink')
  const modelsArray = models.model

  // Demo 2 links:

  const demo2Links = document.querySelector('#demo2links')

  modelsArray.forEach(function (theModel, index) {
    const modelHref = 'demo2.html?model=' + (index + 1)
    demoLink.setAttribute('href', modelHref)
    demoLink.innerText = theModel.name

    demo2Links.appendChild(document.importNode(linksTemplateContent, true))
  })

  // Demo 3 links:

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

if (linksTemplate) {
  init()
}
