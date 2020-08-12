<template>
  <footer :class = "classes.nav">
    <slot>
      <div class = "container bounds-respect-padding-top-10px bounds-respect-padding-bottom-10px">
        <p class = "text-lg text-code">{{ $coc.App.name }}</p>
        <p class = "text-smd">{{ $coc.App.description }}</p>
        <a
          v-if = "$coc.App.repository && $coc.App.repository.url"
          :href = "$coc.App.repository.url.split('git+').join('')"
          class = "white-text text-mg-lg">
          <Icon type="logo-github" />
          <span class="text-sm text-thin">GitHub</span>
        </a>
      </div>
    </slot>
    <slot name = "bottom">
      <div class = "bounds-respect-padding-top-10px coc-padding-bottom-6vh alpha-white-1">
        <div class="container">
          <span>Version {{ $coc.App.version }}</span>
          <span class = "right">{{ $coc.App.name }} by {{ $coc.App.author }} {{ $moment().format('YYYY') }} &copy; </span>
        </div>
      </div>
    </slot>
  </footer>
</template>

<script>
export default {
  name: 'CocMasterFooter',
  props: {
    classes: {
      type: Object,
      default: () => {
        return {
          nav: 'coc-primary-bg  coc-secondary-text'
        }
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="css" scoped>
.alpha-white-1{
	background-color: rgba(255,255,255,0.1);
}
</style>
