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
      :unclearable = "unclearable"
      :dropdown = "allowAutocomplete"
      :dropdown-options = "dropdownOptions"
      :dropdown-filter = "dropdownFilter"
      :on-error = "onError"
      :on-success = "onSuccess"
      :icon = "icon"
      :status-classes = "statusClasses"
      :dropdown-multiple = "multiple"
      :dropdown-mark-selections = "true"
      @input = "handleInputFieldInput"
      @cockeyup = "handleInputFieldKeyup"
      @cockeydown = "handleInputFieldKeydown"
      @meta = "handleInputFieldMeta"
      @control = "handleInputFieldControllers"
      @cocfocus = "handleFocus"
      @cocblur = "handleBlur"
      @cocmouseover = "handleMouseOver"
      @cocmouseleave = "handleMouseLeave"
      @cocmousedown = "handleMouseDown"
      @cocmouseup = "handleMouseUp"
      @cocdropdownselections = "handleDropdownSelections">
      <div
        v-if = "selections && selections.length"
        slot = "icon-prepend"
        class = "col coc-margin-0 coc-padding-2px right">
        <coc-tag
          v-for = "(selection, index) in selections"
          :key = "index"
          :color = "isFired ? ( isValid ? 'success' : 'error' ) : 'primary'"
          type = "outline"
          border-radius = "standard"
          font-size = "sm"
          class = "col coc-margin-x-3px coc-margin-y-0 coc-padding-0">
          <span>
            {{ selection }}
            <a @click = "ummarkTagOption(selection)" >x</a>
          </span>
        </coc-tag>
      </div>
      <slot name = "prepend"/>
      <template slot = "append">
        <slot name = "append"/>
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
      :val = "selections"
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
  name: 'CocPureSelect',
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
      type: [String, Object, Array],
      default() {
        return []
      }
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
      default: null
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
    },
    multiple: {
      type: Boolean,
      default: false
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
      isMounted: false,
      isLoading: false,
      autoCompleteRemoteFeeds: [],
      autocompleteRetriever: null,
      selections: []
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
          val: this.selections
        }
      })
    },
    model() {
      return {
        val: this.selections,
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
          isFired: this.isFired
        }
      }
    },
    onError() {
      return this.rules && !this.isValid.valid && this.isFired
    },
    onSuccess() {
      return this.rules && this.isValid.valid && this.isFired
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
        this.selections = this.resolveValue(val)
        // console.log(
        //   'selections isss',
        //   this.selections,
        //   'val iss',
        //   val.val,
        //   'placeholder is,',
        //   this.placeholder
        // )
        if (
          this.isMounted &&
          this.$refs.inputFieldReference.$refs.dropdown.selectedOptions !==
            this.selections
        ) {
          this.$refs.inputFieldReference.$refs.dropdown.selectedOptions = this.selections
        }
      }
    },
    selections() {
      if (this.isFired || this.isMounted) {
        this.handleAfterSelections()
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.isMounted = true
    }, 1000)
  },
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
    handleInputFieldKeydown(e) {
      if (e.keyCode === 8 && !e.target.value.length) {
        this.$refs.inputFieldReference.$refs.dropdown.selectedOptions.pop()
      }
    },
    handleValidation(e) {
      this.isValid = e
    },
    handleDropdownSelections(e) {
      this.selections = e
    },
    handleAfterSelections() {
      this.selections = this.$refs.inputFieldReference.$refs.dropdown.selectedOptions
      this.inputFieldControllers.update('')
      setTimeout(() => {
        this.inputFieldControllers.handleElementsWidth()
      }, 100)
    },
    ummarkTagOption(selection) {
      this.$refs.inputFieldReference.$refs.dropdown.unmarkOptionByValue(
        selection
      )
    },
    resolveValue(val) {
      // console.log(val, typeof val)
      if (typeof val === 'object' && !Array.isArray(val)) {
        return this.resolveCoreValue(val.val)
      } else if (typeof val === 'object' && Array.isArray(val)) {
        return this.resolveCoreValue(val)
      }
      return [val]
    },
    resolveCoreValue(val) {
      return val
      // if (!this.multiple) {
      //   return val.length ? val[0] : []
      // } else {
      //   return val
      // }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
