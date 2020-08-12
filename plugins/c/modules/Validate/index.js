import Logger from '../Logger'
import Objects from '../Objects'
import Core from '../Core'
import moment from 'moment'
import axios from 'axios'
// COC VALIDATORS
export default class Validator {
  constructor(
    val = 0,
    options = null,
    errorMessages = null,
    parent = null,
    label = 'root'
  ) {
    // Init Values
    this.LastError = null
    this.Val = val
    this.Options = {}
    this.Attemps = 0
    this.Rules = [
      // Existance
      'HasValue',
      'HasInput',
      // Direct Comparisons
      'SameAs',
      // Data Types
      'IsString',
      'IsEmail',
      'IsNumeric',
      'IsNumericString',
      'IsDateString',
      'IsArray',
      'IsObject',
      // Numbers Validations
      'IsEvenNumber',
      'IsOddNumber',
      'NumberGreaterThan',
      'NumberGreaterThanOrEqual',
      'NumberLessThan',
      'NumberLessThanOrEqual',
      'NumberBetween',
      // Date Validations
      'MaxDate',
      'MinDate',
      'DateBetween',
      // Logical Validations
      'MatchesRegex',
      'MinLength',
      'MaxLength',
      'LengthBetween',
      'MinArrayLength',
      'MaxArrayLength',
      // Complex Forms
      'Each',
      'Keys',
      // Custom Validations
      'Remote',
      'PreConditions',
      'ResolvedPromise'
    ]
    this.DefaultErrorIcon = 'ivu-icon ivu-icon-ios-alert-outline'
    this.Logger = new Logger('COC Validator')
    this.IsValid = false

    // Start Constructions
    this.DefaultMessages = Core.App.Defaults.Validator.ErrorMessages
    this.ErrorMessages = errorMessages
      ? Objects(this.DefaultMessages).Mix(errorMessages).get
      : this.DefaultMessages

    if (options) {
      this.SetOptions(options)
    }

    this.parent = parent
    this.label = label
    this.Path = this.parent || ['root']

    if (this.label) {
      this.Path.push(label)
    }
  }

  // Setters and Getters

  get ValueRequired() {
    return (
      this.Rules.HasValue &&
      (this.Rules.HasValue.active === undefined ||
        this.Rules.HasValue.active === false)
    )
  }
  get GetVal() {
    return this.Val
  }
  get GetOptions() {
    return this.Options
  }
  get GetResult() {
    return this.IsValid
  }

  SetVal(val = 0) {
    this.Val = val
    return this
  }

  SetDefaultErrorIcon(val = 'ivu-icon') {
    this.DefaultErrorIcon = val
  }

  SetDefaultErrorMessages(messages) {
    this.ErrorMessages = messages
  }

  SetErrorMessage(rule = 'HasValue', messageOrOption = 'message', icon = null) {
    if (typeof rule !== 'string') {
      this.Logger.Warn(`Invalid date type, rule name must be a string`)
      return
    }
    if (this.Rules.indexOf(rule) === -1) {
      this.Logger.Warn(`This Rule *${rule}* does not exist`)
      return
    }
    if (typeof messageOrOption === 'string') {
      this.ErrorMessages[rule].message = messageOrOption
      this.ErrorMessages[rule].icon = icon
    } else if (typeof messageOrOption === 'object') {
      if (!messageOrOption.message && !messageOrOption.icon) {
        this.Logger.Warn(
          `This Rule *${rule}* error message has no arguments, Coc validator will fallback to the default.`
        )
        return
      }
      if (messageOrOption.message) {
        this.ErrorMessages[rule].message = messageOrOption.message
      }
      if (messageOrOption.icon) {
        this.ErrorMessages[rule].icon = messageOrOption.icon
      }
    } else {
      this.Logger.Warn(`Invalid message structure for rule *${rule}*`)
      return
    }
  }

