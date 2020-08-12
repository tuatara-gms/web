
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
      :class = "labelClasses">{{ placeholder }}
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
    <input-number
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
      class = "coc-full-width"
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
    </input-number>
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
  name: 'CocNumberInput',
  props: {
    labeled: {
      type: Boolean,
      default: false
    },
    labelStatusClasses: {
      type: Object,
      default() {
        return {
          mount: 'coc-content-text',
          focus: 'coc-primary-text',
          success: 'coc-success-shade-3-text',
          error: 'coc-error-shade-3-text'
        }
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
          val: 0,
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
        return {}
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
    },

    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    activeChange: {
      type: Boolean,
      default: true
    },
    precision: {
      type: Number,
      default: null
    },
    formatter: {
      type: Function,
      default: null
    },
    parser: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      inputFieldModel: 0,
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
      watchingEnterOnAutocomplete: false
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
          meta: this.getAtomController('handleMeta')
        },
        meta: {
          valid: this.isValid.valid,
          validationData: this.isValid,
          isFired: this.isFired,
          isFocused: this.isFocused,
          id: this.componentId,
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
      return this.isLoading
        ? this.computedStatusClasses.initLoadingIcon
        : this.icon
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
      const defaults = {
        initHolder:
          'row coc-margin-0 coc-padding-y-3px coc-padding-x-0 coc-smooth-height',
        initContainer: 'coc-standard-border-radius',
        initInput: 'coc-standard-border-radius',
        initLoadingIcon: 'ivu-icon ivu-icon-ios-loading coc-spin',
        initIcon: '',
        success:
          'coc-success-tint-9-bg coc-success-shade-3-text coc-success-focus-box-tint-5-shadow coc-success-border coc-standard-border-radius',
        error:
          'coc-error-tint-9-bg coc-error-shade-3-text coc-error-focus-box-tint-5-shadow coc-error-border coc-standard-border-radius',
        mount:
          'coc-border-border coc-content-text coc-primary-background-bg coc-standard-border-radius',
        focus: 'coc-primary-section-outline coc-standard-border-radius'
      }
      return { ...defaults, ...this.statusClasses }
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
    inputRef() {
      // if (!this.allowAutocomplete) {
      //   return () =>
      //     this.$refs.input.$refs[
      //       this.type !== 'textarea' ? 'input' : 'textarea'
      //     ]
      // } else {
      //   return () => this.$refs.input.$refs.input.$refs.input
      // }
      return () => this.$refs.input.$el.querySelector('input')
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
        this.$emit('input', this.$coc.Forms.resolveValue(val, 0))
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
  },
  mounted() {
    // On Mount Code
    const vm = this
    this.handleStyles()
    if (this.allowAutocomplete) this.handleEnterOnAutocomplete()
  },
  methods: {
    // Generators
    getAtomController(controller) {
      return this.atomControllers[controller]
    },
    // General Controllers
    async update(value = 0, styleReaction = true) {
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
      this.update(0, false).then(() => {
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
      this.inputFieldModel = 0
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
        return
      }
      if (typeof val === 'object') {
        this.inputFieldModel = val.val
      } else if (typeof val === 'string' || typeof val === 'number') {
        this.inputFieldModel = parseFloat(val, 10)
      }
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
        if (i.startsWith('init') && !this.isFired) {
          if (i.toLowerCase().includes('container')) {
            container.AddClass(this.computedStatusClasses[i], true)
          } else if (i.toLowerCase().includes('input')) {
            input.AddClass(this.computedStatusClasses[i], true)
          }
        } else {
          if (i !== status) {
            container.RemoveClass(this.computedStatusClasses[i])
            input.RemoveClass(this.computedStatusClasses[i])
          } else {
            if (this.hideStatus) {
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
    }
  }
}
</script>

<style lang="css" scoped>
</style>
