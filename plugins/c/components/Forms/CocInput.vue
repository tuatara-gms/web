
<template>
  <div :class = "[computedStatusClasses.initHolder]">
    <coc-form-atom
      ref = "atom"
      v-bind = "atom"
      :coc-event-controller = "eventController"
      :validate = "computedRules"
      :val = "inputFieldModel"
      :scope = "scope"
      :filters = "filters"
      :disable-placeholder-errors = "disablePlaceholderErrors"
      @validation = "handleValidation"
      @filter = "handleAtomFilter"
      @coc-atom-control = "atomControllers = $event"/>
    <coc-axios
      v-if = "autocompleteComputedOptions"
      v-bind = "autocompleteComputedOptions"
      v-model = "autocompleteRetriever"
      @success = "handleAutocompleteSuccess"
      @catch = "handleAutocompleteError"/>
    <label
      v-if = "labeled"
      :class = "labelClasses">{{ label || placeholder }}
      <slot
        v-if = "!hideErrors && !isValid.valid && isValid.message && isFired && rules && Object.keys(rules).length && labeled"
        :error = "isValid"
        name = "error">
        <span
          class = "animated fadeIn coc-text-sm right">
          <span :class = "[isValid.icon]"/>
          {{ isValid.message }}
        </span>
      </slot>
    </label>
    <i-input
      v-if = "!allowAutocomplete"
      ref = "input"
      v-model = "inputFieldModel"
      :type = "inputType"
      :size = "size"
      :placeholder = "placeholder"
      :maxlength = "maxlength"
      :disabled = "disabled"
      :icon = "computedIcon"
      :autosize = "autosize"
      :rows = "rows"
      :readonly = "readonly"
      :name = "name"
      :number = "number"
      :autofocus = "autofocus"
      :clearable = "clearable"
      :element-id = "componentId"
      :wrap = "wrap"
      :prefix = "prefix"
      :suffix = "suffix"
      :search = "search"
      :enter-button = "enterButton"
      @on-focus = "handleFocus"
      @on-blur = "handleBlur"
      @on-change = "handleInput"
      @on-clear = "handleClear"
      @on-enter = "handleEnter">
      <slot 
        slot = "prepend" 
        name = "prepend"/>
      <slot 
        slot = "suffix" 
        name = "suffix"/>
      <slot 
        slot = "append" 
        name = "append"/>
      <slot 
        slot = "prefix" 
        name = "prefix"/>
    </i-input>
    <AutoComplete
      v-if = "allowAutocomplete"
      ref = "input"
      v-model = "inputFieldModel"
      :type = "inputType"
      :size = "size"
      :placeholder = "placeholder"
      :maxlength = "maxlength"
      :disabled = "disabled"
      :icon = "computedIcon"
      :autosize = "autosize"
      :rows = "rows"
      :readonly = "readonly"
      :name = "name"
      :number = "number"
      :autofocus = "autofocus"
      :clearable = "clearable"
      :element-id = "componentId"
      :wrap = "wrap"
      :prefix = "prefix"
      :suffix = "suffix"
      :search = "search"
      :label = "label"
      :data = "dropdownOptions"
      :filter-method = "filterMethod"
      :placement = "placement"
      :transfer = "transfer"
      :enter-button = "enterButton"
      @on-focus = "handleFocus"
      @on-blur = "handleBlur"
      @input = "handleInput"
      @on-change = "handleInput"
      @on-clear = "handleClear"
      @on-select = "handleSelect">
      <slot
        slot = "default"
        :options = "autocompleteMapResponse"
        :response = "autocompleteRetriever.response"
        name = "default"/>
      <slot 
        slot = "prepend" 
        name = "prepend"/>
      <slot 
        slot = "suffix" 
        name = "suffix"/>
      <slot 
        slot = "append" 
        name = "append"/>
      <slot 
        slot = "prefix" 
        name = "prefix"/>
    </AutoComplete>

    <slot
      v-if = "!hideErrors && !isValid.valid && isValid.message && isFired && rules && Object.keys(rules).length && !labeled"
      :error = "isValid"
      name = "error">
      <p
        class = "coc-error-text animated fadeIn coc-absolute coc-text-sm">
        <span :class = "[isValid.icon]"/>
        {{ isValid.message }}
      </p>
    </slot>
  </div>
</template>