  SetOptions(options = {}) {
    const inst = this
    Object.keys(options).forEach(k => {
      inst.AddOptionObject(k, options[k])
    })
  }
  AddOptionObject(
    rule = 'HasValue',
    options = { args: null, active: false, variable: false, message: null }
  ) {
    this.AddOption(
      rule,
      this.resolveArgs(options),
      options.active,
      options.variable,
      options.message
    )
  }
  AddOption(
    rule = 'HasValue',
    args = null,
    active = true,
    variable = false,
    message = null
  ) {
    if (this.Rules.indexOf(rule) === -1) {
      this.Logger.Warn({ message: `Invalid Validator (${rule})` })
      return
    }
    if (
      !this.Options ||
      !this.Options instanceof Object ||
      Array.isArray(this.Options)
    ) {
      this.Options = {}
    }
    if (typeof active !== 'boolean') {
      this.Logger.Warn(`Invalid Validator, active property must be a boolean`)
      return
    }
    if (typeof variable !== 'boolean') {
      this.Logger.Warn(`Invalid Validator, variable property must be a boolean`)
      return
    }
    this.Options[rule] = {
      active,
      args,
      variable
    }
    if (message) {
      this.SetErrorMessage(rule, message)
    }
  }
  SwitchOption(rule = 'HasValue', status = true) {
    if (this.Rules.indexOf(rule) === -1) {
      this.Logger.Warn(`Invalid Rule (${rule})`)
      return
    }
    if (this.Options[rule] === undefined) {
      this.Logger.Warn(`You do not have this rule (${rule}) in your options.`)
      return
    }
    this.Options[rule].active = status
  }
  // Error Delivery

  DeliverError(reject, error, round = false, attemp) {
    this.Attemps += 1
    this.LastError = {
      error,
      valid: false,
      message: this.GenerateErrorMessage(error, round).message,
      icon: this.GenerateErrorMessage(error).icon,
      code: this.Rules.indexOf(error),
      attemp,
      attemps: this.Attemps - 1,
      path: this.Path,
      val: this.Val,
      instance: 'coc-validator'
    }
    return reject(this.LastError)
  }

  GenerateErrorMessage(key, round) {
    if (
      typeof round === Object &&
      round.valid === false &&
      round.message &&
      round.instance === 'coc-validator'
    )
      return round
    if (this.Rules.indexOf(key) === -1) {
      this.Logger.Warn(`Invalid Rule (${key})`)
      return
    }
    if (this.ErrorMessages[key].message.includes('|*args')) {
      return {
        message: this.ResolveErrorMessageArgs(key, round),
        icon: this.GetErrorIcon(key)
      }
    }
    return {
      message: this.ErrorMessages[key].message,
      icon: this.GetErrorIcon(key)
    }
  }

  ResolveErrorMessageArgs(key, round) {
    const splittedMessage = this.ErrorMessages[key].message
      .split(/\|\*args(\.|[a-z])*\*\|/)
      .filter(s => s !== undefined)
    if (
      typeof this.Options[key].args !== 'object' ||
      Array.isArray(this.Options[key].args)
    ) {
      if (round !== false) {
        return splittedMessage.join(round)
      }
      return splittedMessage.join(this.Options[key].args)
    }
    let i
    let tempMessage = this.ErrorMessages[key].message
    const argStrings = this.ErrorMessages[key].message.match(
      /\|\*args(\.|[a-z])*\*\|/g
    )
    for (i = 0; i < argStrings.length; i += 1) {
      tempMessage = tempMessage
        .split(argStrings[i])
        .join(
          this.ResolveArgumentError(this.Options[key].args, argStrings[i], 0)
        )
    }
    return tempMessage
  }

  ResolveArgumentError(optionsArgs, stringArgs, count) {
    const trimmed = stringArgs.slice(7, stringArgs.length - 2)
    const splitted = trimmed.split('.')
    if (splitted.length - 1 === count) {
      return optionsArgs[splitted[count]]
    } else
      return this.ResolveArgumentError(
        optionsArgs[splitted[count]],
        stringArgs,
        count + 1
      )
  }
  GetErrorIcon(key) {
    return this.ErrorMessages[key].icon
      ? this.ErrorMessages[key].icon
      : this.DefaultErrorIcon
  }

  // Validation methods

  // Has Value

  HasValue() {
    if (!this.Val && typeof val !== 'number') {
      return false
    }
    if (
      typeof this.Val === 'object' &&
      Array.isArray(this.Val) &&
      !this.Val.length
    ) {
      return false
    }
    if (typeof this.Val === 'string' && !this.Val.length) {
      return false
    }
    if (
      typeof this.Val === 'string' &&
      !this.Val.split(' ').filter(m => m.length).length
    ) {
      return false
    }
    return true
  }

  HasInput() {
    if (typeof this.Val === 'number') return true
    if (!this.Val && typeof val !== 'number') {
      return false
    }
    if (
      typeof this.Val === 'object' &&
      Array.isArray(this.Val) &&
      !this.Val.length
    ) {
      return false
    }
    if (typeof this.Val === 'string' && !this.Val.length) {
      return false
    }
    if (
      typeof this.Val === 'string' &&
      !this.Val.split(' ').filter(m => m.length).length
    ) {
      return false
    }
    return true
  }

