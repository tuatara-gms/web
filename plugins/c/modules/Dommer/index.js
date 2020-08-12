import COC from '../Core'
import Events from '../Events'
export default class $ extends Events {
  constructor(dom, options = { prefetch: false }) {
    if (!document) return
    if (!dom) return
    super({
      api: typeof dom === 'string' ? document.querySelector(dom) : dom,
      listener: 'addEventListener',
      emit: 'dispatchEvent'
    })
    this.domArgument = dom
    this.fetchDom(dom, true)
    this.options = options
  }

  // Initializing Domer

  fetchDom(dom, force = false) {
    if (this.domer && !force) {
      return
    }
    if (process.browser) {
      this.domer = typeof dom === 'string' ? document.querySelector(dom) : dom
    }
  }
  handlePrefetch() {
    this.fetchDom(this.domArgument, this.options.prefetch)
  }

  // DOM CLASSES

  AddClass(stl, searchFirst = false) {
    this.handlePrefetch()
    if (!this.domer) return this
    const css = stl.split(' ').filter(i => i.length)
    let i
    for (i = 0; i < css.length; i += 1) {
      if (css && typeof css[i] === 'string' && css[i].length) {
        if (
          !searchFirst ||
          (searchFirst && !this.domer.classList.contains(css[i]))
        ) {
          this.domer.classList.add(css[i])
        }
      }
    }
    return this
  }

  RemoveClass(stl) {
    this.handlePrefetch()
    if (!this.domer) return this
    const css = stl.split(' ')
    let i
    for (i = 0; i < css.length; i += 1) {
      if (css && typeof css[i] === 'string' && css[i].length) {
        this.domer.classList.remove(css[i])
      }
    }
    return this
  }

  HasClass(css) {
    this.handlePrefetch()
    if (!this.domer) return false
    return this.domer.classList.contains(css) !== -1
  }

  // DOM Styling

  Css(css) {
    this.handlePrefetch()
    Object.keys(css).forEach(i => {
      this.domer.style[i] = css[i]
    })
    return this
  }

  // DOM Actions

  Focus() {
    this.handlePrefetch()
    this.domer.focus()
    return this
  }

  UpdateValue(value = this.domer.value) {
    this.domer.value = value
  }

  Blur() {
    this.handlePrefetch()
    this.domer.blur()
    return this
  }

  // DOM Events

  OnFocus(callback) {
    this.handlePrefetch()
    this.On('focus', callback)
    return this
  }

  OnBlur(callback) {
    this.handlePrefetch()
    this.On('blur', callback)
    return this
  }

  OnKeyUp(callback) {
    this.handlePrefetch()
    this.On('keyup', callback)
  }

  OnKeyDown(callback) {
    this.handlePrefetch()
    this.On('keydown', callback)
  }

  OnClick(callback) {
    this.handlePrefetch()
    this.On('click', callback)
  }

  OnMouseDown(callback) {
    this.handlePrefetch()
    this.On('mousedown', callback)
  }

  OnMouseUp(callback) {
    this.handlePrefetch()
    this.On('mouseup', callback)
  }

  OnMouseOver(callback) {
    this.handlePrefetch()
    this.On('mouseover', callback)
  }

  OnMouseLeave(callback) {
    this.handlePrefetch()
    this.On('mouseleave', callback)
  }

  OnReady(callback) {
    this.handlePrefetch()
    this.On('ready', callback)
  }

  OnResize(callback) {
    this.handlePrefetch()
    this.On('resize', callback)
  }

  scrollTo() {
    this.handlePrefetch()
    if (!this.domer) {
      return
    }
    if (typeof window !== 'undefined' || typeof document !== undefined) {
      window.scrollTo(0, this.domer.offsetTop)
    }
  }
}
