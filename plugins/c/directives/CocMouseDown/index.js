import Dommer from '../../modules/Dommer'

export default (el, binding) => {
  const Controller = new Dommer(el)
  Controller.OnMouseDown(() => {
    Controller.AddClass(binding.value)
  })
  Controller.OnMultiple(['mouseleave', 'mouseover', 'mouseup'], () => {
    Controller.RemoveClass(binding.value)
  })
}
