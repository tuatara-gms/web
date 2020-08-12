export default {
  props: {
    labeled: false,
    labelStatusClasses() {
      return {
        mount: 'coc-content-text',
        focus: 'coc-primary-text',
        success: 'coc-success-shade-3-text',
        error: 'coc-error-shade-3-text'
      }
    },
    iconStatusClasses() {
      return {
        mount: 'coc-content-text',
        focus: 'coc-primary-text',
        success: 'coc-success-shade-3-text',
        error: 'coc-error-shade-3-text'
      }
    },
    trim: false,
    atom: null,
    type: 'text',
    value: '',
    size() {
      return !this.$IVIEW || this.$IVIEW.size === ''
        ? 'default'
        : this.$IVIEW.size
    },
    placeholder: '',
    maxlength: null,
    disabled: false,
    icon: null,
    autosize: false,
    rows: 2,
    readonly: false,
    name: null,
    number: false,
    autofocus: false,
    spellcheck: false,
    autocomplete: 'off',
    clearable: false,
    elementId: null,
    wrap: 'soft',
    prefix: '',
    suffix: '',
    search: false,
    enterButton: false,
    label: '',
    data() {
      return []
    },
    filterMethod(value, option) {
      const formattedOption = new optionsFormatter(option).Resolve()
      return (
        formattedOption.label.toUpperCase().indexOf(value.toUpperCase()) !== -1
      )
    },
    placement: 'bottom',
    transfer: false,
    scope() {
      return []
    },
    rules: null,
    disablePlaceholderErrors: false,
    statusClasses() {
      return {}
    },
    lightModel: false,
    allowAutocomplete: false,
    autocompleteRemote: null,
    autocompleteMapResponse: (res, val) => res,
    autocompleteFetchOnce: false,
    autocompletePreventDebounce: false,
    autocompleteDebouncedTime: 500,
    autocompleteDebouncedOptions() {
      return { maxWait: 1000 }
    },
    filters: null,
    hideStatus: false,
    hideErrors: false
  },
  design: {
    statusClasses: {
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
  }
}
