import Core from '../../modules/Core/index.js'
const removeLoader = parent => {
  const selections = parent.getElementsByClassName('coc-loader')
  if (selections && selections.length) {
    let i
    for (i = 0; i < selections.length; i += 1) {
      selections[i].remove()
    }
  }
}
const addLoader = (parent, args) => {
  if (process.browser) {
    // Remove Older Loaders
    removeLoader(parent)
    // Initializing Container
    const loaderContainer = document.createElement('DIV')
    loaderContainer.style.height = `${parent.offsetHeight}px`
    loaderContainer.style.width = `${parent.offsetWidth}px`
    loaderContainer.classList.add('coc-loader')
    loaderContainer.classList.add('animated')
    loaderContainer.classList.add('fadeIn')
    loaderContainer.style.position = 'absolute'
    loaderContainer.style.top = `${parent.offsetTop}px`
    loaderContainer.style.left = `${parent.offsetLeft}px`
    // Bounding Contaier to be calculatable later..
    parent.appendChild(loaderContainer)

    // Initializing Loader Child and Content
    const loaderContent = document.createElement('P')
    loaderContent.classList.add('center')
    const loaderIcon = document.createElement('SPAN')
    loaderContent.style.position = 'absolute'

    // Managing Loader Content

    // Icon
    loaderContainer.style.backgroundColor = args.color
    let i
    for (i = 0; i < args.classes.length; i += 1) {
      loaderIcon.classList.add(args.classes[i])
    }
    const contentChilds = [loaderIcon]
    // Text content
    if (args.content.hasText) {
      const loaderText = document.createElement('SPAN')
      loaderText.innerText = args.content.text
      const textClassesList = args.content.classes.split(' ')
      for (i = 0; i < textClassesList.length; i += 1) {
        loaderText.classList.add(textClassesList[i])
      }
      contentChilds.push(loaderText)
    }
    // Bounding Child to be calculatable later.. ( for Centerization process )
    let c
    for (c = 0; c < contentChilds.length; c += 1) {
      loaderContent.appendChild(contentChilds[c])
    }
    loaderContainer.appendChild(loaderContent)
    // Centerizing Child
    loaderContent.style.top = `${(parent.offsetHeight -
      loaderContent.offsetHeight) /
      2}px`
    loaderContent.style.left = `${(parent.offsetWidth -
      loaderContent.offsetWidth) /
      2}px`
  }
}
const initLoader = (el, binding) => {
  removeLoader(el)
  if (binding.value) {
    addLoader(el, {
      classes:
        binding.modifiers &&
        typeof binding.modifiers === 'object' &&
        Object.keys(binding.modifiers).length
          ? Object.keys(binding.modifiers)
          : Core.App.Defaults.Get('Loader.spinner'),
      color: el.getAttribute('coc-loader-bg')
        ? el.getAttribute('coc-loader-bg')
        : Core.App.Defaults.Get('Loader.backgroundColor'),
      content: {
        hasText:
          !el.getAttribute('coc-loader-hastext') ||
          el.getAttribute('coc-loader-hastext') !== 'false',
        text: el.getAttribute('coc-loader-text')
          ? el.getAttribute('coc-loader-text')
          : Core.App.Defaults.Get('Loader.placeholder'),
        classes: el.getAttribute('coc-loader-classes')
          ? el.getAttribute('coc-loader-classes')
          : Core.App.Defaults.Get('Loader.placeholderClass')
      }
    })
  } else {
    removeLoader(el)
  }
}
export default (el, binding) => {
  // Calling the main init;
  initLoader(el, binding)

  // Listen on screen resize
  if (process.browser) {
    document.body.onresize = () => {
      initLoader(el, binding)
    }
    el.addEventListener('resize', () => {
      initLoader(el, binding)
    })
  }
}
