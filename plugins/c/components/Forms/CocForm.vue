<template>
  <div class = "row">
    <div 
      v-for = "(step, s) in fields"
      v-bind = "step.bind" 
      :class = "[{ 'hidden' : autoHide && stepperCurrent !== s }, step.bind && step.bind.class ? step.bind.class : 'row']"
      :key = "s">
      <div v-if = "fields.length > 1">
        <p :class = "[ step.titleClass ? step.titleClass : 'text-md text-bold coc-primary-text' ]">{{ step.step }}</p>
        <p
          v-if = "step.content"
          :class = "[ step.contentClass ? step.contentClass : 'text-smd coc-content-text' ]">{{ step.content }}</p>
      </div>
      <coc-form-item 
        v-for = "(item, index) in step.fields" 
        :reference = "item.ref"
        :key = "index"
        v-model = "items[item.ref]"
        v-bind = "item.bind ? item.bind : { class : item.type === 'button' ? 'row right' : 'row' }"
        :scope = "getScope(item, index, s)" 
        :item = "item"
        @local-validation-accepted = "handleButtonAccepted(s, $event)"/>
      <slot
        v-if = "s > 0 && !hideBack"
        :name = "`step-${s}-back`"
        :handler = "handleStepClick"
        :index = "s">
        <i-button
          icon = "ios-arrow-back"
          @click = "handleStepClick">Back</i-button>
      </slot>
    </div>
    <Steps
      v-if = "fields.length > 1 && !hideStepper"
      :current = "stepperCurrent"
      class = "row">
      <Step 
        v-for = "(step, s) in fields" 
        :key = "s"
        :title="step.step" 
        :content = "step.content ? step.content : `Step ${s} `"
        @click = "handleStepClick(s)" />
    </Steps>
  </div>
</template>
<script>
export default {
  name: 'CocForm',
  props: {
    fields: {
      type: Array,
      required: true
    },
    autoHide: {
      type: Boolean,
      default: false
    },
    hideStepper: {
      type: Boolean,
      default: false
    },
    hideBack: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Object, String, Array, Number],
      default: null
    }
  },
  data() {
    return {
      items: {},
      stepperCurrent: 0
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.items = val
      }
    },
    items: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {},
  methods: {
    getScope(item, index, stepIndex) {
      if (item.type === 'button') {
        if (stepIndex === this.fields.length - 1) {
          return [`coc-form-${this._uid}`]
        } else {
          return [`coc-form-${this._uid}-step-${stepIndex}`]
        }
      } else {
        return [
          `coc-form-${this._uid}`,
          `coc-form-${this._uid}-step-${stepIndex}`
        ]
      }
    },
    handleButtonAccepted(index) {
      this.stepperCurrent = index + 1
    },
    handleStepClick(e) {
      this.stepperCurrent > 0 && this.stepperCurrent--
    }
  }
}
</script>

<style lang="css" scoped>
</style>