<script>
import optionsFormatter from '../../modules/Options'
const oneOf = (val, array) => {
  return array.indexOf(val) !== -1
}
export default {
  name: 'CocInput',
  props: {
    labeled: {
      type: Boolean,
      default: false
    },
    labelStatusClasses: {
      type: Object,
      default() {
        return this.$coc.App.Defaults.components.cocInput.props.labelStatusClasses()
      }
    },
    iconStatusClasses: {
      type: Object,
      default() {
        return this.$coc.App.Defaults.components.cocInput.props.iconStatusClasses()
      }
    },
    trim: {
      type: Boolean,
      default: false
    },
    atom: {
      type: Object,
      default: null
    },
    type: {
      validator(value) {
        return oneOf(value, [
          'text',
          'textarea',
          'password',
          'url',
          'email',
          'date'
        ])
      },
      default: 'text'
    },
    value: {
      type: [String, Number, Object],
      default() {
        return {
          val: '',
          control: {},
          meta: {}
        }
      }
    },
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default() {
        return !this.$IVIEW || this.$IVIEW.size === ''
          ? 'default'
          : this.$IVIEW.size
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    readonly: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    number: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      validator(value) {
        return oneOf(value, ['on', 'off'])
      },
      default: 'off'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    elementId: {
      type: String,
      default: null
    },
    wrap: {
      validator(value) {
        return oneOf(value, ['hard', 'soft'])
      },
      default: 'soft'
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    search: {
      type: Boolean,
      default: false
    },
    enterButton: {
      type: [Boolean, String],
      default: false
    },
    // Autocomplete
    label: {
      type: [String, Number],
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    filterMethod: {
      type: [Function, Boolean],
      default: (value, option) => {
        const formattedOption = new optionsFormatter(option).Resolve()
        return (
          formattedOption.label.toUpperCase().indexOf(value.toUpperCase()) !==
          -1
        )
      }
    },
    placement: {
      validator(value) {
        return oneOf(value, ['top', 'bottom'])
      },
      default: 'bottom'
    },
    transfer: {
      type: Boolean,
      default: false
    },
    // Coc Special Attributes
    scope: {
      type: Array,
      default() {
        return []
      }
    },
    rules: {
      type: [Object, Function],
      default: null
    },
    disablePlaceholderErrors: {
      type: Boolean,
      default: false
    },
    statusClasses: {
      type: Object,
      default() {
        return this.$coc.App.Defaults.components.cocInput.props.statusClasses()
      }
    },
    lightModel: {
      type: Boolean,
      default: false
    },
    // autocomplete
    allowAutocomplete: {
      type: Boolean,
      default: false
    },
    autocompleteRemote: {
      type: [Object, Function],
      default: null
    },
    autocompleteMapResponse: {
      type: Function,
      default: (res, val) => res
    },
    autocompleteFetchOnce: {
      type: Boolean,
      default: false
    },
    autocompletePreventDebounce: {
      type: Boolean,
      default: false
    },
    autocompleteDebouncedTime: {
      type: Number,
      default: 500
    },
    autocompleteDebouncedOptions: {
      type: Object,
      default() {
        return { maxWait: 1000 }
      }
    },
    filters: {
      type: [String, Function, Array],
      default: null
    },
    hideStatus: {
      type: Boolean,
      default: false
    },
    hideErrors: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputFieldModel: '',
      isValid: { valid: false },
      isFired: false,
      loaders: {
        validation: false,
        autocomplete: false
      },
      isFocused: false,
      atomControllers: {},
      autoCompleteRemoteFeeds: [],
      autocompleteRetriever: { loading: false, response: null },
      onReset: false,
      watchingEnterOnAutocomplete: false,
      showPassword: false
    }
  },
  computed: {
    eventController() {
      return {
        type: 'input',
        model: this.model,
        component: {
          placeholder: this.placeholder,
          domId: this.componentId,
          type: this.type,
          val: this.inputFieldModel
        }
      }
    },
    model() {
      return {
        val: this.inputFieldModel,
        control: {
          focus: this.focus,
          blur: this.blur,
          select: this.select,
          copy: this.copy,
          update: this.update,
          clear: this.clear,
          reset: this.reset,
          disFire: this.disFire,
          validate: this.getAtomController('validate'),
          meta: this.getAtomController('handleMeta'),
          localMeta: this.localMeta,
          togglePassword: this.togglePassword
        },
        meta: {
          valid: this.isValid.valid,
          validationData: this.isValid,
          isFired: this.isFired,
          isFocused: this.isFocused,
          id: this.componentId,
          showPassword: this.showPassword,
          placeholder: this.placeholder,
          filtered: null
        }
      }
    },
    autocompleteInvoker() {
      if (this.autocompletePreventDebounce) {
        return this.autocompleteRetriever.retrieve
      } else {
        return this.$_.debounce(
          this.autocompleteRetriever.retrieve,
          this.autocompleteDebouncedTime,
          this.autocompleteDebouncedOptions
        )
      }
    },
    autocompleteComputedOptions() {
      if (this.allowAutocomplete && this.autocompleteRemote) {
        if (typeof this.autocompleteRemote === 'object') {
          return this.autocompleteRemote
        } else if (typeof this.autocompleteRemote === 'function') {
          return this.autocompleteRemote(this.model)
        } else return null
      }
    },
    computedIcon() {
      const init = this.isLoading
        ? this.computedStatusClasses.initLoadingIcon
        : this.icon
      return [init, this.iconClasses].join(' ')
    },
    isLoading() {
      const loadersArray = []
      Object.keys(this.loaders).forEach(i => {
        loadersArray.push(this.loaders[i])
      })
      const keys = [...loadersArray, this.autocompleteRetriever.loading]
      let i
      for (i = 0; i < keys.length; i += 1) {
        if (keys[i]) {
          return true
        }
      }
      return false
    },
    dropdownOptions() {
      return [...this.autoCompleteRemoteFeeds, ...this.data]
    },
    computedStatusClasses() {
      return {
        ...this.$coc.App.Defaults.components.cocInput.design.statusClasses,
        ...this.statusClasses
      }
    },
    labelClasses() {
      if (!this.labeled) return null
      let status = 'mount'
      if (!this.isFired && !this.isFocused) {
        status = 'mount'
      } else if (!this.isFired && this.isFocused) {
        status = 'focus'
      } else if (this.isValid.valid) {
        status = 'success'
      } else if (!this.isValid.valid && this.rules) {
        status = 'error'
      }
      return this.labelStatusClasses[status]
    },
    iconClasses() {
      if (!this.labeled) return null
      let status = 'mount'
      if (!this.isFired && !this.isFocused) {
        status = 'mount'
      } else if (!this.isFired && this.isFocused) {
        status = 'focus'
      } else if (this.isValid.valid) {
        status = 'success'
      } else if (!this.isValid.valid && this.rules) {
        status = 'error'
      }
      return this.iconStatusClasses[status]
    },
    inputRef() {
      if (!this.allowAutocomplete) {
        return () =>
          this.$refs.input.$refs[
            this.type !== 'textarea' ? 'input' : 'textarea'
          ]
      } else {
        return () => this.$refs.input.$refs.input.$refs.input
      }
    },
    computedRules() {
      if (!this.rules || this.onReset) return null
      if (typeof this.rules === 'object') {
        return this.rules
      }
      if (typeof this.rules === 'function') {
        return this.rules(this.model)
      }
    },
    componentId() {
      return this.elementId || `coc-input-${this._uid}`
    },
    inputType() {
      if (this.type !== 'password') return this.type
      if (this.showPassword) return 'text'
      return this.type
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(value) {
        this.handleValue(value)
      }
    },
    inputFieldModel() {
      this.isFired = true
      if (this.trim) {
        this.inputFieldModel = this.inputFieldModel.trim()
      }
      if (this.rules) {
        this.loaders.validation = true
      }
    },
    model: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$emit('input', this.$coc.Forms.resolveValue(val))
      }
    },
    allowAutocomplete(val) {
      if (val && !this.watchingEnterOnAutocomplete) {
        this.handleEnterOnAutocomplete()
      }
    },
    hideStatus() {
      this.handleStyles()
    }
    // ,
    // lightModel: {
    //   immediate: true,
    //   handler(val) {
    //     console.log(val, this.placeholder)
    //     this.$emit('input', this.$coc.Forms.resolveValue(this.inputFieldModel), val)
    //   }
    // }
  },
  mounted() {
    // On Mount Code
    const vm = this
    this.handleStyles()
    if (this.allowAutocomplete) this.handleEnterOnAutocomplete()
    // this.$emit('input', this.$coc.Forms.resolveValue(this.handleValue(this.value)))
    // this.inputFieldModel = this.$coc.Forms.resolveValue(this.inputFieldModel)
  },
  methods: {
    // Generators
    getAtomController(controller) {
      return this.atomControllers[controller]
    },
    async localMeta(meta) {
      return this.model.meta[meta]
    },
    // General Controllers
    async update(value = '', styleReaction = true) {
      this.inputFieldModel = value
      this.isFired = true
      if (styleReaction) {
        this.handleStyles()
      }
    },
    async clear() {
      this.update()
    },
    async disFire() {
      this.isFired = false
    },
    async reset() {
      this.onReset = true
      this.update('', false).then(() => {
        this.isFired = false
        this.handleStyles()
        this.onReset = false
        this.loaders.validation = false
      })
    },
    // Dom Controllers
    async focus() {
      this.inputRef().focus()
    },
    async blur() {
      this.inputRef().blur()
    },
    async select() {
      this.inputRef().select()
    },
    async copy() {
      if (!this.inputFieldModel || !this.inputFieldModel.length) {
        return
      }
      this.select().then(() => {
        if (document) {
          document.execCommand('copy')
        }
      })
    },
    // Events Methods
    handleEnter() {
      this.atomControllers.submit()
      this.$emit('coc-submit', this.model)
    },
    handleFocus() {
      this.isFocused = true
      this.handleStyles()
      this.$emit('coc-focus')
    },
    handleBlur() {
      this.isFocused = false
      this.handleStyles()
      this.$emit('coc-blur')
    },
    handleInput() {
      // some code
      if (
        this.allowAutocomplete &&
        this.autocompleteRemote &&
        !this.autocompleteFetchOnce
      ) {
        this.autocompleteInvoker()
      }
    },
    handleSelect(e) {
      this.$emit('coc-select', e)
      this.inputFieldModel = e
    },
    handleClear() {
      this.isFired = true
      this.inputFieldModel = ''
      this.$emit('coc-clear')
      // some code
    },
    // After Events Methods
    handleAutocompleteSuccess(e) {
      this.$emit('coc-autocomplete-success', e)
      if (this.autocompleteMapResponse) {
        this.autoCompleteRemoteFeeds = this.autocompleteMapResponse(
          e.response,
          this.model
        )
      }
    },
    handleAutocompleteError(e) {
      this.$emit('coc-autocomplete-error', e)
    },
    handleValue(val) {
      if (val === false || val === null || val === undefined) {
        return ''
      }
      if (typeof val === 'object') {
        this.inputFieldModel = val.val || ''
        // this.emitResolved(this.inputFieldModel)
      } else if (typeof val === 'string' || typeof val === 'number') {
        this.inputFieldModel = val.toString()
        // this.emitResolved(this.inputFieldModel)
      }
      return this.inputFieldModel
    },
    handleValidation(e) {
      if (e.attemps === 0) {
        if (!this.inputFieldModel || !this.inputFieldModel.length) {
          return
        }
      }
      this.isFired = true
      this.loaders.validation = false
      this.isValid = e
      this.handleStyles()
    },
    handleStyles() {
      const container = new this.$coc.$(this.$refs.input.$el)
      const input = new this.$coc.$(this.inputRef())
      let status = 'mount'
      if (!this.isFired && !this.isFocused) {
        status = 'mount'
      } else if (!this.isFired && this.isFocused) {
        status = 'focus'
      } else if (this.isValid.valid) {
        status = 'success'
      } else if (!this.isValid.valid && this.rules) {
        status = 'error'
      }
      this.handleClasses(container, input, status)
    },
    handleClasses(container, input, status) {
      Object.keys(this.computedStatusClasses).forEach(i => {
        // Standards
        if (i.startsWith('standard') && !this.isFired) {
          if (i.toLowerCase().includes('container')) {
            // console.log('adding stanadrd container')
            container.AddClass(this.computedStatusClasses[i], true)
          } else if (i.toLowerCase().includes('input')) {
            // console.log('adding stanadrd input')
            input.AddClass(this.computedStatusClasses[i], true)
          }
        }
        if (i.startsWith('init') && !this.isFired) {
          if (i.toLowerCase().includes('container')) {
            container.AddClass(this.computedStatusClasses[i], true)
          } else if (i.toLowerCase().includes('input')) {
            input.AddClass(this.computedStatusClasses[i], true)
          }
        } else {
          if (i !== status && !i.startsWith('standard')) {
            container.RemoveClass(this.computedStatusClasses[i])
            input.RemoveClass(this.computedStatusClasses[i])
          } else {
            if (this.hideStatus) {
              // console.log('hiiiiiiide')
              container.RemoveClass(this.computedStatusClasses[status])
              input.RemoveClass(this.computedStatusClasses[status])
            }
          }
        }
      })
      if (!this.hideStatus) {
        container.AddClass(this.computedStatusClasses[status])
        input.AddClass(this.computedStatusClasses[status])
      }
    },
    handleEnterOnAutocomplete() {
      const vm = this
      vm.watchingEnterOnAutocomplete = true
      const el = new this.$coc.$(`#${this.componentId}`)
      el.OnKeyUp(e => {
        if (e.keyCode === 13) {
          vm.$emit('coc-enter')
        }
      })
    },
    handleAtomFilter(e) {
      this.$emit('filter', e)
      this.model.meta.filtered = e
    },
    togglePassword() {
      if (this.type !== 'password') return
      this.showPassword = !this.showPassword
    },
    emitResolved(val, lightModel = this.lightModel, event = 'input') {
      this.$emit(event, this.$coc.Forms.resolveValue(val, lightModel))
    }
  }
}
</script>

<style lang="css" scoped>
</style>
