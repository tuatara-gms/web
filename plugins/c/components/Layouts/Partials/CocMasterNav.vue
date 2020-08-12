<template>
  <coc-nav :classes = "computedClasses">
    <slot 
      slot = "title" 
      name = "nav-title" />
    <slot 
      slot = "middle" 
      name = "nav-middle" />
    <slot 
      slot = "actions" 
      name = "nav-actions" />
  </coc-nav>
</template>

<script>
export default {
  name: 'CocMasterNav',
  props: {
    actions: {
      type: Array,
      default: null
    },
    classes: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      cocPureInput: null
    }
  },
  computed: {
    computedClasses() {
      return {
        nav:
          'coc-main-nav coc-primary-text coc-primary-hover-text row house-keeper coc-z-index-3 coc-background-bg',
        title: 'left col l3 s8 coc-nav-section house-keeper',
        middle: 'col l5 coc-nav-section hide-on-med-and-down house-keeper',
        actions: 'right col l3 s4 coc-nav-section house-keeper',
        ...this.classes
      }
    }
  },
  methods: {
    excuteCallback(action, e) {
      if (action.items) {
        const item = action.items.filter(i => i.label === e)
        if (
          item.length &&
          item[0].callback &&
          typeof item[0].callback === 'function'
        ) {
          item[0].callback()
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
.coc-main-nav {
  height: 70px;
  position: fixed;
  top: 0;
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
}
.coc-nav-section {
  height: 70px;
}
</style>
