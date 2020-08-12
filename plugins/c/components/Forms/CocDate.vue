<template>
  <div>
    <DatePicker
      :id = "componentId"
      v-bind = "bind"
      v-model = "input"
      format="d/M/yyyy"
      class = "full-width"
      @on-change = "isFired = true">
      <slot/>
    </DatePicker>
    <label
      v-if = "!isValid && isFired"
      :class = "[ status_classes.errmenu , 'animated slideInUp']">
      <span :class = "errorsBus[error].icon"/>
      <span>{{ errorsBus[error].msg }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'CocDate',
  props: {
    bind: {
      type: Object,
      default: null
    },
    light: {
      type: Boolean,
      default: false
    },
    scope: {
      type: Array,
      default: () => {
        return []
      }
    },
    required: {
      type: Boolean,
      default: false
    },
    max: {
      type: Object,
      default: null
    },
    min: {
      type: Object,
      default: null
    },
    mixins: {
      type: Object,
      default: null
    },
    input_status_classes: {
      type: Object,
      default: () => {
        return {
          success: 'coc-input-success',
          error: 'coc-input-error',
          focus: 'coc-input-focus',
          regular: 'coc-input-regular',
          init: 'coc-input-init'
        }
      }
    },
    input_status_classes_mixins: {
      type: Object,
      default: () => {
        return {}
      }
    },
    status_classes: {
      type: Object,
      default: () => {
        return {
          success: 'green-text',
          error: 'red-text',
          errmenu: 'red-text'
        }
      }
    }
  },
  data() {
    return {
      clientOffset: new Date().getTimezoneOffset(),
      input: null,
      isValid: true,
      isFired: false,
      error: null
    }
  },
  computed: {
    eventController() {
      return new this.$coc.FormController({
        api: $nuxt,
        type: 'Date',
        scope: this.scope,
        model: this.model,
        component: {
          placeholder: this.placeholder,
          domId: this.componentId,
          type: 'Date',
          val: this.input
        }
      })
    },
    model() {
      return this.light
        ? this.input
        : {
            val: this.input,
            control: {
              update: this.update,
              clear: this.clear,
              meta: this.meta,
              reset: this.reset,
              submit: this.submit,
              validate: this.validate
            },
            meta: {
              fired: this.isFired,
              valid: this.isValid,
              errors: this.errors,
              domId: this.componentId
            }
          }
    },
    limits() {
      return {
        max: this.getLimitDate(this.max),
        min: this.getLimitDate(this.min)
      }
    },
    componentId() {
      return 'coc_date_picker_' + this._uid
    },
    jQueryComponentId() {
      return '#coc_date_picker_' + this._uid
    },
    inputStatusMixins() {
      return new this.$coc.Objects(this.input_status_classes).Mix( // eslint-disable-line
        this.input_status_classes_mixins
      ).get
    },
    iconClass() {
      let str = 'coc_input_icon '
      let result = { suffix: '', prefix: '' }
      str = this.isLoading ? 'el-icon-loading ' : this.icon + ' '
      str =
        this.isFired && this.isValid
          ? str + this.status_classes.success + ' '
          : str
      str =
        this.isFired && !this.isValid
          ? str + this.status_classes.error + ' '
          : str
      result.suffix = this.icon_align == 'right' ? str : ''
      result.prefix = this.icon_align != 'right' ? str : ''
      return result
    },
    errorsBus() {
      const init = {
        HasValue: {
          icon: 'ivu-icon ivu-icon-md-alert',
          msg: 'This field is required.'
        },
        InMaxRange: {
          icon: 'ivu-icon ivu-icon-md-alert',
          msg: `The maximum value for this date cant be greater than ${
            this.max ? this.$moment(this.limits.max).format('DD MMMM YYYY') : ''
          }`
        },
        InMinRange: {
          icon: 'ivu-icon ivu-icon-md-alert',
          msg: `The maximum value for this date cant be less than ${
            this.min ? this.$moment(this.limits.min).format('DD MMMM YYYY') : ''
          }`
        }
      }
      if (this.mixins) {
        let k
        for (k in this.mixins) {
          if (init[k] !== undefined) {
            if (this.mixins[k].msg !== undefined)
              init[k].msg = this.mixins[k].msg
            if (this.mixins[k].icon !== undefined)
              init[k].icon = this.mixins[k].icon
          }
        }
      }
      return init
    }
  },
  watch: {
    input: {
      immediate: false,
      handler(val) {
        const validationOutput = this.getValidationValue(
          val || (typeof val === 'string' && val.length)
            ? this.$moment(val)
            : null
        )
        this.isValid = validationOutput.valid
        this.error = validationOutput.valid ? null : validationOutput.error
        this.watchMyDom()
        this.$emit('input', this.model)
      }
    }
  },
  mounted() {
    this.eventController.Start()
  },
  methods: {
    getValidationValue(val) {
      // Required
      if (this.required && !val) {
        return {
          valid: false,
          error: 'HasValue'
        }
      }

      // Max

      if (this.limits.max && val) {
        if (this.limits.max.diff(val) < 0) {
          return {
            valid: false,
            error: 'InMaxRange'
          }
        }
      }

      // Min

      if (this.limits.min && val) {
        if (this.limits.min.diff(val) > 0) {
          return {
            valid: false,
            error: 'InMinRange'
          }
        }
      }

      return {
        valid: true
      }
    },
    validate() {
      this.isValid = true
      const validation = this.getValidationValue(
        this.input || (typeof val === 'string' && this.input.length)
          ? this.$moment(this.input)
          : null
      )
      this.isFired = true
      this.isValid = validation.valid
      this.error = validation.error
      this.watchMyDom()
      if (arguments.length > 0) {
        if (arguments[0] == 'meta') {
          this.isFired = true
          this.meta('valid')
        }
      }
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    getLimitDate(limit) {
      if (!limit) return null
      // Date
      if (limit.date && !limit.margin) {
        return limit.date
      }
      //  Date and Operation
      if (
        limit.date &&
        limit.margin &&
        limit.margin.count &&
        limit.margin.unit
      ) {
        return this.$moment(limit.date).add(
          limit.margin.count,
          limit.margin.unit
        )
      }
      // Operation from Client Date
      if (
        !limit.date &&
        limit.margin &&
        limit.margin.count &&
        limit.margin.unit
      ) {
        return this.$moment()
          .add(this.clientOffset, 'm')
          .add(limit.margin.count, limit.margin.unit)
      }
    },
    watchMyDom() {
      if (!this.inputStatusMixins) return
      if (
        !new this.$coc.$(this.jQueryComponentId).HasClass(this.inputStatusMixins.init) // eslint-disable-line
      )
        new this.$coc.$(this.jQueryComponentId).AddClass(this.inputStatusMixins.init); // eslint-disable-line
      if (!this.isFired) {
        if (this.isFocused) {
          new this.$coc.$(this.jQueryComponentId) // eslint-disable-line
            .RemoveClass(this.inputStatusMixins.regular)
            .RemoveClass(this.inputStatusMixins.success)
            .RemoveClass(this.inputStatusMixins.error)
          new this.$coc.$(this.jQueryComponentId).AddClass( // eslint-disable-line
            this.inputStatusMixins.focus
          )
        } else {
          new this.$coc.$(this.jQueryComponentId) // eslint-disable-line
            .RemoveClass(this.inputStatusMixins.focus)
            .RemoveClass(this.inputStatusMixins.success)
            .RemoveClass(this.inputStatusMixins.error)
          new this.$coc.$(this.jQueryComponentId).AddClass( // eslint-disable-line
            this.inputStatusMixins.regular
          )
        }
      } else if (this.isValid) {
        new this.$coc.$(this.jQueryComponentId) // eslint-disable-line
          .RemoveClass(this.inputStatusMixins.regular)
          .RemoveClass(this.inputStatusMixins.focus)
          .RemoveClass(this.inputStatusMixins.error)
        new this.$coc.$(this.jQueryComponentId).AddClass( // eslint-disable-line
          this.inputStatusMixins.success
        )
      } else {
        new this.$coc.$(this.jQueryComponentId) // eslint-disable-line
          .RemoveClass(this.inputStatusMixins.regular)
          .RemoveClass(this.inputStatusMixins.success)
          .RemoveClass(this.inputStatusMixins.focus)
        new this.$coc.$(this.jQueryComponentId).AddClass( // eslint-disable-line
          this.inputStatusMixins.error
        )
      }
    },
    // Controllers
    meta(meta) {
      this.eventController.HandleMeta(meta)
    },
    reset() {
      this.input = null
      this.isFired = false
      this.error = null
      this.watchMyDom()
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    submit() {
      this.isFired = true
      this.eventController.Submit()
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    update() {
      this.input = arguments[0]
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    },
    clear() {
      this.input = ''
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
      return this.model.control
    }
  }
}
</script>

<style lang="css" scoped>
</style>