  ObjectTree(
    object = { foo: { bar: 'lorem' } },
    tree = ['foo', 'lorem'],
    warn = false
  ) {
    if (typeof tree === 'string') {
      if (!object[tree]) {
        this.Logger.Warn(`${tree} property is required`)
        return false
      } else return true
    }
    let i
    for (i = 0; i < tree.length; i += 1) {
      if (!object[tree[i]]) {
        this.Logger.Warn(`${tree[i]} property is required`)
        return false
      }
    }
    return true
  }

  // Data Types
  IsString() {
    if (!this.ValueRequired && !this.HasValue()) return true
    return typeof this.Val === 'string'
  }

  IsNumeric() {
    if (!this.ValueRequired && !this.HasValue()) return true
    return typeof this.Val === 'number'
  }

  IsArray() {
    if (!this.ValueRequired && !this.HasValue()) return true
    return typeof this.Val === 'object' && Array.isArray(this.Val)
  }

  IsEmail() {
    if (!this.ValueRequired && !this.HasValue()) return true
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(this.Val).toLowerCase())
  }
  IsObject() {
    if (!this.ValueRequired && !this.HasValue()) return true
    return !this.IsArray(this.Val) && typeof this.Val === 'object'
  }

  IsNumericString() {
    if (!this.ValueRequired && !this.HasValue()) return true
    return parseFloat(this.Val, 10) == this.Val
  }

  IsDateString() {
    if (!this.ValueRequired && !this.HasValue()) return true
    return moment(this.Val).format() !== 'Invalid date'
  }

  // Numeric Validations

  IsEvenNumber() {
    if (!this.ValueRequired && !this.HasValue()) return true
    return this.Val % 2 === 0
  }

  IsOddNumber() {
    if (!this.ValueRequired && !this.HasValue()) return true
    return parseFloat(this.Val, 10) % 2 !== 0
  }

  NumberGreaterThan(max = 10) {
    if (!this.ValueRequired && !this.HasValue()) return true
    return parseFloat(this.Val, 10) > parseFloat(max, 10)
  }

  NumberGreaterThanOrEqual(max = 10) {
    if (!this.ValueRequired && !this.HasValue()) return true
    return parseFloat(this.Val, 10) >= parseFloat(max, 10)
  }

  NumberLessThan(min = 0, val) {
    if (!this.ValueRequired && !this.HasValue()) return true
    return parseFloat(this.Val, 10) < parseFloat(min, 10)
  }

  NumberLessThanOrEqual(min = 0, val) {
    if (!this.ValueRequired && !this.HasValue()) return true
    return parseFloat(this.Val, 10) <= parseFloat(min, 10)
  }

  NumberBetween(limits = { min: 2, max: 10 }) {
    if (!this.ValueRequired && !this.HasValue()) return true
    return (
      parseFloat(this.Val, 10) >= parseFloat(limits.min, 10) &&
      parseFloat(this.Val, 10) <= parseFloat(limits.max, 10)
    )
  }

  // Date Validations
  MaxDate(args) {
    const finalArgs = { mapper: val => val, max: null }
    if (typeof args !== 'object') {
      this.Logger.Warn(
        'MaxDate, invalid arguments. it should be a moment instance or an object like { max: momentInstance, mapper: val => val.date }'
      )
      return false
    }
    if (!args.mapper && !args.max && args instanceof moment) {
      finalArgs.max = args
    }
    if (!this.ValueRequired && !this.HasValue()) return true
    if (!args.max instanceof moment) {
      this.Logger.Warn(
        'MaxDate, You must pass a MomentJS instance as an argument'
      )
      return false
    }
    return moment(mapper(this.Val)).diff(args.max) < 0
  }
  MinDate(args) {
    const finalArgs = { mapper: val => val, min: null }
    if (typeof args !== 'object') {
      this.Logger.Warn(
        'MinDate, invalid arguments. it should be a moment instance or an object like { min: momentInstance, mapper: val => val.date }'
      )
      return false
    }
    if (!args.mapper && !args.min && args instanceof moment) {
      finalArgs.min = args
    }
    if (!this.ValueRequired && !this.HasValue()) return true
    if (!args.min instanceof moment) {
      this.Logger.Warn(
        'MinDate, You must pass a MomentJS instance as an argument'
      )
      return false
    }
    return moment(mapper(this.Val)).diff(args.min) > 0
  }

  DateBetween(
    momentMinDate = moment('2012-01-01'),
    momentMaxDate = moment('2019-01-01')
  ) {
    if (!this.ValueRequired && !this.HasValue()) return true
    return (
      this.MinDate(momentMaxDate, this.Val) &&
      this.MaxDate(momentMinDate, this.Val)
    )
  }

  // In Max Range << Number >>
  MaxLength(max = 10) {
    if (!this.ValueRequired && !this.HasValue()) return true
    if (!this.Val) {
      return false
    }
    return this.Val.length <= max
  }

  // In Min Range << Number >>
  MinLength(min = 5) {
    if (!this.ValueRequired && !this.HasValue()) return true
    if (!this.Val) {
      return false
    }
    return this.Val.length >= min
  }

  LengthBetween(limits = { min: 2, max: 10 }) {
    if (!this.ValueRequired && !this.HasValue()) return true
    return this.Val.length >= limits.min && this.Val.length <= limits.max
  }

  // Identical << Number >>
  SameAs(compatator = 'foo') {
    if (!this.ValueRequired && !this.HasValue()) return true
    return this.Val === compatator
  }

  // Matching << Number >>
  MatchesRegex(regex = /foo/) {
    if (!this.ValueRequired && !this.HasValue()) return true
    const match = this.Val.match(regex)
    return match && match[0] === match.input
  }

  // Array Length Min
  MinArrayLength(min = 2) {
    if (!this.ValueRequired && !this.HasValue()) return true
    if (!this.IsArray()) return false
    return this.Val.length > min
  }

  // Array Length Max
  MaxArrayLength(max = 10) {
    if (!this.ValueRequired && !this.HasValue()) return true
    if (!this.IsArray()) return false
    return this.Val.length < max
  }

  async Each(rules) {
    let i
    let current
    for (i = 0; i < this.Val.length; i += 1) {
      current = await new Validator(
        this.Val[i],
        rules,
        null,
        this.parent,
        i.toString()
      ).Run()
      if (!current.valid) {
        return current
      }
    }
    return true
  }

  async Keys(rules) {
    let i
    let current
    let ex
    let keys = Object.keys(rules)
    for (i = 0; i < keys.length; i += 1) {
      current = await new Validator(
        this.Val[keys[i]],
        rules[keys[i]],
        null,
        this.parent,
        keys[i].toString()
      ).Run()
      if (!current.valid) {
        return current
      }
    }
    return true
  }

  // Remote
  async Remote(
    args = {
      options: { url: '/', method: 'get' },
      callback: response => !!response,
      agent: axios
    }
  ) {
    const fallback = Core.axios || axios
    const agent = args.agent || fallback
    return await agent(args.options)
      .then(res => {
        if (args.callback) {
          return args.callback(res, this.Val)
        }
        return true
      })
      .catch(error => {
        if (args.catch) {
          return args.catch(error, this.Val)
        }
        return false
      })
  }

  PreConditions(conditions = []) {
    let i
    for (i = 0; i < conditions.length; i += 1) {
      if (typeof conditions[i] === 'boolean' && !conditions[i]) {
        return false
      }
      if (typeof conditions[i] === 'function') {
        if (conditions[i](this.Val) !== true) {
          return conditions[i](this.Val)
        }
      }
    }
    return true
  }
  resolveArgs(option) {
    if (
      typeof option === 'object' &&
      !Array.isArray(option) &&
      (option.args !== undefined ||
        (option.active !== undefined || option.message !== undefined))
    ) {
      return option.args
    } else return option
  }
  Run() {
    return new Promise(async (resolve, reject) => {
      let i
      let round
      let error
      const currentAttemp = this.Attemps
      for (i = 0; i < this.Rules.length; i += 1) {
        if (this.Options[this.Rules[i]] && this.Options[this.Rules[i]].active) {
          if (this.Options[this.Rules[i]].variable) {
            round = await this.Options[this.Rules[i]].args
          } else if (this.Rules[i] !== 'ResolvedPromise') {
            round = await this[this.Rules[i]](this.Options[this.Rules[i]].args)
          } else {
            this.Options[this.Rules[i]]
              .args()
              .then(() => {
                this.Attemps += 1
                return resolve({
                  error: null,
                  valid: true,
                  attemp: currentAttemp,
                  attemps: this.Attemps - 1
                })
              })
              .catch(() => {
                return this.DeliverError(
                  reject,
                  'ResolvedPromise',
                  false,
                  currentAttemp
                )
              })
            return
          }
          if (round !== true) {
            error = this.Rules[i]
            this.IsValid = false
            return this.DeliverError(reject, error, round, currentAttemp)
          }
        }
      }
      this.IsValid = true
      this.Attemps += 1
      return resolve({
        error: null,
        valid: true,
        attemp: currentAttemp,
        attemps: this.Attemps - 1
      })
    })
  }
}
