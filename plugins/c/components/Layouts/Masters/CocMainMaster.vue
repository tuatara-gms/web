<template>
  <div>
    <coc-watch-my-window v-model = "windowWatcher"/>
    <coc-master-nav
      v-bind = "nav"
      :actions = "actions">
      <slot 
        slot = "nav-title" 
        name = "nav-title">
        <nuxt-link
          to="/"
          class="text-super text-code coc-primary-text coc-nav-brand col coc-padding-0"
        >
          <coc-avatar
            v-coc-mouse-over="'jello'"
            v-coc-mouse-leave="'rubberBand'"
            :source="$coc.App.logo.primary"
            scale = "40px"
            class="logo col coc-padding-0 animated"/>
          <span
            class="name col coc-text-bold coc-padding-x-15px coc-padding-y-0 coc-margin-0"
          >{{ $coc.App.brandName }}</span>
        </nuxt-link>
      </slot>
      <slot
        slot = "nav-middle"
        name = "nav-middle" />
      <slot 
        slot = "nav-actions" 
        name = "nav-actions" />
    </coc-master-nav>
    <main>
      <slot name = "default"/>
      <coc-layout-docker
        v-if = "!hideDocker" 
        :window-watcher = "windowWatcher" 
        v-bind = "docker"/>
    </main>
    <coc-master-footer>
      <slot name = "footer"/>
    </coc-master-footer>
  </div>
</template>

<script>
import CocMasterNav from '../Partials/CocMasterNav.vue'
import CocMasterFooter from '../Partials/CocMasterFooter.vue'
export default {
  name: 'CocMainMaster',
  components: {
    CocMasterNav,
    CocMasterFooter
  },
  props: {
    docker: {
      type: Object,
      default: null
    },
    actions: {
      type: Array,
      default: null
    },
    hideDocker: {
      type: Boolean,
      default: false
    },
    nav: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      windowWatcher: null
    }
  }
}
</script>

<style lang="css" scoped>
.coc-nav-brand {
  margin-left: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
  height: 40px;
}
.coc-nav-brand .logo {
  width: 40px !important;
  height: 40px !important;
  background-color: transparent;
}
.coc-nav-brand .name {
  height: 40px !important;
  line-height: 40px;
}
</style>
