import Dommer from '../../modules/Dommer'

export default (el, binding) => {
  const Controller = new Dommer(el)
  Controller.OnMouseLeave(() => {
    Controller.AddClass(binding.value)
  })
  Controller.OnMultiple(['mouseover', 'mousedown', 'mouseup'], () => {
    Controller.RemoveClass(binding.value)
  })
}
