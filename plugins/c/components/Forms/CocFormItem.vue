<template>
  <div>
    <coc-input 
      v-if = "item.type === 'input'" 
      v-model = "val"
      :ref = "reference"
      :scope = "scope"
      v-bind = "item.props"
      light-model
      v-on="$listeners" >
      <template v-if = "item.slots && item.slots.length">
        <coc-form-item
          v-for = "(slot,s) in item.slots"
          :reference = "slot.ref"
          :key = "s"
          :item = "slot"
          :slot = "slot.name" 
          :scope = "scope" />
      </template>
    </coc-input>
    <coc-select 
      v-if = "item.type === 'select'" 
      v-model = "val"
      v-bind = "item.props"
      :ref = "reference"
      :scope = "scope"
      light-model
      v-on="$listeners">
      <template v-if = "item.slots && item.slots.length">
        <coc-form-item
          v-for = "(slot,s) in item.slots"
          :reference = "slot.ref"
          :key = "s"
          :item = "slot"
          :slot = "slot.name" 
          :scope = "scope" />
      </template>
    </coc-select>
    <coc-radio 
      v-if = "item.type === 'radio'" 
      v-model = "val"
      v-bind = "item.props"
      :ref = "reference"
      :scope = "scope"
      light-model
      v-on="$listeners" >
      <template v-if = "item.slots && item.slots.length">
        <coc-form-item
          v-for = "(slot,s) in item.slots"
          :reference = "slot.ref"
          :key = "s"
          :item = "slot"
          :slot = "slot.name" 
          :scope = "scope"/>
      </template>
    </coc-radio>
    <coc-date
      v-if = "item.type === 'date'" 
      v-model = "val"
      v-bind = "item.props"
      :ref = "reference"
      :scope = "scope"
      light-model
      v-on="$listeners" >
      <template v-if = "item.slots && item.slots.length">
        <coc-form-item
          v-for = "(slot,s) in item.slots"
          :reference = "slot.ref"
          :key = "s"
          :item = "slot"
          :slot = "slot.name" 
          :scope = "scope" />
      </template>
    </coc-date>
    <coc-button 
      v-if = "item.type === 'button'" 
      :ref = "reference"
      v-bind = "item.props"
      :scope = "scope"
      v-on="$listeners"
      @coc-validation-passed = "$emit('local-validation-accepted')"/>
  </div>
</template>

<script>
export default {
  name: 'CocFormItem',
  props: {
    item: {
      type: Object,
      default: null
    },
    scope: {
      type: Array,
      default: null
    },
    reference: {
      type: String,
      required: true
    },
    value: {
      type: [Object, String, Array, Number],
      default: null
    }
  },
  data() {
    return {
      val: ''
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.val = val
      }
    },
    val: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
