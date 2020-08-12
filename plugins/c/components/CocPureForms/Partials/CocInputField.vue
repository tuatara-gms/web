<template>
  <coc-dropdown
    ref = "dropdown"
    v-model = "dropdownModel"
    :active = "dropdown && dropdownFocus"
    :input = "lastKeyUp"
    :options-filter = "dropdownFilter"
    :feeds = "dropdownOptions"
    :multiple = "dropdownMultiple"
    :mark-selections = "dropdownMarkSelections"
    @control = "dropdownControllers = $event"
    @optionprescoped = "handleOptionPrescope"
    @optionpicked = "handleOptionPicked"
    @noselections = "handleOptionNoSelections"
    @selections = "handleDropdownSelections">
    <div
      v-if = "isMounted"
      ref = "container"
      slot = "toggler"
      :id = "ids.container"
      :class = "inputContainerClasses">
      <div
        ref = "prepend"
        :id = "ids.prepend"
        class = "col house-keeper coc-input-field-prepend">
        <slot name = "icon-prepend" />
        <span :class = "inputIconClasses"/>
        <div class="col house-keeper">
          <slot name = "prepend" />
        </div>
      </div>
      <component 
        ref = "input"
        v-model = "inputValue"
        :is = "componentType"
        :id = "ids.input"
        :class = "inputFieldClasses"
        :type = "type"
        :value = "inputValue"
        :autocomplete="autocomplete"
        :spellcheck="spellcheck"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :placeholder="placeholder"
        @input = "handleKeyup"
        @focus = "handleFocus"
        @blur = "handleBlur"
        @keyup.enter="handleEnter"
        @keyup.esc="handleEsc"
        @keyup.up="handleKeyUpArrowUp"
        @keyup.down="handleKeyUpArrowDown"
        @keyup="handleKeyup"
        @keypress="handleKeypress"
        @keydown="handleKeydown"
        @mouseover = "handleMouseOver"
        @mouseleave = "handleMouseLeave"
        @mousedown = "handleMouseDown"
        @mouseup = "handleMouseUp"/>
      <div
        ref = "append"
        :id = "ids.append"
        style = "min-width: 35px; max-width: 300px"
        class = "col house-keeper coc-input-field-append right">
        <span
          v-if = "dropdown"
          class = "coc-padding-x-4px">
          <span
            v-if = "dropdown"
            :class = "[
              {'ivu-icon ivu-icon-ios-arrow-up coc-input-field-icon': dropdownModel.val.active},
              {'ivu-icon ivu-icon-ios-arrow-down coc-input-field-icon': !dropdownModel.val.active},
            ]"
            class = "coc-border-0 coc-content-text coc-primary-hover-text animated pulse pointer"
            @click = "dropdownFocus = !dropdownFocus"/>
          <span
            :class = "[
              {'force-transparent': !showClearButton},
              {'coc-content-text coc-primary-hover-text animated pulse pointer': showClearButton}]"
            class = "coc-border-0 ivu-icon ivu-icon-ios-close-circle coc-input-field-icon "
            @click = "clear"/>
        </span>
        <slot name = "append"/>
      </div>
    </div>
  </coc-dropdown>
</template>

