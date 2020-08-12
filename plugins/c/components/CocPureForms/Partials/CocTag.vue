<template>
  <div :class = "parentClass">
    <span
      :class="[`coc-${color}-section-${type}`,`coc-${borderRadius}-border-radius`,`coc-text-${fontSize}`]"
      class="coc-padding-4px col s12"
      style="display: inline-block; border : 1px solid black;"
    >
      <div class="col s12">
        <coc-avatar
          v-if = "avatar"
          v-bind = "avatar"
        />
        <slot 
          name="default" 
          class=""/>
      </div>
    </span>
  </div>
</template>

<script>
export default {
  name: 'CocTag',
  props: {
    color: {
      type: String,
      default: 'primary',
      required: true
    },
    type: {
      type: String,
      default: 'outline',
      required: true
    },
    borderRadius: {
      type: String,
      default: 'standerd',
      required: true
    },
    fontSize: {
      type: String,
      default: 'normal',
      required: true
    },
    avatar: {
      type: Object,
      default: null
    },
    parentClass: {
      type: String,
      default: ''
    },
    childClass: {
      type: String,
      default: 'coc-padding-x-4px coc-padding-y-2px'
    }
  },

  data() {
    return {}
  }
}
</script>

<style lang="css" scoped>
</style>
