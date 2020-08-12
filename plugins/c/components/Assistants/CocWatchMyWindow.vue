<template>
  <div>
    <div 
      v-if ="showWb && pwb" 
      :id = "_uid">
      <slot/>
    </div>
    <pre
      v-if = "dev"
      class = "text-code coc-background-bg coc-primary-text coc-border-border coc-border-1 coc-standard-border-radius coc-padding-5px coc-margin-5px animated fadeIn">
      <h1 class = "text-thin">CocWatchMyWindow Dev Mode </h1>
    <code>{{ result }}</code>
    </pre>
  </div>
</template>

<script>
export default {
  name: 'CocWatchMyWindow',
  props: {
    small: {
      type: Number,
      default: 750
    },
    midium: {
      type: Number,
      default: 1024
    },
    pwb: {
      type: Boolean,
      default: false
    },
    dev: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      result: {},
      height: 0,
      width: 0,
      bodyHeight: 0,
      bodyWidth: 0,
      isSmall: false,
      isMidium: false,
      isLarge: false,
      isFocused: true,
      showWb: false,
      fromBlur: false,
      blurInterval: null,
      blurCounter: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    emit(e) {
      this.width = screen.width
      this.height = screen.height
      this.bodyWidth = document.body.offsetWidth
      this.bodyHeight = document.body.offsetHeight
      this.isSmall = this.bodyWidth <= this.small
      this.isMidium =
        this.bodyWidth > this.small && this.bodyWidth <= this.midium
      this.isLarge = this.bodyWidth > this.midium
      this.result = {
        height: this.height,
        width: this.width,
        bodyHeight: this.bodyHeight,
        bodyWidth: this.bodyWidth,
        isSmall: this.isSmall,
        isMidium: this.isMidium,
        isLarge: this.isLarge,
        isFocused: this.isFocused
      }
      this.$emit('input', this.result)
      this.$emit(e, this.result)
    },
    init() {
      if (process.browser) {
        this.addEvents()
      }
    },
    addEvents() {
      const vm = this
      vm.emit('init')
      window.addEventListener('resize', () => {
        vm.emit('resize')
      })
      window.addEventListener('focus', () => {
        if (!vm.isFocused) vm.fromBlur = true
        vm.isFocused = true
        vm.emit('focus')
      })
      window.addEventListener('blur', () => {
        vm.fromBlur = false
        vm.isFocused = false
        vm.emit('blur')
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