<script>
import CocDropdown from './CocDropdown'
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
        option.toLowerCase().includes(value.toLowerCase())) ||
      ((typeof option === 'object' &&
        (option.value &&
          option.value.toLowerCase().includes(value.toLowerCase()))) ||
        (option.label &&
          option.label.toLowerCase().includes(value.toLowerCase())))
  )
}
const specialKeys = [37, 38, 39, 40, 13, 27]
const arrowKeys = [37, 38, 39, 40]
export default {
  name: 'CocInputField',
  components: {
    CocDropdown
  },
  props: {
    placeholder: {
      type: String,
      default: 'Enter here..'
    },
    value: {
      type: [Number, String],
      default: ''
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
    size: {
      type: String,
      default: 'normal',
      validator(value) {
        return ['small', 'normal', 'large', 'massive'].indexOf(value) !== -1
      }
    },
    statusClasses: {
      type: Object,
      default() {
        return {}
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
    icon: {
      type: String,
      default: 'ivu-icon ivu-icon-md-create'
    },
    onSuccess: {
      type: Boolean,
      default: false
    },
    onError: {
      type: Boolean,
      default: false
    },
    dropdown: {
      type: Boolean,
      default: false
    },
    dropdownFilter: {
      type: Function,
      default: defaultFilter
    },
    dropdownOptions: {
      type: Array,
      default() {
        return []
      }
    },
    dropdownMultiple: {
      type: Boolean,
      default: false
    },
    dropdownMarkSelections: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFocused: false,
      isMouseOver: false,
      isMouseDown: false,
      inputValue: this.value,
      isMounted: false,
      dropdownControllers: null,
      dropdownFocus: false,
      lastKeyUp: '',
      ids: {
        container: `coc-input-container-${this._uid}`,
        input: `coc-input-field-${this._uid}`,
        append: `coc-input-append-${this._uid}`,
        prepend: `coc-input-prepend-${this._uid}`
      },
      dropdownModel: { val: { active: false } }
    }
  },
  computed: {
    inputContainerClasses() {
      const classes = [
        this.computedStatusClasses.container,
        'row',
        'house-keeper'
      ]
      // Focus State
      if (this.isFocused) {
        classes.push(this.computedStatusClasses.focus)
      }
      // The Size class
      classes.push(this.size)
      // Alignment
      classes.push(`coc-text-${this.globalAlignment}`)
      // Status Control
      if (this.onError && !this.onSuccess) {
        classes.push(this.computedStatusClasses.error)
      }
      if (this.onSuccess && !this.onError) {
        classes.push(this.computedStatusClasses.success)
      }
      return classes
    },
    inputIconClasses() {
      const classes = ['coc-input-field-icon', 'coc-padding-x-4px']
      if (this.icon) {
        classes.push(this.icon)
      }
      return classes
    },
    inputFieldClasses() {
      const classes = [
        'col',
        'coc-margin-y-0',
        'coc-margin-x-0',
        this.computedStatusClasses.input
      ]
      // Alignment
      classes.push(`coc-text-${this.globalAlignment}`)
      return classes
    },
    computedStatusClasses() {
      const defaults = {
        container: 'coc-input-field-container',
        input: 'coc-input-field',
        success: 'success',
        error: 'error',
        focus: 'focused'
      }
      return { ...defaults, ...this.statusClasses }
    },
    globalAlignment() {
      return this.$coc.App.Defaults.Design.Alignment
    },
    globalAlignmentInverse() {
      return this.$coc.App.Defaults.Design.Alignment === 'left'
        ? 'right'
        : 'left'
    },
    domer() {
      return new this.$coc.$(`#${this.ids.input}`, { prefetch: true })
    },
    showClearButton() {
      return (
        !this.unclearable &&
        (this.inputValue && this.inputValue.toString().length)
      )
    },
    componentType() {
      return this.type === 'textarea' ? 'textarea' : 'input'
    }
  },
  watch: {
    value(value) {
      this.update(value, true)
    }
  },
  mounted() {
    this.isMounted = true
    setTimeout(() => {
      if (process.browser && document) {
        const { handleElementsWidth } = this
        window.addEventListener('resize', () => {
          handleElementsWidth()
        })
        handleElementsWidth()
      }
    }, 1000)
    this.$emit('meta', { ids: this.ids })
    this.$emit('control', {
      focus: this.focus,
      blur: this.blur,
      select: this.select,
      copy: this.copy,
      clear: this.clear,
      update: this.update,
      toggleDropdown: this.toggleDropdown,
      switchDropdown: this.switchDropdown,
      handleElementsWidth: this.handleElementsWidth
    })
  },
  methods: {
    // Controllers
    clear() {
      if (!this.inputValue || !this.inputValue.length) {
        return
      }
      this.update('')
    },
    update(value, updateLastKeyup = true) {
      this.$refs.input.value = value
      if (updateLastKeyup && this.inputValue !== value) {
        this.lastKeyUp = value
        this.$emit('input', value)
        this.inputValue = value
      }
      this.handleElementsWidth()
    },
    toggleDropdown() {
      this.dropdownFocus = !this.dropdownFocus
    },
    switchDropdown(status = false) {
      this.dropdownFocus = !!status
    },
    // Handling Events
    handleFocus(e) {
      this.isFocused = true
      this.dropdownFocus = true
      this.$emit('cocfocus', e)
    },
    handleBlur(e) {
      this.isFocused = false
      setTimeout(() => {
        this.dropdownFocus = false
      }, 300)
      this.$emit('cocblur', e)
    },
    handleInputEvent(e) {
      // this.inputValue = e.target.value
      // this.dropdownFocus = true
    },
    handleMouseUp(e) {
      this.isMouseDown = false
      this.$emit('cocmouseup', e)
    },
    handleMouseDown(e) {
      this.isMouseDown = true
      this.$emit('cocmousedown', e)
    },
    handleMouseOver(e) {
      this.isMouseOver = true
      this.$emit('cocmouseover', e)
    },
    handleMouseLeave(e) {
      this.isMouseOver = false
      this.$emit('cocmouseleave', e)
    },
    handleEnter(event) {
      this.$emit('cocenter', event)
      if (this.dropdownFocus) {
        if (event.target.value !== this.inputValue) {
          this.update(event.target.value, true)
        }
        this.dropdownFocus = false
      } else {
        this.$emit('cocsubmit')
      }
    },
    handleEsc(event) {
      this.$emit('cocesc', event)
      if (this.dropdownFocus) {
        this.dropdownFocus = false
      }
    },
    handleKeydown(event) {
      this.$emit('cockeydown', event)
    },
    handleKeypress(event) {
      this.$emit('cockeypress', event)
    },
    handleKeyup(event) {
      this.$emit('cockeyup', event)
      if (arrowKeys.indexOf(event.keyCode) !== -1) {
        this.dropdownFocus = true
        return
      }
      if (specialKeys.indexOf(event.keyCode) !== -1) {
        return
      }
      this.update(event.target.value, true)
      this.dropdownFocus = true
    },
    handleKeyUpArrowUp(event) {
      this.$emit('cocarrowup', event)
      this.dropdownControllers.decrement()
    },
    handleKeyUpArrowDown(event) {
      this.$emit('cocarrowdown', event)
      this.dropdownControllers.increment()
    },
    handleOptionPrescope(value) {
      this.$refs.input.value = value
      setTimeout(() => {
        this.moveCursorToEnd(this.$refs.input)
      }, 100)
    },
    handleOptionPicked(value) {
      if (this.inputValue === value) {
        this.dropdownFocus = false
        return
      }
      this.update(value)
      setTimeout(() => {
        this.moveCursorToEnd(this.$refs.input)
      }, 100)
      this.dropdownFocus = false
    },
    handleOptionNoSelections() {
      this.$refs.input.value = this.lastKeyUp
    },
    // DOM methods
    focus() {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
    select() {
      if (!this.inputValue || !this.inputValue.length) {
        return
      }
      this.$refs.input.select()
    },
    copy() {
      if (!this.inputValue || !this.inputValue.length) {
        return
      }
      this.select()
      if (document) {
        document.execCommand('copy')
      }
    },
    moveCursorToEnd(el) {
      if (!el || !this.inputValue) {
        return
      }
      if (typeof el.selectionStart === 'number') {
        el.selectionStart = el.selectionEnd = el.value.length
      } else if (typeof el.createTextRange != 'undefined') {
        el.focus()
        let range = el.createTextRange()
        range.collapse(false)
        range.select()
      }
    },
    handleElementsWidth() {
      if (!process.browser || !document) {
        return
      }
      const container = this.$refs.container
      const input = this.$refs.input
      const append = this.$refs.append
      const prepend = this.$refs.prepend
      if (!container || !input || !append || !prepend) {
        return
      }
      const offsets = {
        container: container.offsetWidth,
        input: input.offsetWidth,
        append: append.offsetWidth,
        prepend: prepend.offsetWidth
      }
      const width = Math.floor(
        offsets.container - (offsets.append + offsets.prepend + 10)
      )
      input.style.width = `${width}px`
    },
    forbiddenKeyCode(code) {
      return specialKeys.indexOf(code) !== -1
    },
    handleDropdownSelections(e) {
      this.$emit('cocdropdownselections', e)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
