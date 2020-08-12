import Dommer from '../../modules/Dommer'

export default (el, binding) => {
  const Controller = new Dommer(el)
  Controller.OnMouseOver(() => {
    Controller.AddClass(binding.value)
  })
  Controller.OnMultiple(['mouseleave', 'mousedown', 'mouseup'], () => {
    Controller.RemoveClass(binding.value)
  })
}
