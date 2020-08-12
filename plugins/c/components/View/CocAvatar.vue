<template>
  <div
    :style = "{ width: scale, height: scale }"
    :class = "parentClass"
    @click = "$emit('click')">
    <span
      v-if = "icon || onError || !source"
      :style = "{ width: scale, height: scale, fontSize: scale }"
      :class = "classes"/>
    <img
      v-else
      :src="source"
      :style = "{ width: scale, height: scale }"
      :class = "classes"
      @error = "handleImageError">
  </div>
</template>

<script>
export default {
  name: 'CocAvatar',
  props: {
    fallbackIcon: {
      type: String,
      default: 'ivu-icon ivu-icon-ios-color-filter'
    },
    icon: {
      type: String,
      default: null
    },
    source: {
      type: String,
      default: null
    },
    scale: {
      type: String,
      default: '50px'
    },
    borderRadius: {
      type: String,
      default: 'standard'
    },
    childClasses: {
      type: Array,
      default() {
        return ['col house-keeper']
      }
    },
    parentClass: {
      type: Array,
      default() {
        return ['row house-keeper coc-inline-block']
      }
    }
  },
  data() {
    return {
      onError: false
    }
  },
  computed: {
    classes() {
      const c = [`coc-${this.borderRadius}-border-radius`, ...this.childClasses]
      if (this.icon) {
        c.push(this.icon)
      }
      if (this.onError || !this.source) {
        c.push(this.fallbackIcon)
      }
      return c
    }
  },
  methods: {
    handleImageError() {
      this.onError = true
    }
  }
}
</script>

<style lang="css" scoped>
</style>
