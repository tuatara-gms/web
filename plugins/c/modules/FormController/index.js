import Event from '../Events'
import Arrays from '../Arrays'
import Logger from '../Logger'
import Core from '../Core'
export default class FormControl extends Event {
  constructor(event) {
    super(event)
    this.type = event.type
    this.model = event.model
    if (!event.scope || !Array.isArray(event.scope)) {
      this.SetScope([])
    } else {
      this.SetScope(event.scope)
    }
    this.scopeArray = new Arrays(this.scope, {
      logger: 'Coc Arrays: CEFC Scope'
    })
    this.component = event.component || null
    this.registered = {}
    this.isReciever = event.isReciever || false
    this.pennding = false
    this.Logger = new Logger(`COC ${this.type} | CEFC`)
    if (event.token) {
      Core.__reg__[event.token] = true
      this.token = event.token
    }
  }

  SetScope(scope) {
    if (!scope) {
      this.scope = []
      return
    }
    this.scope = scope
  }

  SetPennding(state = true) {
    this.pennding = state
  }
  Start() {
    if (!this.isReciever) {
      // console.log(this.scope.toString(), 'is recievalable')
      this.Register()
    }
    this.On('COCFormController', payloads => {
      if (this.component && this.component._id) {
        return
      }
      if (this.token) {
        if (!Core.__reg__[this.token]) return
      }
      // console.log('recieving...')
      // Validate if there's a scope
      if (!this.scope) {
        this.Warn(
          `There is no scope in this component. ${
            this.component && this.component.placeholder
              ? 'Hint, placeholder: ' + this.component.placeholder
              : ''
          }`
        )
        return
      }
      //Type Check
      if (
        payloads.type === undefined &&
        this.component &&
        this.component.type === 'button'
      ) {
        return
      }
      if (payloads.type !== undefined && payloads.type !== this.type) {
        return
      }
      //Check Matching
      if (this.scopeArray.IsMatching(payloads.scope)) {
        if (payloads.controller === 'meta') {
          this.HandleMeta(payloads.credentials)
        } else if (this.model.control[payloads.controller] !== undefined) {
          this.model.control[payloads.controller](
            payloads.credentials,
            payloads.callback !== undefined &&
            typeof payloads.callback === 'function'
              ? payloads.callback
              : null
          )
        } else {
          this.Warn(
            `The Controller (${
              payloads.controller
            }) that you are trying to access does not exist.
            placehoder: ${
              this.component && this.component.placehoder
                ? this.component.placehoder
                : 'Unknown'
            }`
          )
        }
      } else return
    })
  }

  Send(options, eventName = 'COCFormController') {
    const defaults = {
      scope: this.scope
    }
    // console.log('sending: ', eventName, { ...defaults, ...options }, this.scope)
    this.Emit(eventName, { ...defaults, ...options })
  }

  Register() {
    this.ReceiveScope('COCFormAskForRegister', () => {
      this.Send(
        {
          id: this.component.domId,
          valid: undefined
        },
        'COCFormItemRegister'
      )
    })
  }

  RegisterChild(child) {
    this.registered = child
  }

  SendMeta(options) {
    const defaults = {
      scope: this.scope,
      component: this.component
    }
    this.Emit('COCFormMeta', { ...defaults, ...options })
  }

  MatchedEvent(payloads) {
    return payloads.scope && this.scopeArray.IsMatching(payloads.scope)
  }
  ReceiveMeta(meta, callback) {
    this.On('COCFormMeta', payloads => {
      if (payloads.meta && payloads.meta == meta)
        if (this.MatchedEvent(payloads)) {
          callback(payloads)
        } else return
      else return
    })
  }

  ReceiveScope(event, callback) {
    this.On(event, payloads => {
      if (this.MatchedEvent(payloads)) {
        callback(payloads)
        // console.log('scope register accepted ', this.scope)
      } else {
        // console.log('scope register rejected ', this.scope)
      }
    })
  }

  HandleMeta(metaType = null, description = null) {
    if (!metaType || metaType === '*') {
      this.SendMeta({
        meta: '*',
        credentials: this.model.meta
      })
      return
    }
    if (!this.model) {
      return
    }
    if (this.model.meta[metaType] === undefined) {
      this.Warn(
        'The meta that you are requesting is not available in this CSMA.'
      )
      return
    }
    const headers = {
      pennding: this.pennding,
      meta: metaType,
      credentials: this.model.meta[metaType]
    }
    if (description) {
      headers.description = description
    }
    this.SendMeta(headers)
    return this.model.control
  }

  Submit() {
    this.Send({
      controller: 'click',
      credentials: null,
      type: 'button'
    })
  }
  Warn(message) {
    this.Logger.Warn(message)
  }

  RemoveToken() {
    if (this.token) {
      Core.__reg__[this.token] = false
      delete Core.__reg__[this.token]
    }
  }
}
