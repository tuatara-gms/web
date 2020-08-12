<template>
  <div>
    <coc-axios
      v-if = "autocompleteComputedOptions"
      v-bind = "autocompleteComputedOptions"
      v-model = "autocompleteRetriever"
      @success = "handleAutocompleteSuccess"
      @catch = "handleAutocompleteError"/>
    <coc-input-field
      ref = "inputFieldReference"
      v-model = "inputFieldModel"
      :placeholder = "placeholder"
      :type = "type"
      :size = "size"
      :autocomplete="autocomplete"
      :spellcheck="spellcheck"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      :icon = "icon"
      :unclearable = "unclearable"
      :dropdown = "allowAutocomplete"
      :dropdown-options = "dropdownOptions"
      :dropdown-filter = "dropdownFilter"
      :on-error = "onError"
      :on-success = "onSuccess"
      :status-classes = "statusClasses"
      @input = "handleInputFieldInput"
      @cockeyup = "handleInputFieldKeyup"
      @meta = "handleInputFieldMeta"
      @control = "handleInputFieldControllers"
      @cocfocus = "handleFocus"
      @cocblur = "handleBlur"
      @cocmouseover = "handleMouseOver"
      @cocmouseleave = "handleMouseLeave"
      @cocmousedown = "handleMouseDown"
      @cocmouseup = "handleMouseUp">
      <template slot = "prepend">
        <slot name = "prepend"/>
      </template>
      <template slot = "append">
        <slot
          :model = "model"
          name = "append"/>
      </template>
    </coc-input-field>
    <p
      v-if = "!isValid.valid && isValid.message && isFired"
      class = "coc-error-text">
      <span :class = "isValid.icon"/>
      {{ isValid.message }}
    </p>
    <coc-form-atom
      :coc-event-controller = "eventController"
      :validate = "rules"
      :val = "inputFieldModel"
      @validation = "handleValidation"/>
  </div>
