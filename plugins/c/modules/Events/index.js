export default class Event {
  constructor(options) {
    this.defaults = {
      api: '$nuxt',
      listener: '$on',
      emit: '$emit'
    }
    const finalOptions = options || null
    this.api = finalOptions.api
      ? finalOptions && finalOptions.api
      : this.defaults.api
    this.listener =
      finalOptions && finalOptions.listener
        ? finalOptions.listener
        : this.defaults.listener
    this.emit =
      finalOptions && finalOptions.emit ? finalOptions.emit : this.defaults.emit
    this.val = this
  }
  // Listeners

  //Single Listener
  On(event, callback) {
    // this.api[this.listener](event, callback)
    // console.log('scope register accepted ', this.scope)
    this.api[this.listener](event, p => {
      // console.log('recieving..', event, p)
      callback(p)
    })
  }
  // Many Events, Same Callback
  OnMultiple(events, callback) {
    let i
    for (i = 0; i < events.length; i += 1) {
      this.On(events[i], callback)
    }
  }
  // Quick Setup, object of events names as attributes, callback as their values
  OnMap(map) {
    let i
    const keys = Object.keys(map)
    for (i = 0; i < keys.length; i += 1) {
      this.On(keys[i], map[keys[i]])
    }
  }
  Emit(event, payload) {
    this.api[this.emit](event, payload)
  }
}
