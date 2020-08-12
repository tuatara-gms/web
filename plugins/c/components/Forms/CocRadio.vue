<template>
  <div :class = "[computedStatusClasses.initHolder]">
    <coc-form-atom
      ref = "atom"
      :coc-event-controller = "eventController"
      :validate = "computedRules"
      :val = "inputFieldModel"
      :scope = "scope"
      :disable-placeholder-errors = "disablePlaceholderErrors"
      @validation = "handleValidation"
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
    <RadioGroup
      v-if = "!multiple"
      :size = "size"
      v-model="inputFieldModel"
      @input = "handleInput">
      <template v-for = "(feed , index) in dropdownOptions">
        <Radio
          :type = "type"
          :key = "index"
          :disabled = "feed.disabled"
          :value = "feed.value"
          :size = "size"
          :border = "border"
          :label = "feed.label">
          <span>
            <span :class = "[ feed.icon ]"/>
            <span class = "coc_px_side_padding" >{{ feed.label }}</span>
            <span class="coc_px_side_padding"><small
              v-if = "feed.comment"
              :class = "[inverseAlign , 'coc_px_side_padding blue-grey-text text-lighten-1']">{{ feed.comment }}</small></span>
          </span>
        </Radio>
      </template>
    </RadioGroup>
    <CheckboxGroup
      v-else
      :size = "size"
      v-model="inputFieldModel"
      @input = "handleInput">
      <template v-for = "(feed , index) in dropdownOptions.map(o => new $coc.OptionsManager(o).Resolve())">
        <Checkbox
          :key = "index"
          :type = "type"
          :disabled = "feed.disabled"
          :value = "feed.value"
          :size = "size"
          :border = "border"
          :label = "feed.label">
          <span>
            <span :class = "[ feed.icon ]"/>
            <span class = "coc_px_side_padding" >{{ feed.label }}</span>
            <span class="coc_px_side_padding"><small
              v-if = "feed.comment"
              :class = "[inverseAlign , 'coc_px_side_padding blue-grey-text text-lighten-1']">{{ feed.comment }}</small></span>
          </span>
        </Checkbox>
      </template>
    </CheckboxGroup>

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
const oneOf = (val, array) => {
  return array.indexOf(val) !== -1
}
export default {
  name: 'CocRadio',
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
    value: {
      type: [String, Number, Array, Object],
      default() {
        return {
          val: '',
          control: {},
          meta: {}
        }
      }
    },
    label: {
      type: [String, Number, Array],
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Select'
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterMethod: {
      type: Function,
      default: null
    },
    remoteMethod: {
      type: Function,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: null
    },
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default: 'default'
    },
    labelInValue: {
      type: Boolean,
      default: false
    },
    notFoundText: {
      type: String,
      default: null
    },
    placement: {
      validator(value) {
        return oneOf(value, [
          'top',
          'bottom',
          'top-start',
          'bottom-start',
          'top-end',
          'bottom-end'
        ])
      },
      default: 'bottom-start'
    },
    transfer: {
      type: Boolean,
      default() {
        return !this.$IVIEW || this.$IVIEW.transfer === ''
          ? false
          : this.$IVIEW.transfer
      }
    },
    type: {
      type: String,
      default: null
    },
    cocOptions: {
      type: Boolean,
      default: false
    },
    // Use for AutoComplete
    autoComplete: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    elementId: {
      type: String,
      default: null
    },

    // Coc Special Attributes
    icon: {
      type: String,
      default: 'ios-code'
    },
    data: {
      type: Array,
      default: () => []
    },
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
    hideStatus: {
      type: Boolean,
      default: false
    },
    hideErrors: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      query: '',
      inputFieldModel: this.multiple ? [] : '',
      isValid: { valid: false },
      isFired: false,
      loaders: {
        validation: false,
        autocomplete: false
      },
      isFocused: false,
      atomControllers: {},
      autoCompleteRemoteFeeds: [],
      autocompleteRetriever: { loading: false },
      onReset: false
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
          type: 'input',
          val: this.inputFieldModel
        }
      }
    },
    componentId() {
      return this.elementId || `coc-select-${this._uid}`
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
          validate: this.getAtomController('validate'),
          meta: this.getAtomController('handleMeta')
        },
        meta: {
          valid: this.isValid.valid,
          validationData: this.isValid,
          isFired: this.isFired,
          isFocused: this.isFocused,
          query: this.query
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
        initHolder: 'coc-margin-y-3px',
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
      return () =>
        new this.$coc.$(this.$refs.input.$el).domer.querySelector(
          '.ivu-select-selection'
        )
    },
    computedRules() {
      if (!this.rules || this.onReset) return null
      if (typeof this.rules === 'object') {
        return this.rules
      }
      if (typeof this.rules === 'function') {
        return this.rules(this.model)
      }
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
      if (this.rules) {
        this.loaders.validation = true
      }
    },
    model: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$emit(
          'input',
          this.$coc.Forms.resolveValue(val, this.multiple ? [] : '')
        )
      }
    },
    hideStatus() {
      this.handleStyles()
    },
    multiple(val) {
      this.inputFieldModel = this.multiple ? [] : ''
    }
  },
  mounted() {
    // On Mount Code
    // console.log(this.$refs)
    const vm = this
    this.handleStyles()
    setTimeout(() => {
      // body
      if (
        this.$refs &&
        this.$refs.input &&
        this.$refs.input.$children &&
        this.$refs.input.$children.findIndex(
          i => i._name === '<ISelectHead>'
        ) !== -1
      ) {
        const inputToListen = this.$refs.input.$children.filter(
          i => i._name === '<ISelectHead>'
        )[0]
        inputToListen.$on('on-input-blur', () => {
          this.handleBlur()
        })
        inputToListen.$on('on-input-focus', () => {
          this.handleFocus()
        })
        inputToListen.$on('on-keydown', () => {
          this.handleInput()
          this.query = inputToListen.query
        })
      }
    }, 1000)
  },
  methods: {
    // Generators
    getAtomController(controller) {
      return this.atomControllers[controller]
    },
    // General Controllers
    async update(value = this.multiple ? [] : null, styleReaction = true) {
      this.inputFieldModel = value
      this.isFired = true
      if (styleReaction) {
        this.handleStyles()
      }
    },
    async clear() {
      this.update()
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
    handleOpenChange() {
      setTimeout(() => {
        this.handleStyles()
      }, 50)
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
    handleClear() {
      this.isFired = true
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
      if (!val) {
        return
      }
      if (typeof val === 'object' && !Array.isArray(val) && val.val) {
        this.inputFieldModel = val.val
      } else if (typeof val === 'string') {
        this.inputFieldModel = val
      } else if (
        typeof val === 'object' &&
        Array.isArray(val) &&
        this.multiple
      ) {
        this.inputFieldModel = val
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
      // const container = new this.$coc.$(this.$refs.input.$el)
      // const input = new this.$coc.$(this.inputRef())
      // let status = 'mount'
      // if (!this.isFired && !this.isFocused) {
      //   status = 'mount'
      // } else if (!this.isFired && this.isFocused) {
      //   status = 'focus'
      // } else if (this.isValid.valid) {
      //   status = 'success'
      // } else if (!this.isValid.valid && this.rules) {
      //   status = 'error'
      // }
      // this.handleClasses(container, input, status)
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
    }
  }
}
</script>

<style lang="css" scoped>
</style>