</template>
<script>
import CocInputField from './Partials/CocInputField.vue'
const defaultFilter = (value, options) => {
  if (!options || !options instanceof Array) {
    return []
  }
  if (!value) {
    return options
  }
  return options.filter(
    option =>
      (typeof option === 'string' &&
        option.toLowerCase().includes(value.toString().toLowerCase())) ||
      ((typeof option === 'object' &&
        (option.value &&
          option.value
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase()))) ||
        (option.label &&
          option.label
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase())))
  )
}
export default {
  name: 'CocPureInput',
  components: {
    CocInputField
  },
  props: {
    placeholder: {
      type: String,
      default: 'Enter here..'
    },
    type: {
      type: String,
      default: 'text',
      validator(value) {
        return (
          [
            'text',
            'textarea',
            'password',
            'url',
            'email',
            'number',
            'date'
          ].indexOf(value) !== -1
        )
      }
    },
    value: {
      type: [String, Object],
      default: ''
    },
    size: {
      type: String,
      default: 'normal',
      validator(value) {
        return ['small', 'normal', 'large', 'massive'].indexOf(value) !== -1
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
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
        return value === 'on' || value === 'off'
      },
      default: 'off'
    },
    unclearable: {
      type: Boolean,
      default: false
    },
    scope: {
      type: Array,
      default() {
        return []
      }
    },
    rules: {
      type: Object,
      default: null
    },
    statusClasses: {
      type: Object,
      default() {
        return {}
      }
    },
    icon: {
      type: String,
      default: 'ivu-icon ivu-icon-md-create'
    },
    // Dropdown
    dropdownFilter: {
      type: Function,
      default: defaultFilter
    },
    // autocomplete
    allowAutocomplete: {
      type: Boolean,
      default: false
    },
    autocompleteFeeds: {
      type: Array,
      default() {
        return []
      }
    },
    autocompleteRemote: {
      type: [Object, Function],
      default: null
    },
    autocompleteMapResponse: {
      type: Function,
      default: (res, val) => res
    }
  },
  data() {
    return {
      inputFieldMeta: null,
      inputFieldControllers: null,
      inputFieldModel: null,
      isFocused: false,
      isMouseDown: false,
      isMouseOver: false,
      isValid: { valid: false },
      isFired: false,
      isLoading: false,
      autoCompleteRemoteFeeds: [],
      autocompleteRetriever: null
    }
  },
  computed: {
    eventController() {
      return new this.$coc.FormController({
        api: this.$root,
        type: 'input',
        scope: this.scope,
        model: this.model,
        component: {
          placeholder: this.placeholder,
          domId: this.inputFieldMeta ? this.inputFieldMeta.ids.input : null,
          type: 'input',
          val: this.input
        }
      })
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
          toggleDropdown: this.toggleDropdown,
          switchDropdown: this.switchDropdown,
          clear: this.clear,
          reset: this.reset
        },
        meta: {
          isValid: this.isValid,
          isFired: this.isFired,
          isFocused: this.isFocused,
          onSuccess: this.onSuccessStatus,
          onError: this.onErrorStatus
        }
      }
    },
    onError() {
      return this.onErrorStatus()
    },
    onSuccess() {
      return this.onSuccessStatus()
    },
    // Autocomplette
    autocompleteComputedOptions() {
      if (this.allowAutocomplete && this.autocompleteRemote) {
        if (typeof this.autocompleteRemote === 'object') {
          return this.autocompleteRemote
        } else if (typeof this.autocompleteRemote === 'function') {
          return this.autocompleteRemote(this.model)
        } else return null
      }
    },
    dropdownOptions() {
      return [...this.autocompleteFeeds, ...this.autoCompleteRemoteFeeds]
    }
  },
  watch: {
    model: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value: {
      deep: true,
      handler(val) {
        if (typeof val === 'object') {
          this.inputFieldModel = val.val
        } else if (typeof val === 'string') {
          this.inputFieldModel = val
        }
      }
    }
  },
  mounted() {},
  methods: {
    // Controllers
    async reset() {
      await this.clear()
        .then(() => {
          this.switchDropdown(false)
        })
        .then(() => {
          this.isValid.valid = false
          this.isFired = false
        })
    },
    async toggleDropdown() {
      if (!this.inputFieldControllers) {
        return
      }
      this.inputFieldControllers.toggleDropdown()
    },
    async switchDropdown(status = false) {
      if (!this.inputFieldControllers) {
        return
      }
      this.inputFieldControllers.switchDropdown(status)
    },
    async focus() {
      if (!this.inputFieldControllers) {
        return
      }
      this.inputFieldControllers.focus()
    },
    async blur() {
      if (!this.inputFieldControllers) {
        return
      }
      this.inputFieldControllers.blur()
    },
    async select() {
      if (!this.inputFieldControllers) {
        return
      }
      this.inputFieldControllers.select()
    },
    async copy() {
      if (!this.inputFieldControllers) {
        return
      }
      this.inputFieldControllers.copy()
    },
    async clear() {
      if (!this.inputFieldControllers) {
        return
      }
      this.inputFieldControllers.clear()
    },
    async update(val = '') {
      if (!this.inputFieldControllers) {
        return
      }
      this.inputFieldControllers.update(val)
    },
    // AutoComplete Events
    handleAutocompleteSuccess(e) {
      this.$emit('autocomplete-success', e)
      if (this.autocompleteMapResponse) {
        this.autoCompleteRemoteFeeds = this.autocompleteMapResponse(
          e.response,
          this.model
        )
      }
    },
    handleAutocompleteError(e) {
      this.$emit('autocomplete-error', e)
    },
    // Input Field Events
    handleInputFieldMeta(e) {
      this.inputFieldMeta = e
    },
    handleInputFieldControllers(e) {
      this.inputFieldControllers = e
      window.inputFieldControllers = e
    },
    // Handle Events
    handleFocus(e) {
      this.isFocused = true
      this.$emit('coc-focus', e)
    },
    handleBlur(e) {
      this.isFocused = false
      this.$emit('coc-blur', e)
    },
    handleMouseUp(e) {
      this.isMouseDown = true
      this.$emit('coc-mouse-up', e)
    },
    handleMouseDown(e) {
      this.isMouseDown = false
      this.$emit('coc-mouse-down', e)
    },
    handleMouseOver(e) {
      this.isMouseOver = true
      this.$emit('coc-mouse-over', e)
    },
    handleMouseLeave(e) {
      this.isMouseOver = false
      this.$emit('coc-mouse-leave', e)
    },

    handleInputFieldInput() {
      this.isValid.valid = false
      this.isFired = true
      this.$emit('input', this.inputValue)
    },
    handleInputFieldKeyup(e) {
      this.$emit('coc-keyup', e)
      if (this.autocomplete && this.autocompleteComputedOptions) {
        this.autocompleteRetriever.retrieve()
      }
    },
    handleValidation(e) {
      this.isValid = e
    },
    onErrorStatus() {
      return this.rules && !this.isValid.valid && this.isFired
    },
    onSuccessStatus() {
      return this.rules && this.isValid.valid && this.isFired
    }
  }
}
</script>

<style lang="css" scoped>
</style>
