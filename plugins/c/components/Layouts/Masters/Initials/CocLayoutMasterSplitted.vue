<template>
  <div class = "coc-house-keeper" >
    <coc-master-nav v-bind = "nav">
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
            class="name col coc-padding-x-15px coc-padding-y-0 coc-margin-0"
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
    <coc-watch-my-window v-model = "win" />
    <div class="row coc-margin-top-3rem">
      <div 
        v-if = "slide == 'left' || (win && !win.isSmall)"
        :class = "['coc_house_keeper col s12', `l${ratio.left}`]">
        <div class="row">
          <slot name = "left"/>
        </div>
        <div 
          class="row coc_house_keepesr">
          <div 
            v-if = "win && !win.isSmall" 
            class="row  coc_house_keeper">
            <a @click = "slide = slide == 'right' ? 'left' : 'right'">
              <slot name = "toggleLeft"> Toggle </slot>
            </a>
          </div>
        </div>
      </div>
      <div 
        v-if = "(win) || slide == 'right'"
        :class = "['coc_house_keeper col s12', `l${ratio.right}`]">
        <slot name = "right" />
        <div 
          v-if = "win" 
          class="row coc_house_keeper">
          <a 
            @click = "slide = slide == 'right' ? 'left' : 'right'">
            <slot name = "toggleRight"> Toggle </slot>
          </a>
        </div>
      </div>
    </div>
    <coc-master-footer v-bind = "bind && bind.footer ? bind.footer : {}">
      <slot name = "footer"/>
    </coc-master-footer>
  </div>
</template>

<script>
export default {
  name: 'Coclosplitted',
  props: {
    bind: {
      type: Object,
      default: null
    },
    ratio: {
      type: Object,
      default() {
        return { left: 6, right: 6 }
      }
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
      getstartedcollapse: null,
      win: null,
      slide: 'left'
    }
  },
  watch: {
    slide: {
      immediate: true,
      handler(slide) {
        this.$emit('input', { slide })
      }
    }
  },
  methods: {
    asset(url) {
      return `/${url}`
    }
  }
}
</script>

<style lang="css" >
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
