<template>
  <nav 
    :class="computedClasses.nav" >
    <div :class = "computedClasses.holder">
      <div :class="[computedClasses.title, $coc.GetAlignment().master]">
        <slot 
          name ="title" />
      </div>
      <div :class="computedClasses.middle">
        <slot name = "middle"/>
      </div>
     
      <div :class="[computedClasses.actions, $coc.GetAlignment().inverse]">
        <slot 
          name="actions" />
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'CocNav',
  props: {
    classes: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    computedClasses() {
      return {
        ...{
          nav:
            'coc-primary-background-shade-1-bg coc-secondary-text row coc-margin-0 coc-padding-x-0 coc-padding-y-10px',
          holder: 'row coc-house-keeper',
          title:
            'col s4 coc-margin-0 coc-padding-x-10px coc-text-heading center',
          middle: 'col s4 house-keeper coc-padding-x-0 coc-padding-y-10px',
          actions: 'col s4 house-keeper coc-padding-x-0 coc-padding-y-10px'
        },
        ...this.classes
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
