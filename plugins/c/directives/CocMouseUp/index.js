import Dommer from '../../modules/Dommer'

export default (el, binding) => {
  const Controller = new Dommer(el)
  Controller.OnMouseUp(() => {
    Controller.AddClass(binding.value)
  })
  Controller.OnMultiple(['mouseleave', 'mousedown', 'mouseover'], () => {
    Controller.RemoveClass(binding.value)
  })
}
